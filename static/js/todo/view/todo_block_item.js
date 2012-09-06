function TodoBlockItem ( params ) {
  this.init( params );
}


TodoBlockItem.prototype = new Ofio({
  extend    : TaskView,
  className : 'TodoBlockItem',
  modules   : [
    'ofio.utils',
    'ofio.text'
  ]
});

TodoBlockItem.max_nesting = 6;

TodoBlockItem.prototype.initVars = function () {
  this.extend.initVars.call( this );

  this.todo_block           = null;
  this.branch_width         = 18;
  this.bottom_branch_height = 10;
  this.task_height          = 19;
  this.normal_title_width   = 240;

  this.parent_active        = false;
};


TodoBlockItem.prototype.init = function ( params ) {
  this.extend.init.call( this, params );

  this.set_title_width();
  this.runTrigger( 'TodoBlockItem.init' );
};


TodoBlockItem.prototype.init_elements = function () {
  this.extend.init_elements.call( this );

  var self = this;

  this.elements.done = new Checkbox({
    $       : this.$.find('.mini_checkbox').eq(0),
    checked : this.done,
    oncheck : function () {
      self.before_set_done( this.is_checked() );
    }
  });

  this.elements.content     = this.$.find('.content').eq(0);

  this.elements.title       = new Textarea({
    $         : this.elements.content.find('.title').eq(0),
    callback  : function () {
      self.set_height( this.curent_height )
    }
  });

  this.elements.expander      = this.elements.content.find('.arrow').eq(0);
  this.elements.subtasks      = this.$.find('.sub_tasks').eq(0);
  this.elements.branch        = this.$.find('.branch').eq(0);
  this.elements.branch_link   = this.elements.branch.find('.branch_link');
  this.elements.branch_bottom = this.elements.branch.find('.branch_bottom');
};


TodoBlockItem.prototype.add_handlers = function () {
  this.extend.add_handlers.call( this );

  var self = this;

  this.$.mouseenter( function () {
    self.set_parent_active( true );
  } );

  this.$.mouseleave( function () {
    self.set_parent_active( false );
  } );

  this.elements.content.mouseenter( function () {
    self.set_active( true );
  } );

  this.elements.content.mouseleave( function () {
    self.set_active( false );
  } );
};


TodoBlockItem.prototype.init_props_from_model = function () {
  this.extend.init_props_from_model.call( this );

  this.check_arrow_visible();
};


TodoBlockItem.prototype.init_model_triggers = function () {
  this.extend.init_model_triggers.call( this );

  var self = this;
  var check = function () {
    self.check_arrow_visible();
  };

  this.model.addFunctionToTrigger( 'task.create_subtask', check );
  this.model.addFunctionToTrigger( 'task.add_subtask', check );
  this.model.addFunctionToTrigger( 'task.remove_task', check );

  this.model.addFunctionToTrigger( 'task.set_parent', function ( new_parent ) {
    self.set_parent( new_parent );
  } );

  this.model.addFunctionToTrigger( 'task.set_new_parent', function ( new_parent, old_parent ) {
    self.set_new_parent( new_parent, old_parent );
  } );
};


TodoBlockItem.prototype.focus = function ( focus_by, caret_position ) {
  this.todo_block.focus( 'subtask' );
  this.todo_block.set_focused_subtask( this );
  this.extend.focus.call( this, focus_by, caret_position );
  if ( focus_by == 'create' ) this.set_caret_position( this.elements.title.$[0], 0 );
  else if ( caret_position != undefined )
    this.set_caret_position( this.elements.title.$[0], this.utils.toInt( caret_position, 0 ) );
  this.runTrigger( 'TodoBlockItem.focus' );
};


TodoBlockItem.prototype.unfocus = function () {
  this.extend.unfocus.call( this );
  this.runTrigger( 'TodoBlockItem.unfocus' );
};


TodoBlockItem.prototype.check_active = function () {
  this.elements.content[ this.is_focused() || this.is_parent_active() ? 'addClass' : 'removeClass' ]( 'focused' );
  this.elements.content[ this.is_active() ? 'addClass' : 'removeClass' ]( 'active' );
  this.set_title_width();
};


TodoBlockItem.prototype.create_subtask = function ( model ) {
  this.extend.create_subtask.call( this, model, this.todo_block );
};


TodoBlockItem.prototype.set_collapsed = function ( collapsed ) {
  this.collapsed = collapsed == null ? false : Boolean( collapsed );
  this.elements.expander[ this.collapsed ? 'removeClass' : 'addClass' ]( 'expand' );
  this.elements.subtasks[ this.collapsed ? 'hide' : 'show' ]();

  this.extend.set_collapsed.call( this, collapsed );
};


TodoBlockItem.prototype.check_arrow_visible = function () {
  this.elements.expander.css( 'visibility', this.model.has_subtasks() ? 'visible' : 'hidden' );
};


TodoBlockItem.prototype.set_parent_active = function ( active ) {
  this.parent_active = active;
  this.check_active();
};


