var ActiveRecord = global.autodafe.db.ActiveRecord;
var TasksPatch = require('../components/task_patch');
var RevisionPatch = require('../components/revision_patch');
var DBPatch = require('../components/dbpatch');
var Emitter           = process.EventEmitter;


module.exports = User.inherits( ActiveRecord );

function User( params ) {
  this._init( params );
  this.pass2 = '';
  this.features_collected = false;
  this.features           = [];
}

User.prototype.get_table_name = function(){
  return 'user';
}

User.prototype.attributes = function(){
  return {
    pass      : 'safe required',
    email     : 'safe required email',
    realpass  : 'safe'
  };
}

//
//    array( 'pass,email', 'length', 'max'=>128, 'min' => 6 ),
//    array( 'email,pass', 'required'                       ),
//    array( 'email',      'email'                          ),
//    array( 'pass2', 'required', 'on'=>'register'          ),
//    array( 'realpass', 'required', 'on'=>'register'       ),
//    array( 'pass2', 'compare', 'on'=>'register', 'compareAttribute' => 'realpass' ),
//    array( 'email', 'unique',
//    'on'=>'register',
//    'message' => 'Пользователь с таким email уже зарегистрирован в системе'
//    ),
//    array( 'realpass', 'match',
//    'on'=>'register',
//    'pattern' => "/^[a-zA-Z0-9.,!\\|?@#$%\\^&*()\\[\\]{}_+-=~:;'\"`<>\\/\\\\]*$/",
//  'message' => "Пароль должен содержать только цифры, латинские буквы и знаки препинания"
//  )
//  );
//  }



User.prototype.relations = function () {
  return {
    'tasks'       : this.has_many('task' ).by( 'user_id' )
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

    emitter.on( 'server_actions', function( server_actions ){

      var server_side_patch = client_actions.diff( server_actions );
      var db_patch = new DBPatch( { name : 'dbpatch', app : self.app } );
      db_patch.copy_from( server_side_patch );
      listener.stack <<= db_patch.apply_to_base( self );
      listener.success( function(){
        listener.stack <<= db_patch.save( self );// || 0;//$_GET[ 'revision' ];//$user->revision_id || $_GET[ 'revision' ] || 0;
        listener.success( function(){

        // в db_patch есть индекс, потому что там было apply_to_base

          db_patch.copy_from( client_actions );
          var client_side_patch = server_actions.diff( db_patch );

          var template_params = client_side_patch.to_array();
          template_params.revision = self.revision_id;
          template_params.reinit   = reinit;

          emitter.emit( 'success', template_params );
        })
      })
    })

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
