function TaskView ( params ) {
  this.init( params );
}


TaskView.model_index  = {};
TaskView.moving       = false;


TaskView.get_by_model_id = function ( id ) {
  return this.model_index[ id ] || null;
};


TaskView.prototype = new Ofio({
  modules   : [
    'wud.jquery',
    'ofio.triggers',
    'ofio.logger'
  ],
  className : 'TaskView'
});


TaskView.prototype.initVars = function () {
  this.page       = null;
  this.model      = null;
  this.elements   = {};

  this.active     = false;
  this.focused    = false;
  this.done       = null;
  this.collapsed  = false;

  this.undone_data          = {};
  this.undone_data_protect  = false;

  this.moved                = false;
  this._user_action_runned  = false;
};


TaskView.prototype.redefineVars = function ( variable ) {
  switch ( variable ) {
    case 'done':
      this.done = this.model.is_done();
      break;

    default: return false;
  }

  return true;
};


TaskView.prototype.init = function ( params ) {
  this.constructor.prototype.init.call( this, params );

  this.add_to_model_index();
  this.init_elements();
  this.add_handlers();
  this.init_props_from_model();
  this.init_model_triggers();

  this.runTrigger( 'task_view.init' );
};


TaskView.prototype.init_elements = function () {
  this.elements = {
    remove    : this.$.find('.remove').eq(0),
    create    : this.$.find('.create').eq(0)
  };
};


TaskView.prototype.add_handlers = function () {
  var self = this;

  this.$.click( function ( e ) {
    self.focus( 'click' );
    e.stopPropagation();
  } );

  this.elements.remove.click( function ( e ) {
    var text = self.model.get_text() ? '"' + self.model.get_text() + '"' : '';
    if ( confirm( 'Вы действительно хотите удалить подзадачу ' + text + '?' ) )
      self.model.remove();
    e.stopPropagation();
  } );

  this.elements.title.click( function ( e ) {
    e.stopPropagation();
  } );

  this.elements.title.focus( function () {
    self.focus( 'title_focus' );
  } );

  this.elements.title.blur( function () {
    self.save_title();
  } );

  this.elements.expander.click( function ( e ) {
    self.model.set_ex_param( 'collapsed', !self.is_collapsed() );
  } );

  this.elements.create.click( function ( e ) {
    self.create_subtask_model();
    e.stopPropagation();
  });
};


TaskView.prototype.init_props_from_model = function () {
  this.set_done( this.model.is_done() );
  this.set_title( this.model.get_text() );
  this.set_collapsed( this.model.get_ex_param( 'collapsed' ) );

  var self = this;
  this.model.each_subtask( function () {
    self.create_subtask( this );
  });
};


TaskView.prototype.init_model_triggers = function () {
  var self = this;

  this.model.addFunctionToTrigger( 'task.before_remove', function () {
    self.before_remove();
  } );

  this.model.addFunctionToTrigger( 'task.remove', function () {
    self.remove();
  } );

  this.model.addFunctionToTrigger( 'task.remove_task', function () {
    self.remove_task();
  } );

  this.model.addFunctionToTrigger( 'task.set_text', function () {
    self.set_title( self.model.get_text() );
  } );

  this.model.addFunctionToTrigger( 'task.set_done', function () {
    self.set_done( self.model.is_done() );
  } );

  this.model.addFunctionToTrigger( 'task.set_ex_param', function () {
    self.set_collapsed( self.model.get_ex_param( 'collapsed' ) );
  } );

  this.model.addFunctionToTrigger( 'task.set_next', function ( next_model ) {
    self.set_next( next_model );
  } );

  this.model.addFunctionToTrigger( 'task.set_prev', function ( prev_model ) {
    self.set_prev( prev_model );
  } );

  var create_subtask = function ( model ) {
    self.create_subtask( model );
  };
  
  this.model.addFunctionToTrigger( 'task.create_subtask', create_subtask );
  this.model.addFunctionToTrigger( 'task.add_subtask',    create_subtask );
};


TaskView.prototype.add_to_model_index = function () {
  TaskView.model_index[ this.model.id ] = this;
};


// focus_by = create | title_focus | hotkey | click | subtask
TaskView.prototype.focus = function ( focus_by ) {
  this.focused = true;
  this.check_active();

  if ( focus_by != 'title_focus' && focus_by != 'subtask' ) this.elements.title.focus();
};


TaskView.prototype.unfocus = function () {
  this.focused = false;
  this.check_active();
  this.save_title();
};


TaskView.prototype.set_active = function ( active ) {
  this.active = Boolean( active );
  this.check_active();
};


TaskView.prototype.check_active = function () {};


TaskView.prototype.before_set_done = function ( done, child_call ) {
  var self = this;
  this.undone_data_protect = true;

  this.model.each_subtask( function() {
    if ( done ) self.undone_data[ this.id ] = this.is_done();

    var task_view = TaskView.get_by_model_id( this.id );
    task_view.before_set_done( done, true );

    if ( !done && self.undone_data[ this.id ] === false ) this.set_done( false );
  } );

  this.undone_data_protect = false;

  if ( !child_call ) this.model.set_done( done );
};


