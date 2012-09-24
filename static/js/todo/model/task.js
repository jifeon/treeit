function Task ( params ) {
  this.init( params );
}

Task.prototype = new Ofio({
  modules   : [
    'ofio.id',
    'ofio.event_emitter',
    'ofio.logger',
    'ofio.utils',
    'ofio.json',
    'ofio.search',
    'task.patch',
    'task.subtasks',
    'queue.item'
  ],
  className   : 'Task',
  ignoreNulls : [ 'serv_id' ]
});


Task.prototype.initVars = function () {
  this.text           = '';
  this.done           = false;
  this.parent         = null;
  this.serv_id        = null;
  this.ex_params      = {};
  this.level          = null;

  this.bad_symbol_re  = /[^a-zA-Z0-9а-яА-ЯёЁ .,!\|?@#$%\^&*()\[\]{}_+-=~:;'"`<>\/\\]/g;
};


Task.prototype.redefineVars = function ( variable ) {
  switch ( variable ) {
    case 'parent':
      break;

    case 'level':
      if ( this.parent ) this.level = this.parent.level + 1;
      break;

    default: return false;
  }

  return true;
};


Task.prototype.init = function ( params ) {
  this.constructor.prototype.init.call( this, params );
  this.emit( 'create', params );
};


Task.prototype.get_params = function () {
  return {
    id              : this.id,
    parent_id       : this.parent ? this.parent.id      : null,
    next_id         : this.next   ? this.next.id        : null,
    prev_id         : this.prev   ? this.prev.id        : null,
    serv_id         : this.serv_id,
    parent_serv_id  : this.parent ? this.parent.serv_id : null,
    next_serv_id    : this.next   ? this.next.serv_id   : null,
    prev_serv_id    : this.prev   ? this.prev.serv_id   : null,
    text            : this.text,
    done            : this.is_done(),
    ex_params       : this.json_decode( this.ex_params, true, true )
  };
};


// ex_params
Task.prototype.set_ex_param = function ( param_name, value ) {
  if ( typeof this.ex_params != 'object' ) this.ex_params = {};
  if ( this.ex_params[ param_name ] == value ) return false; 
  this.ex_params[ param_name ] = value;
  this.emit( 'set_ex_param' );
};


Task.prototype.set_ex_params = function ( ex_params ) {
  ex_params = ex_params || '{}';

  try {
    eval( 'this.ex_params =' + ex_params );
  } catch ( e ) { this.ex_params = {}; }

  for ( var param_name in ex_params ) {
    this.ex_params[ param_name ] = ex_params[ param_name ];
  }
  this.emit( 'set_ex_param' );
};


Task.prototype.get_ex_param = function ( param_name ) {
  return this.ex_params ? this.ex_params[ param_name ] : null;
};


// text
Task.prototype.set_text = function ( text ) {
  text = text ? String( text ) : '';
  if ( this.text == text ) return false;
  this.text = text.replace( this.bad_symbol_re, '' );
  this.emit( 'set_text', text );
};


Task.prototype.get_text = function () {
  return this.text;
};


// done
Task.prototype.set_done = function ( done ) {
  done = Boolean( done );
  if ( this.done == done ) return false;
  this.done = done;
  this.emit( 'set_done', done );

  if ( this.done ) this.each_subtask( function () {
    this.set_done( done );
  } );
  else if ( this.parent ) this.parent.check_done();
};


Task.prototype.is_done = function () {
  return Boolean( this.done );
};


Task.prototype.check_done = function () {
  if ( !this.done ) return false;
  var self = this;
  this.each_subtask( function () {
    if ( !this.is_done() ) {
      self.set_done( false );
      return true;
    }
  } );
};


// serv_id
Task.prototype.set_serv_id = function ( serv_id ) {
  if ( serv_id == this.serv_id ) return false;
  if ( this.serv_id == null ) this.serv_id = serv_id;
  else this.log( 'reset serv_id in Task.set_serv_id', 'w' );
};


//parent
Task.prototype.set_parent = function ( parent ) {
  if ( !parent || this == parent )  return new Error( 'parent is not specified' );
  if ( this.parent == parent )      return false;
  this.parent     = parent;
  this.emit( 'set_parent', parent );
  return true;
};


Task.prototype.get_parent = function ( level ) {
  if ( !this.parent ) return null;
  if ( level == undefined || this.parent.get_level() <= level ) return this.parent;
  return this.parent.get_parent( level );
};


// side == before|after|in
Task.prototype.set_new_parent = function ( parent, sibling, side ) {
  var old_parent = this.parent;

  var set_parent_result = this.set_parent( parent );

  if ( side != 'in' ) {
    if ( Error.is( set_parent_result ) ) return set_parent_result;

    var method = side == 'before' ? 'get_next' : 'get_prev';
    if ( !set_parent_result && sibling == this[ method ]() )
      return new Error( 'New position and current position are same' );

    method = side == 'before' ? 'insert_before' : 'insert_after';

    if ( Error.is( this.parent.subtasks[ method ]( this, sibling ) ) )
      this.parent.add_subtask( this );
  }
  else this.parent.add_subtask( this );

  this.parent.update_levels();
  this.parent.check_done();
  this.emit( 'set_new_parent', parent, old_parent );
};


// next
Task.prototype.set_next = function ( next ) {
  if ( this.__ofio.modules[ 'queue.item' ].call( this, 'set_next', [ next ] ) )
    this.emit( 'set_next', next );
};


// prev
Task.prototype.set_prev = function ( prev ) {
  if ( this.__ofio.modules[ 'queue.item' ].call( this, 'set_prev', [ prev ] ) )
    this.emit( 'set_prev', prev );
};


// levels
Task.prototype.get_level = function () {
  return this.level || 0;
};


Task.prototype.update_levels = function () {
  var self = this;

  this.each_subtask( function() {
    this.level = self.level + 1;
    this.update_levels();
  } );
};


Task.prototype.remove_queue = function() {
  this.__ofio.modules[ 'queue.item' ].call( this, 'remove_queue' );
  this.emit( 'remove_queue' );
};