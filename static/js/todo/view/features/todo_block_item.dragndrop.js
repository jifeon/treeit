;( function () {

  var name        = 'todo_block_item.dragndrop';
  var dependences = [
    'ofio.event_emitter'
  ];

  var al = false;

  var module = new function () {

    this.init = function () {
      var self = this;

      this.Class.on( 'init', function() {
        self._init();
      } );
    };


    this._init = function() {
      var self = this;
      var item = this.Class;

      item.elements.drag                = item.elements.content.find( '.drag' );
      item.elements.bottom_drag_trigger = item.elements.content.find( '.bottom_drag_trigger' );
      item.elements.middle_drag_trigger = item.elements.content.find( '.middle_drag_trigger' );
      item.elements.top_drag_trigger    = item.elements.content.find( '.top_drag_trigger' );

      item.elements.drag.mousedown( function( e ) {
        self.start_drag( e );
      });

      item.elements.bottom_drag_trigger.mouseup( function( e ) {
        self.drop( 'after' );
      } );

      item.elements.top_drag_trigger.mouseup( function( e ) {
        self.drop( 'before' );
      } );

      item.elements.middle_drag_trigger.mouseup( function( e ) {
        self.drop( 'in' );
      } );

      // webkit не ловит hover во время mousedown
      if ( $.browser.webkit || $.browser.msie ) {
        var drag_triggers = item.elements.content.find( '.drag_trigger' );

        drag_triggers.mouseover( function() {
          $( this ).addClass( 'hover' );
        } );

        drag_triggers.mouseout( function() {
          $( this ).removeClass( 'hover' );
        } );
      }
    };


    this.start_drag = function( e ) {
      this.Class.$.addClass( 'dragged' );

      this.Class.emit( 'dragndrop.start', this, e );
    };


    this.stop_drag = function() {
      this.Class.$.removeClass( 'dragged' );
    };


    this.drop = function( side ) {
      this.Class.emit( 'dragndrop.drop', this, side );
    };


    this._catch = function( task_view_dnd, side ) {
      if ( !task_view_dnd ) return false;
      
      var model         = this.Class.model;
      var caught_view   = task_view_dnd.Class;
      var caught_model  = caught_view.model;

      var parent_to_update,
          set_parent_result;

      if ( side == 'in' ) {
        set_parent_result = caught_model.set_new_parent( model, null, side );
        parent_to_update = model;
      }
      else {
        set_parent_result = caught_model.set_new_parent( model.parent, model, side );
        parent_to_update = model.parent;
      }

      if ( !this.Class.is_same_typeof_view( caught_view ) ) {
        caught_view = TaskView.transform_to( 'item', caught_view );
      }

      caught_view.correct_position( set_parent_result );

      var parent_view = TaskView.get_by_model( parent_to_update );
      if ( !parent_view ) return false;
      parent_view.get_todo_block().redraw_links();
    };
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences,
    namespace   : 'feature_dragndrop'
  } );

})();