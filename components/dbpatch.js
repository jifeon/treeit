var Patch = require('../components/patch');
var Emitter           = process.EventEmitter;

module.exports = DBPatch.inherits( Patch );

function DBPatch( params ){
  this._init( params );
}

DBPatch.prototype._init = function( params ){
  if( params && params.actions ) params.actions = JSON.parse( params.actions );
  DBPatch.parent._init.call( this, params );
  this.client2serv = {};
}

DBPatch.prototype.apply_to_base = function( user ) {
  var emitter = new Emitter;
  var listener = new global.autodafe.lib.Listener({});

  listener.stack <<= this.apply_create_to_base( user );
  listener.stack <<= this.apply_update_to_base();
  listener.stack <<= this.apply_remove_to_base();
  listener.success( function(){
    emitter.emit( 'success' );
  })

  return emitter;
}

DBPatch.prototype.apply_create_to_base = function( user ) {

  var listener = new global.autodafe.lib.Listener({}),
      emitter = new Emitter,
      self = this;

  for( var task_params in this.create ) {
    var task = new this.app.models.task;
    task.text       = this.create[ task_params ].text;
    task.done       = this.create[ task_params ].done;
    task.ex_params  = this.create[ task_params ].ex_params;
    task.user_id    = user.id;
    if ( this.create[ task_params ].prev_serv_id   != null ) task.prev_id    = this.create[ task_params ].prev_serv_id;
    if ( this.create[ task_params ].next_serv_id   != null ) task.next_id    = this.create[ task_params ].next_serv_id;
    if ( this.create[ task_params ].parent_serv_id != null ) task.parent_id  = this.create[ task_params ].parent_serv_id;

    this.client2serv[ task_params ] = task;

    listener.stack <<= task.save();
  }
  listener.success( function(){
    self.define_serv_params( listener, emitter );
  })
  return emitter;
}


DBPatch.prototype.define_serv_params = function( listener, emitter ) {

  for( var task_params in this.create ) {

    var task = this.client2serv[ this.create[ task_params ].id ];
    if ( task ) {

      this.define_serv_id( 'prev',   this.create[ task_params ], task );
      this.define_serv_id( 'next',   this.create[ task_params ], task );
      this.define_serv_id( 'parent', this.create[ task_params ], task );

      listener.stack <<= task.save();
    }
  }
  listener.success( function(){
    emitter.emit( 'success' );
  })
}


DBPatch.prototype.define_serv_id = function( id_type, task_params, task ) {
  var s = id_type + "_serv_id";
  if ( task_params[s] != null ) return false;

  s = id_type + "_id";
  var client_id = task_params[ s ];
  if ( client_id == null ) return true;

  if ( this.client2serv[ client_id ] ) return true;
  var link_task = this.client2serv[ client_id ];

  s = id_type + "_serv_id";
  task_params[ s ]  = link_task.id;
  var id_name       = id_type + '_id';
  task.id_name      = link_task.id;
  return true;
}


DBPatch.prototype.apply_update_to_base = function() {

  var listener = new global.autodafe.lib.Listener({}),
      emitter  = new Emitter,
      self     = this,
      i_array  = [];
  for( var task_params in this.update ) i_array.push( this.update[ task_params ].serv_id );
  listener.stack <<= this.app.models.task.find_all_by_pk( i_array );
  listener.success( function( tasks ){
    if( tasks.length == 0 ) return emitter.emit( 'success' );
    tasks.forEach( function( task ){
      var update_task = self.get_task_by_attribute( 'update', 'serv_id', task.id );
      task.text      = update_task.text;
      task.done      = update_task.done;
      task.ex_params = update_task.ex_params;
      if ( !self.define_serv_id( 'prev', update_task, task ) ) task.prev_id = update_task.prev_serv_id;
      if ( !self.define_serv_id( 'next', update_task, task ) ) task.next_id = update_task.next_serv_id;
      if ( !self.define_serv_id( 'parent', update_task, task ) ) task.parent_id = update_task.parent_serv_id;
      listener.stack <<= task.save();
    })
    listener.success( function(){
      emitter.emit('success');
    })
  })
  return emitter;
}

DBPatch.prototype.apply_remove_to_base = function() {
  var listener = new global.autodafe.lib.Listener({}),
      emitter  = new Emitter,
      self     = this;
  if( this.remove.length == 0 ) return emitter.emit( 'success' );
  this.remove.forEach( function( task ){
    listener.stack <<= self.app.models.task.recursively_remove( task );
    listener.success( function(){
      emitter.emit( 'success' )
    } )
  } )
  return emitter;
}

DBPatch.prototype.save = function( user ) {
  var emitter = new Emitter;
  var listener = new global.autodafe.lib.Listener({});

  if ( this.index_type_is( this.CLIENT ) ) this.set_server_index();
  if ( Object.isEmpty( this.create ) && Object.isEmpty( this.update ) && this.remove.length == 0 ) return null;
  var self = this;
  revision = new this.app.models.revision;
  revision.actions = JSON.stringify( this.to_array() );//serialize( $this->to_array() );
  revision.user_id = user.id;
  listener.stack <<= revision.save();
  listener.success( function(){
    listener.stack <<= self.app.models.revision.remove_all( 'id < :min_id and user_id = :user_id', {
      min_id  : revision.id - 30,
      user_id : user.id
    } );
    listener.success( function(){
      user.revision_id = revision.id;
      listener.stack <<= user.save();
      listener.success( function(){
        emitter.emit( 'success' );
      })
    })
  })
  return emitter;
}


DBPatch.prototype.set_server_index = function( clear_client_params ) {
  if( clear_client_params == null ) clear_client_params = true;
  this.create = this.set_server_index_array( this.create, clear_client_params );
  this.update = this.set_server_index_array( this.update, clear_client_params );

  this.index_type = this.SERVER;
}


DBPatch.prototype.set_server_index_array = function( client_index_array, clear_client_params ) {
  var server_index_array = {};

  for ( var task_params in client_index_array ) {
    var serv_id = client_index_array [ task_params ].serv_id;
    if ( serv_id == null ) {
      if ( this.client2serv[ client_index_array[ task_params ].id ] ){
        var task = this.client2serv[ client_index_array[ task_params ].id ];
        serv_id  = task.id;
        client_index_array [ task_params ].serv_id         = serv_id;
        client_index_array [ task_params ].next_serv_id    = task.next_id;
        client_index_array [ task_params ].prev_serv_id    = task.prev_id;
        client_index_array [ task_params ].parent_serv_id  = task.parent_id;
      }
    }
    if ( clear_client_params ) {
      client_index_array [ task_params ].id = null;
      client_index_array [ task_params ].next_id = null;
      client_index_array [ task_params ].prev_id = null;
      client_index_array [ task_params ].parent_id = null;
    }
    server_index_array[ serv_id ] = client_index_array [ task_params ];
  }

  return server_index_array;
}
