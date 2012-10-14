var TasksPatch = require('../components/task_patch');
var RevisionPatch = require('../components/revision_patch');
var DBPatch = require('../components/dbpatch');
var Emitter           = process.EventEmitter;


module.exports = User.inherits( global.autodafe.db.ActiveRecord );

function User( params ) {
  this._init( params );
}


//User.prototype._init = function( params ){
//  User.parent._init.call( this, params );
//
//  this.features_collected = false;
//  this.features           = [];
//}


User.prototype.get_table_name = function(){
  return 'user';
}


User.prototype.attributes = function(){
  return {
    pass      : {
      'safe required' : true,
      'postfilters'   : 'md5'
    },
    email     : {
      'safe required email' : true,
      'prefilters'          : 'trim'
    }
  };
}


User.prototype.cookie_hash = function(){
  return this.pass.md5();
}



User.prototype.relations = function () {
  return {
    'tasks'       : this.has_many('task').by('user_id')
//    'dbfeatures'  : this.has_many('feature').by( 'user_has_feature( user_id, feature_id )' )
    }
}


//  public function calculate_features() {
//    if ( !$this->dbfeatures ) return false;
//
//    if ( !$this->features_collected )
//    foreach ( $this->dbfeatures as $db_feature ) {
//    $now = new DateTime();
//    $feature_expire_date = $this->get_addon_expire_date( $db_feature->name );
//
//    if ( $now->getTimestamp() < $feature_expire_date ) array_push( $this->features, $db_feature->name );
//    }
//  }
//

  /*
  Features:
  DRAGNDROP
  */
//  public function has_feature( $feature ) {
//    return true;
//    return in_array( $feature, $this->features );
//    }
//
//
//  public function get_features() {
//    return array( 'DRAGNDROP' );
//    return $this->features;
//    }
//
//
//  public function get_addon_expire_date( $addon_name) {
//    $addon = UserFeature::model()->with('feature')->find( array(
//    'condition' => 'user_id=:user_id and feature.name=:addon_name',
//    'params'    => array(
//    ':user_id'    => 1,//Yii::app()->user->getId(),
//    ':addon_name' => $addon_name
//    )
//    )
//    );
//
//    $date = new DateTime( $addon->expire_date );
//    return $date->getTimestamp();
//    }


User.prototype.save_actions = function ( client_actions, revision, listener ) {
  var tasks  = this.tasks,
      self = this,
      emitter = new Emitter;

  // проверяем актуальна ли ревизия, состояние которо отражено на клиенте. Если это так, то собираем патч деуйствий
  // произошедших за время с последнего обновления, иначе патчем будет создание всех существующих на данный момент
  // тасков

  listener.stack <<= this.models.revision.find_by_pk( revision, 'user_id = :user_id', { user_id : this.id })
  listener.success( function( client_revision ){

    var reinit          = !client_revision;

    emitter.on( 'server_actions', function( server_actions ) {
      self._server_actions( {
        sa : server_actions,
        ca : client_actions,
        listener : listener,
        emitter  : emitter,
        reinit   : reinit
      })
    } )

    var server_actions;
    if ( reinit ){
      server_actions = new TasksPatch( {
          tasks : tasks,
          name  : 'task_patch',
          app   : self.app
          } );
      emitter.emit( 'server_actions', server_actions );
    }
    else {
      listener.stack <<= self.models.revision.find_all( 'id>:id and user_id=:user_id' ,{
        id      : revision,
        user_id : self.id
      })
      listener.success( function( revisions ){
        server_actions = new RevisionPatch ( {
          revisions : revisions,
          user_id   : self.id,
          name      : 'revision_patch',
          app       : self.app
        });
        emitter.emit( 'server_actions', server_actions );
      })
    }

  })
  return emitter;
}

User.prototype._server_actions = function ( params ) {
  var self = this;

  var server_side_patch = params.ca.diff( params.sa );
  var db_patch = new DBPatch( { name : 'dbpatch', app : self.app } );
  db_patch.copy_from( server_side_patch );
  params.db_patch = db_patch;

  if ( Object.isEmpty( db_patch.create ) && Object.isEmpty( db_patch.update ) && db_patch.remove.length == 0 )
    self._save( params );
  else {
    params.listener.stack <<= db_patch.apply_to_base( self );
    params.listener.success( function(){
      self._save( params );
    })
  }
}

User.prototype._save = function ( params ) {
  var self = this;

  if ( params.db_patch.index_type_is( params.db_patch.CLIENT ) ) params.db_patch.set_server_index();
  if ( Object.isEmpty( params.db_patch.create ) && Object.isEmpty( params.db_patch.update ) && params.db_patch.remove.length == 0 )
    this._get_template_params( params );
  else{
    params.listener.stack <<= params.db_patch.save( self );// || 0;//$_GET[ 'revision' ];//$user->revision_id || $_GET[ 'revision' ] || 0;
    params.listener.success( function(){
      self._get_template_params( params );
  })
  }
}

User.prototype._get_template_params = function ( params ) {
  // в db_patch есть индекс, потому что там было apply_to_base

  params.db_patch.copy_from( params.ca );
  var client_side_patch = params.sa.diff( params.db_patch );

  var template_params = client_side_patch.to_array();
  template_params.revision = this.revision_id;
  template_params.reinit   = params.reinit;

  params.emitter.emit( 'success', template_params );
}