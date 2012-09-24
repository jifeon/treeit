function TodoBlockItem ( params ) {
  this.init( params );
}


TodoBlockItem.max_nesting = LEVEL.TODO_BLOCK + 5;


TodoBlockItem.prototype = new Ofio({
  extend    : TaskView,
  className : 'TodoBlockItem',
  modules   : [
    'ofio.utils',
    'ofio.text'
  ],
  feature_modules : [
    'todo_block_item.dragndrop'
  ]
});


TodoBlockItem.prototype.initVars = function () {
  this.extend.initVars.call( this );

  this.branch_width         = 18;
  this.bottom_branch_height = 10;
  this.task_height          = 19;
  this.normal_title_width   = 240;
};


TodoBlockItem.prototype.init = function ( params ) {
  this.extend.init.call( this, params );
  this.set_title_width();
  
  this.emit( 'init' );
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


TodoBlockItem.prototype.init_model_triggers = function () {
  this.extend.init_model_triggers.call( this );

  var self = this;
  var check = function () {
    self.check_arrow_visible();
  };

  this._triggers.item_create_subtask  = this.model.on( 'create_subtask', check );
  this._triggers.item_append_subtask  = this.model.on( 'append_subtask', check );
  this._triggers.item_add_subtask     = this.model.on( 'add_subtask',    check );
  this._triggers.item_remove_subtask  = this.model.on( 'remove_subtask', check );

  this._triggers.item_set_parent      = this.model.on( 'set_parent', function ( new_parent ) {
    self.set_parent( new_parent );
  } );
};



// ========= FOCUS =========

TodoBlockItem.prototype.focus = function ( focus_by, caret_position ) {
  this.get_todo_block().set_focused_subtask( this );

  this.extend.focus.call( this, focus_by, caret_position );

  this.elements.content.addClass( 'focused' );

  if ( focus_by != 'create' && caret_position != undefined )
    this.set_caret_position( this.elements.title.$[0], caret_position );

  this.emit( 'focus' );
};


TodoBlockItem.prototype.unfocus = function () {
  this.extend.unfocus.call( this );

  this.elements.content.removeClass( 'focused' );

  this.emit( 'unfocus' );
};


TodoBlockItem.prototype.focus_down = function () {
  this.focus_with_method( 'get_next_visible_task' );
};


TodoBlockItem.prototype.focus_up = function () {
  this.focus_with_method( 'get_prev_visible_task' );
};


TodoBlockItem.prototype.focus_with_method = function ( method ) {
  var item = this[ method ]();

  if ( item ) {
    var caret_position  = this.get_caret_position( this.elements.title.$[0] );
    caret_position      = Math.max( 0,
      Math.round( caret_position - ( item.model.get_level() - this.model.get_level() ) * 2.8 ) //символы на смещение
    );

    // TODO: продумать caret position
    var new_caret_position = method == 'get_next_visible_task'
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



// ========== TITLE ==========

// на разных уровнях вложенности ширина поля для ввода разная, после максимально разрешенного
// уровня вложенности она остается одинаковой, но связи для таких тасков не рисуются
TodoBlockItem.prototype.set_title_width = function () {
  this.elements.subtasks[ this.is_max_nesting() ? 'addClass' : 'removeClass' ]( 'max_nesting' );

  this.elements.title.width(
    this.normal_title_width - ( this.get_noconflict_level() - 2 ) * this.branch_width
  );
};


TodoBlockItem.prototype.set_height = function ( h ) {
  this.elements.content.height( h );
  this.get_todo_block().redraw_links();
  this.emit( 'set_height' );
};


TodoBlockItem.prototype.get_caret_pos = function () {
  return this.get_caret_position( this.elements.title.$[0] );
};



// ========== COLLAPSED ==========

TodoBlockItem.prototype.set_collapsed = function ( collapsed ) {
  this.collapsed = collapsed == null ? false : Boolean( collapsed );
  this.elements.expander[ this.collapsed ? 'removeClass' : 'addClass' ]( 'expand' );
  this.elements.subtasks[ this.collapsed ? 'hide' : 'show' ]();

  this.extend.set_collapsed.call( this, collapsed );
};


TodoBlockItem.prototype.check_arrow_visible = function () {
  this.elements.expander.css( 'visibility', this.model.has_subtasks() ? 'visible' : 'hidden' );
};



// ========== CREATE ===========

TodoBlockItem.prototype.create_sibling = function () {
  var parent_view = TaskView.get_by_model( this.model.parent );
  if ( parent_view ) parent_view.create_subtask_model( {}, this.model );
};



// ========== MOVE ===========

TodoBlockItem.prototype.move_inside = function () {
  this.model.set_new_parent( this.model.get_prev() );
};


TodoBlockItem.prototype.move_outside = function () {
  if ( this.model.get_level() <= 2 ) return false;

  this.correct_position(
    this.model.set_new_parent( this.model.parent.parent, this.model.parent )
  );
};



// ========== LINKS & CHILDREN ==========

// следит за высотой связи сбоку от таска
TodoBlockItem.prototype.redraw_links = function () {
  var opened_tasks = this.extend.redraw_links.call( this );
  this.elements.branch_link.height( this.task_height * ( opened_tasks - 1 ) );
  this.elements.branch_bottom.height(
    this.bottom_branch_height + ( this.get_additional_height() * ( this.task_height - 1 ) )
  );
  return opened_tasks;
};


// учитываем мультистрочные таски при подсчете высоты
TodoBlockItem.prototype.get_additional_height = function () {
  return this.elements.title.get_lines_count() - 1;
};


TodoBlockItem.prototype.set_last = function ( is_last ) {
  if ( is_last ) this.elements.branch.addClass( 'last' );
  else this.elements.branch.removeClass( 'last' );
};


// возвращает последнего видимого вложенного ребенка
TodoBlockItem.prototype.get_last_visible_task = function () {
  if ( this.has_visible_subtasks() ) {
    var last_view = TaskView.get_by_model( this.model.subtasks.get_last() );
    if ( !last_view ) return this;
    return last_view.get_last_visible_task();
  }
  else return this;
};


// проверка на максимальный уровень вложенности
TodoBlockItem.prototype.is_max_nesting = function () {
  return this.model.get_level() >= TodoBlockItem.max_nesting;
};


// возвращает уровень в пределах максимальной вложенности
TodoBlockItem.prototype.get_noconflict_level = function () {
  return Math.min( this.model.get_level(), TodoBlockItem.max_nesting );
};



// ========== PARENTS ==========

// перемещает вьюшку в новый блок
TodoBlockItem.prototype.set_parent = function ( new_parent ) {
  if ( !new_parent ) return false;
  var view = TaskView.get_by_model_id( new_parent.id );
  if ( !view ) return false;
  view.elements.subtasks.append( this.$$() );
};


// перерисовыывает линки у нового и старого парентов и выставляет ширину названия
TodoBlockItem.prototype.set_new_parent = function ( new_parent, old_parent ) {
  this.extend.set_new_parent.call( this, new_parent, old_parent );
  this.model.req_each( function () {
    var view = TaskView.get_by_model_id( this.id );
    view.set_title_width();
  } );
};



// =========== PREV & NEXT ===========

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


// возвращает следующий видимый item или если такого не нашлось - родительский блок
TodoBlockItem.prototype.get_next_visible_task = function ( skip_subtasks ) {
  if ( this.has_visible_subtasks() && !skip_subtasks )
    return TaskView.get_by_model( this.model.subtasks.get_first() );

  var next = this.model.get_next();
  if ( next ) return TaskView.get_by_model( next );

  var parent_task_view = TaskView.get_by_model( this.model.parent );
  if ( !parent_task_view ) return this;

  if ( parent_task_view.__className == 'TodoBlockItem' ) return parent_task_view.get_next_visible_task( true );
  return parent_task_view;
};


// возвращает предыдущий видимый таск
TodoBlockItem.prototype.get_prev_visible_task = function () {
  var prev = this.model.get_prev();
  if ( prev ) {
    var prev_view = TaskView.get_by_model( prev );
    if ( !prev_view ) return this;
    return prev_view.get_last_visible_task();
  }

  return TaskView.get_by_model( this.model.parent );
};