TaskView.prototype.set_done = function ( done ) {
  if ( !done && !this.undone_data_protect ) this.undone_data = {};
  this.$[ done ? 'addClass' : 'removeClass' ]( 'done' );
};


TaskView.prototype.set_collapsed = function ( collapsed ) {
  //todo: optimize
  if ( window.page.inited ) this.redraw_life_task_links();
  this.runTrigger( 'task_view.set_collapsed' );
};


TaskView.prototype.is_collapsed = function () {
  return this.collapsed;
};


TaskView.prototype.set_title = function ( text ) {
  if ( text != this.get_title() ) this.elements.title.val( text );
};


TaskView.prototype.get_title = function () {
  return this.elements.title.val();
};


TaskView.prototype.remove_task = function () {
  this.redraw_life_task_links();
};


TaskView.prototype.before_remove = function () {
  if ( this.is_focused() ) this.focus_down();
};


TaskView.prototype.remove = function () {
  this.$.remove();
  delete TaskView.model_index[ this.model.id ];
  this.runTrigger( 'task_view.remove' );
};


TaskView.prototype.save_title = function () {
  this.model.set_text( this.get_title() );
};


TaskView.prototype.redraw_life_task_links = function () {
  var life_task = Task.getById( 'life' );
  life_task.each_subtask( function() {
    var task_view = TaskView.get_by_model_id( this.id );
    if ( task_view ) task_view.redraw_links();  
  } );
};


TaskView.prototype.redraw_links = function () {
  if ( !this.model.has_visible_subtasks() ) return 1;

  var self          = this;
  var opened_tasks  = 1;

  this.model.each_subtask( function () {
    var task_view = TaskView.get_by_model_id( this.id );
    if ( !task_view ) return false;
    task_view.set_last( false );

    opened_tasks += task_view.redraw_links();
    opened_tasks += task_view.additional_height();
  } );

  var last_task = this.model.subtasks.get_last();
  if ( last_task ) {
    var task_view = TaskView.get_by_model_id( last_task.id );
    if ( task_view ) task_view.set_last( true );
//    else this.log( 'can not find task_view in TaskView.redraw_links', 'w' );
  }

  return opened_tasks;
};


TaskView.prototype.additional_height = function () {
  return 0;
};


TaskView.prototype.create_subtask_model = function () {
  if ( this.is_collapsed() ) this.model.set_ex_param( 'collapsed', false );
  this._user_action_runned = true;
  var error = this.model.create_subtask();
  this._user_action_runned = false;
  if ( Error.is( error ) ) error.show();
};


TaskView.prototype.set_user_actions_runned = function ( status ) {
  this._user_action_runned = status;
};


TaskView.prototype.create_subtask = function ( model, todo_block ) {
  var prev      = model.get_prev();
  var prev_view = prev ? TaskView.get_by_model_id( prev.id ) : null;

  var parent    = prev_view ? null : this.elements.subtasks;
  var $         = this.page.elements.sample_block_item.clone().removeAttr( 'id' );
  if ( prev_view ) $.insertAfter( prev_view.$$() );

  var subtask = new TodoBlockItem({
    $           : $,
    parent      : parent,
    model       : model,
    todo_block  : todo_block,
    page        : this.page
  });
  if ( this._user_action_runned ) subtask.focus( 'create' );
};


TaskView.prototype.is_active = function () {
  return this.active;
};


TaskView.prototype.is_focused = function () {
  return this.focused;
};


TaskView.prototype.move_up = function () {
  this.moved      = true;
  TaskView.moving = true;
  this.model.move_up();
  this.moved      = false;
  TaskView.moving = false;
};


TaskView.prototype.move_down = function () {
  this.moved      = true;
  TaskView.moving = true;
  this.model.move_down();
  this.moved      = false;
  TaskView.moving = false;
};


TaskView.prototype.set_next = function ( next_model ) {
  if ( !next_model || ( TaskView.moving && !this.moved ) ) return false;
  var next_view = TaskView.get_by_model_id( next_model.id );
  if ( next_view ) this.$$().insertBefore( next_view.$$() );
  this.focus( 'hotkey' );
  this.moved = false;
  return true;
};


TaskView.prototype.set_prev = function ( prev_model ) {
  if ( !prev_model || ( TaskView.moving && !this.moved ) ) return false;
  var prev_view = TaskView.get_by_model_id( prev_model.id );
  if ( prev_view ) this.$$().insertAfter( prev_view.$$() );
  this.focus( 'hotkey' );
  this.moved = false;
  return true;
};


TaskView.prototype.focus_up           = function () {};
TaskView.prototype.focus_down         = function () {};
TaskView.prototype.set_last           = function ( is_last ) {};
TaskView.prototype.create_sibling     = function () {};
TaskView.prototype.move_inside        = function () {};
TaskView.prototype.move_outside       = function () {};
TaskView.prototype.get_caret_pos      = function () {
  return 0;
};