TodoBlockItem.prototype.is_parent_active = function () {
  return this.parent_active;
};


TodoBlockItem.prototype.focus_down = function () {
  this.focus_with_method( 'get_next_task' );
};


TodoBlockItem.prototype.focus_up = function () {
  this.focus_with_method( 'get_prev_task' );
};


TodoBlockItem.prototype.focus_with_method = function ( method ) {
  var task = this.model[ method ]();

  if ( task && method == 'get_next_task' && task.get_level() <= 1 )
    task = this.model.get_parent( 1 );

  if ( !task ) return false;

  var item = TaskView.get_by_model_id( task.id );
  if ( item ) {
    var caret_position  = this.get_caret_position( this.elements.title.$[0] );
    caret_position      = Math.max( 0,
      Math.round( caret_position - ( item.model.get_level() - this.model.get_level() ) * 2.8 ) //символы на смещение
    );

    // TODO: вернуть caret position
    var new_caret_position = method == 'get_next_task'
      ? this.elements.title.get_lines_count() == 1
        ? caret_position
        : 0
      : item.__className == "TodoBlockItem"
        ? item.elements.title.get_lines_count() == 1
          ? caret_position
          : item.elements.title.$[0].textLength
        : caret_position

    item.focus( 'hotkey', new_caret_position );
  }
};


TodoBlockItem.prototype.set_last = function ( is_last ) {
  if ( is_last ) this.elements.branch.addClass( 'last' );
  else this.elements.branch.removeClass( 'last' );
};


TodoBlockItem.prototype.redraw_links = function () {
  var opened_tasks = this.extend.redraw_links.call( this );
  this.elements.branch_link.height( this.task_height * ( opened_tasks - 1 ) );
  this.elements.branch_bottom.height(
    this.bottom_branch_height + ( this.additional_height() * ( this.task_height - 1 ) ) 
  );
  return opened_tasks;
};


TodoBlockItem.prototype.additional_height = function () {
  return this.elements.title.get_lines_count() - 1;
};


TodoBlockItem.prototype.set_title_width = function () {
  var max_nesting = this.is_max_nesting();

  this.elements.subtasks.css( {
    paddingLeft : max_nesting ? 0 : this.branch_width,
    overflow    : max_nesting ? 'hidden' : 'visible'
  } );

  this.elements.title.width(
    this.normal_title_width - ( this.get_noconflict_level() - 2 ) * this.branch_width
  );
};


TodoBlockItem.prototype.is_max_nesting = function () {
  return this.model.get_level() >= TodoBlockItem.max_nesting;
};


TodoBlockItem.prototype.get_noconflict_level = function () {
  return Math.min( this.model.get_level(), TodoBlockItem.max_nesting );
};


TodoBlockItem.prototype.create_sibling = function () {
  var parent_view = TaskView.get_by_model_id( this.model.parent.id );
  if ( parent_view ) {
    parent_view.set_user_actions_runned( true );
    this.model.parent.create_subtask( {}, this.model );
    parent_view.set_user_actions_runned( false );
  }
};


TodoBlockItem.prototype.set_next = function ( next_model ) {
  this.extend.set_next.call( this, next_model )
  var parent_view = TaskView.get_by_model_id( this.model.parent.id );
  if ( parent_view ) parent_view.redraw_links();
};


TodoBlockItem.prototype.set_prev = function ( prev_model ) {
  this.extend.set_prev.call( this, prev_model );
  var parent_view = TaskView.get_by_model_id( this.model.parent.id );
  if ( parent_view ) parent_view.redraw_links();
};


TodoBlockItem.prototype.move_inside = function () {
  this.moved      = true;
  TaskView.moving = true;
  this.model.set_new_parent( this.model.get_prev() );
  this.moved      = false;
  TaskView.moving = false;
};


TodoBlockItem.prototype.move_outside = function () {
  if ( this.model.get_level() <= 2 ) return false;

  this.moved      = true;
  TaskView.moving = true;
  this.model.set_new_parent( this.model.parent.parent, this.model.parent );
  this.moved      = false;
  TaskView.moving = false;
};


TodoBlockItem.prototype.set_parent = function ( new_parent ) {
  if ( !new_parent ) return false;
  var view = TaskView.get_by_model_id( new_parent.id );
  if ( !view ) return false;
  view.elements.subtasks.append( this.$$() );
};


TodoBlockItem.prototype.set_new_parent = function ( new_parent, old_parent ) {
  var old_parent_view = TaskView.get_by_model_id( old_parent.id );
  if ( old_parent_view ) old_parent_view.redraw_links();
  this.focus( 'hotkey' );
  this.model.req_each( function () {
    var view = TaskView.get_by_model_id( this.id );
    view.set_title_width();
  } );
};


TodoBlockItem.prototype.set_height = function ( h ) {
  this.elements.content.height( h );
  this.todo_block.redraw_links();
  this.runTrigger( 'todo_block_item.set_height' );
};


TodoBlockItem.prototype.get_caret_pos = function () {
  return this.get_caret_position( this.elements.title.$[0] );
};