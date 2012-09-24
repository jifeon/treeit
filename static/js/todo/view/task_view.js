function TaskView ( params ) {
  this.init( params );
}


TaskView.model_index  = {};
TaskView.moving       = false;


TaskView.get_by_model_id = function ( id ) {
  return this.model_index[ id ] || null;
};


TaskView.get_by_model = function( model ) {
  return model ? ( this.model_index[ model.id ] || null ) : null; 
};


TaskView.remove_from_index = function( id, view ) {
  if ( view && this.model_index[ id ] != view ) return new Error( 'Bad removing view' );
  delete this.model_index[ id ];
  return true;
};


TaskView.transform_to = function( type, view ) {
  var page      = view.page;
  var new_view  = null;

  switch ( type ) {
    case 'block':
      new_view = page.add_todo_block( view.model );
      break;

    case 'item':
      var parent_view = TaskView.get_by_model( view.model.parent );
      new_view = parent_view && parent_view.create_subtask( view.model );
      break;
  }

  if ( new_view ) view.remove();
  return new_view || view;
};


TaskView.prototype = new Ofio({
  className : 'TaskView',
  modules   : [
    'wud.jquery',
    'ofio.event_emitter',
    'ofio.logger'
  ]//,
//  feature_modules : [
//    'task_view.dragndrop'
//  ]
});


TaskView.prototype.initVars = function () {
  this.page       = null;
  this.model      = null;
  this.elements   = {};

  this.focused    = false;
  this.done       = null;
  this.collapsed  = false;

  this._undone_data         = {};
  this._undone_data_protect = false;

  this._triggers            = {};
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

  this.emit( 'task_view.init' );
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
    if ( confirm( 'Вы действительно хотите удалить задачу ' + text + '?' ) )
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

  this.check_arrow_visible();
};


TaskView.prototype.init_model_triggers = function () {
  var self = this;

  this._triggers.before_remove  = this.model.on( 'before_remove',    function () {
    self.before_remove();
  } );

  this._triggers.remove         = this.model.on( 'remove',           function () {
    self.remove();
  } );

  this._triggers.remove_subtask = this.model.on( 'remove_subtask',   function () {
    self.remove_subtask();
  } );

  this._triggers.set_text       = this.model.on( 'set_text',         function () {
    self.set_title( self.model.get_text() );
  } );

  this._triggers.set_done       = this.model.on( 'set_done',         function () {
    self.set_done( self.model.is_done() );
  } );

  this._triggers.set_ex_param   = this.model.on( 'set_ex_param',     function () {
    self.set_collapsed( self.model.get_ex_param( 'collapsed' ) );
  } );

  this._triggers.set_next       = this.model.on( 'set_next',         function ( next_model ) {
    self.set_next( next_model );
  } );

  this._triggers.set_prev       = this.model.on( 'set_prev',         function ( prev_model ) {
    self.set_prev( prev_model );
  } );

  this._triggers.set_new_parent  = this.model.on( 'set_new_parent',  function ( new_parent, old_parent ) {
    self.set_new_parent( new_parent, old_parent );
  } );

  var create_subtask = function ( model ) {
    self.create_subtask( model );
  };
  
  this._triggers.create_subtask = this.model.on( 'create_subtask',   create_subtask );
  this._triggers.append_subtask = this.model.on( 'append_subtask',   create_subtask );
};


TaskView.prototype.add_to_model_index = function () {
  TaskView.model_index[ this.model.id ] = this;
};



// ========== FOCUS ==========

// focus_by = create | title_focus | hotkey | click | subtask
TaskView.prototype.focus = function ( focus_by ) {
  this.focused = true;

  // если фокус произошел не из-за клика по текстовому полю и не из-за выделение подтаска - нужно поставить каретку
  if ( focus_by != 'title_focus' && focus_by != 'subtask' ) this.elements.title.focus();
};


TaskView.prototype.unfocus = function () {
  this.focused = false;
  this.save_title();
};


TaskView.prototype.is_focused = function () {
  return this.focused;
};


TaskView.prototype.focus_up   = function () {};
TaskView.prototype.focus_down = function () {};



// ========== TITLE ==========

TaskView.prototype.set_title = function ( text ) {
  if ( text != this.get_title() ) this.elements.title.val( text );
};


TaskView.prototype.get_title = function () {
  return this.elements.title.val();
};


// сохраняет текущее название в модель, где оно проходит ряд фильтров
// и через тригер приходит в set_title
TaskView.prototype.save_title = function () {
  this.model.set_text( this.get_title() );
};


TaskView.prototype.get_caret_pos = function () { return 0; };



// ========== DONE ==========

// перед передачей в модель значения сохраняет состояние дочерних тасков, чтобы их можно было восстановить
// если нажатие на галку было случайным
TaskView.prototype.before_set_done = function ( done, child_call ) {
  var self = this;
  this._undone_data_protect = true;

  this.model.each_subtask( function() {
    if ( done ) self._undone_data[ this.id ] = this.is_done();

    var task_view = TaskView.get_by_model_id( this.id );
    task_view.before_set_done( done, true );

    if ( !done && self._undone_data[ this.id ] === false ) this.set_done( false );
  } );

  this._undone_data_protect = false;

  if ( !child_call ) this.model.set_done( done );
};


