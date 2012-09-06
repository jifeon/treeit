function TodoBlock ( params ) {
  this.init( params );
}


TodoBlock.prototype = new Ofio({
  extend    : TaskView,
  className : 'TodoBlock'
});


TodoBlock.prototype.initVars = function () {
  this.extend.initVars.call( this );

  this.focused_subtask = null;
};


TodoBlock.prototype.redefineVars = function ( variable ) {
  var extend_result = this.extend.redefineVars.call( this, variable );

  switch ( variable ) {
    case 'focused_subtask':
      break;

    default: return extend_result;
  }

  return true;
};


TodoBlock.prototype.init = function ( params ) {
  this.extend.init.call( this, params );

  this.runTrigger( 'TodoBlock.init' );
};


TodoBlock.prototype.init_elements = function () {
  this.extend.init_elements.call( this );

  var self = this;

  this.elements.done = new Checkbox({
    $       : this.$.find('.big_checkbox'),
    checked : this.done,
    oncheck : function () {
      self.before_set_done( this.is_checked() );
    }
  });

  this.elements.title     = this.$.find('.title').eq(0);
  this.elements.clean     = this.$.find('.clean').eq(0);
  this.elements.expander  = this.$.find('.expander').eq(0);
  this.elements.subtasks  = this.$.find('.tasks').eq(0);
  this.elements.collapse  = this.$.find('.collapse_all').eq(0);
  this.elements.expand    = this.$.find('.expand_all').eq(0);
};


TodoBlock.prototype.add_handlers = function () {
  this.extend.add_handlers.call( this );

  var self = this;

  this.elements.clean.click( function () {
    self.model.clean();
  } );

  this.elements.expand.click( function () {
    self.expand_all();
  } );

  this.elements.collapse.click( function () {
    self.collapse_all();
  } );

  this.$.mouseenter( function () {
    self.set_active( true );
  } );

  this.$.mouseleave( function () {
    self.set_active( false );
  } );
};


TodoBlock.prototype.focus = function ( focus_by ) {
  this.page.set_focused_todo_block( this );
  this.extend.focus.call( this, focus_by );
  if ( focus_by == 'title_focus' ) this.set_focused_subtask( null );
  this.$.addClass( 'focused' );
  this.runTrigger( 'TodoBlock.focus' );
};


TodoBlock.prototype.unfocus = function () {
  this.set_focused_subtask( null );
  this.extend.unfocus.call( this );
  this.$.removeClass( 'focused' );
  this.runTrigger( 'TodoBlock.unfocus' );
};


TodoBlock.prototype.check_active = function () {
  this.$[ this.is_active() ? 'addClass' : 'removeClass' ]( 'active' );
};


TodoBlock.prototype.create_subtask = function ( model ) {
  this.extend.create_subtask.call( this, model, this );
};


TodoBlock.prototype.set_focused_subtask = function ( subtask ) {
  if ( this.focused_subtask && !this.focused_subtask.model.eq( subtask && subtask.model ) )
    this.focused_subtask.unfocus();
  this.focused_subtask = subtask;
};


TodoBlock.prototype.set_collapsed = function ( collapsed ) {
  this.collapsed = collapsed == null ? false : Boolean( collapsed );
  this.$[ this.collapsed ? 'addClass' : 'removeClass' ]( 'collapsed' );

  this.extend.set_collapsed.call( this, collapsed );
};


TodoBlock.prototype.expand_all = function () {
  this.model.each_subtask( function () {
    this.set_ex_param_recursively( 'collapsed', false );
  });
};


TodoBlock.prototype.collapse_all = function () {
  this.model.each_subtask( function () {
    this.set_ex_param( 'collapsed', true );
  });
};


TodoBlock.prototype.focus_down = function () {
  this.elements.subtasks.find( '.title:visible:first' ).focus();
};


TodoBlock.prototype.focus_up = function () {
  this.elements.subtasks.find( '.title:visible:last' ).focus();
};


TodoBlock.prototype.focus_next = function () {
  var task = this.model.get_next( true );
  if ( !task ) return false;
  var block = TaskView.get_by_model_id( task.id );
  if ( block ) block.focus( 'hotkey' );
};


TodoBlock.prototype.focus_prev = function () {
  var task = this.model.get_prev( true );
  if ( !task ) return false;
  var block = TaskView.get_by_model_id( task.id );
  if ( block ) block.focus( 'hotkey' );
};


TodoBlock.prototype.create_sibling = function () {
  this.set_user_actions_runned( true );
  this.model.create_subtask();
  this.set_user_actions_runned( false );
};


TodoBlock.prototype.remove = function () {
  this.page.remove_todo_block( this );
  this.extend.remove.call( this );
};


TodoBlock.prototype.set_next = function ( next_model ) {
  this.extend.set_next.call( this, next_model );
  if ( next_model ) this.page.arrange_blocks();
};


TodoBlock.prototype.set_prev = function ( prev_model ) {
  this.extend.set_prev.call( this, prev_model );
  if ( prev_model ) this.page.arrange_blocks();
};


TodoBlock.prototype.get_caret_pos = function () {
  return 0;
};