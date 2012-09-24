function TodoBlock ( params ) {
  this.init( params );
}


TodoBlock.prototype = new Ofio({
  extend          : TaskView,
  className       : 'TodoBlock',
  modules         : [
    'ofio.text'
  ],
  feature_modules : [
    'todo_block.dragndrop'
  ]
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

  this.emit( 'init' );
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
};



// ========== FOCUS ==========

TodoBlock.prototype.focus = function ( focus_by ) {
  this.page.set_focused_todo_block( this );
  this.extend.focus.call( this, focus_by );
  if ( focus_by == 'title_focus' ) this.set_focused_subtask( null );
  this.$.addClass( 'focused' );
  this.emit( 'focus' );
};


TodoBlock.prototype.unfocus = function () {
  this.set_focused_subtask( null );
  this.extend.unfocus.call( this );
  this.$.removeClass( 'focused' );
  this.emit( 'unfocus' );
};


TodoBlock.prototype.set_focused_subtask = function ( subtask ) {
  if ( subtask ) this.focus( 'subtask' );

  if ( this.focused_subtask ) {
    if ( !this.focused_subtask.model.eq( subtask && subtask.model ) )
      this.focused_subtask.unfocus();
  }
  else this.save_title();

  this.focused_subtask = subtask;
};


// для нажатия кнопки вниз - выделится первое дитя
TodoBlock.prototype.focus_down = function () {
  this.elements.subtasks.find( '.title:visible:first' ).focus();
};


// для нажатия кнопки вверх
TodoBlock.prototype.focus_up = function () {
  this.elements.subtasks.find( '.title:visible:last' ).focus();
};


// выделить следующий блок или первый если такого нет
TodoBlock.prototype.focus_next = function () {
  var task = this.model.get_next( true );
  var block = TaskView.get_by_model( task );
  if ( block ) block.focus( 'hotkey' );
};


// выделит предыдущий блок
TodoBlock.prototype.focus_prev = function () {
  var task = this.model.get_prev( true );
  var block = TaskView.get_by_model( task );
  if ( block ) block.focus( 'hotkey' );
};



// ========== COLLAPSED ==========

TodoBlock.prototype.set_collapsed = function ( collapsed ) {
  this.collapsed = collapsed == null ? false : Boolean( collapsed );
  this.$[ this.collapsed ? 'addClass' : 'removeClass' ]( 'collapsed' );

  this.extend.set_collapsed.call( this, collapsed );
};


TodoBlock.prototype.expand_all = function () {
  this.model.each_subtask( function () {
    this.set_ex_param( 'collapsed', false );
  }, true );
};


TodoBlock.prototype.collapse_all = function () {
  this.model.each_subtask( function () {
    this.set_ex_param( 'collapsed', true );
  });
};



// ========== CREATE ==========

// в блоке при нажатии на ентер создается подтаск, а не братский таск
TodoBlock.prototype.create_sibling = function () {
  this.create_subtask_model();
};



// ========== REMOVE ==========

TodoBlock.prototype.before_remove = function () {
  this.focus_prev();
};



// ========== PARENTS ==========

TodoBlock.prototype.set_new_parent = function ( new_parent, old_parent ) {
  this.extend.set_new_parent.call( this, new_parent, old_parent );
  this.model.each_subtask( function () {
    var view = TaskView.get_by_model_id( this.id );
    view.set_title_width();
  }, true );
};



// =========== PREV & NEXT ===========

TodoBlock.prototype.set_next = function ( next_model ) {
  this.extend.set_next.call( this, next_model );
  if ( next_model ) this.page.arrange_blocks();
};


TodoBlock.prototype.set_prev = function ( prev_model ) {
  this.extend.set_prev.call( this, prev_model );
  if ( prev_model ) this.page.arrange_blocks();
};