TaskView.prototype.set_done = function ( done ) {
  if ( !done && !this._undone_data_protect ) this._undone_data = {};
  this.$[ done ? 'addClass' : 'removeClass' ]( 'done' );
};



// ========== COLLAPSED ==========

TaskView.prototype.set_collapsed = function ( collapsed ) {
  this.get_todo_block().redraw_links();
  this.emit( 'task_view.set_collapsed' );
};


TaskView.prototype.is_collapsed = function () {
  return this.collapsed;
};


TaskView.prototype.check_arrow_visible  = function () {};



// ========== CREATE =========

TaskView.prototype.create_subtask_model = function ( params, prev ) {
  if ( this.is_collapsed() ) this.model.set_ex_param( 'collapsed', false );

  var task = this.model.create_subtask( params, prev );
  var view = TaskView.get_by_model_id( task.id );
  if ( view ) view.focus( 'create' );
};


TaskView.prototype.create_subtask = function ( model ) {
  var prev      = model.get_prev();
  var prev_view = prev ? TaskView.get_by_model_id( prev.id ) : null;

  var parent    = prev_view ? null : this.elements.subtasks;
  var $         = this.page.elements.sample_block_item.clone().removeAttr( 'id' );
  if ( prev_view ) $.insertAfter( prev_view.$$() );

  return new TodoBlockItem({
    $           : $,
    parent      : parent,
    model       : model,
    page        : this.page
  });
};


TaskView.prototype.create_sibling = function () {};



// ========== MOVE ==========

TaskView.prototype.move_up = function () {
  this.correct_position( this.model.move_up() );
};


TaskView.prototype.move_down = function () {
  this.correct_position( this.model.move_down() );
};


TaskView.prototype.move_inside  = function () {};
TaskView.prototype.move_outside = function () {};



// ========== REMOVE =========

TaskView.prototype.remove_subtask = function () {
  this.get_todo_block().redraw_links();
};


TaskView.prototype.before_remove = function () {
  if ( this.is_focused() ) {
    if ( !this.model.get_next() ) this.focus_up();
    else this.focus_down();
  }
};


TaskView.prototype.remove = function () {
  this.$.remove();
  TaskView.remove_from_index( this.model.id, this );
  this.remove_model_triggers();
  this.emit( 'task_view.remove' );
};


TaskView.prototype.remove_model_triggers = function () {
  for ( var trigger_id in this._triggers ) {
    this.remove_listener( this._triggers[ trigger_id ] );
  }
};



// ========= TRANSFORMATION ==========

TaskView.prototype.is_same_typeof_view = function ( task_view ) {
  return this.__className == task_view.__className;
};



// ========= LINKS & CHILDREN ==========

// возвращает количество прорисованных дочерних тасков с учетом себя
// и дополнительной высоты, если текст в подзадачах многострочный
TaskView.prototype.redraw_links = function () {
  var opened_subtasks  = 1;

  if ( !this.has_visible_subtasks() ) return opened_subtasks;

  var self = this;

  this.model.each_subtask( function () {
    var task_view = TaskView.get_by_model_id( this.id );
    if ( !task_view ) return false;
    task_view.set_last( false );

    opened_subtasks += task_view.redraw_links();
    opened_subtasks += task_view.get_additional_height();
  } );

  var last_task = this.model.subtasks.get_last();
  if ( last_task ) {
    var task_view = TaskView.get_by_model_id( last_task.id );
    if ( task_view ) task_view.set_last( true );
  }

  return opened_subtasks;
};


TaskView.prototype.get_additional_height  = function () { return 0; };
TaskView.prototype.set_last               = function ( is_last ) {};


TaskView.prototype.has_visible_subtasks = function () {
  return this.model.has_subtasks() && !this.model.get_ex_param( 'collapsed' );
};



// ========== PARENTS ==========

TaskView.prototype.set_new_parent = function ( new_parent, old_parent ) {
  var old_parent_view = TaskView.get_by_model_id( old_parent.id );
  if ( old_parent_view ) {
    old_parent_view.redraw_links();
    old_parent_view.check_arrow_visible();
  }
  this.focus( 'hotkey' );
};


TaskView.prototype.get_todo_block = function () {
  return TaskView.get_by_model( this.model.get_parent( LEVEL.TODO_BLOCK ) ) || this;
};



// ========= PREV & NEXT ==========

// ставит вью в нужное место - используется после перемещения
TaskView.prototype.correct_position = function ( operation_result ) {
  if ( Error.is( operation_result ) ) return false;

  var view,
      model,
      method;

  if ( model = this.model.get_prev() ) {
    view    = TaskView.get_by_model_id( model.id );
    method  = 'insertAfter';
  }

  if ( ( !model || !view ) && ( model = this.model.get_next() ) ) {
    view    = TaskView.get_by_model_id( model.id );
    method  = 'insertBefore';
  }

  if ( !view ) return false;
  this.$[ method ]( view.$ );

  this.focus( 'hotkey' );
};


TaskView.prototype.set_next = function ( next_model ) {};
TaskView.prototype.set_prev = function ( prev_model ) {};
