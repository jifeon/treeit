;( function () {

  var name        = 'todo_block.dragndrop';
  var dependences = [];

  var module = new function () {

    this.init = function () {
      var self = this;

      this.Class.on( 'init', function() {
        self._init();
      } );
    };


    this._init = function() {
      var self  = this;
      var block = this.Class;

      block.elements.drag = block.$.find( '.drag' ).eq(0);

      block.elements.drag.mousedown( function( e ) {
        self.start_drag( e );
      } );

      block.$.mouseup( function( e ) {
        self.Class.emit( 'dragndrop.drop', self, 'in' );
      } );

      // webkit не ловит hover во время mousedown
      if ( $.browser.webkit || $.browser.msie ) {
        block.$.mouseover( function() {
          $( this ).addClass( 'hover' );
        } );

        block.$.mouseout( function() {
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


    this._catch = function( task_view_dnd, side ) {
      if ( !task_view_dnd ) return false;

      var model       = this.Class.model;
      var caught_view = task_view_dnd.Class;

      var parent_to_update;
      if ( side == 'in' ) {
        var set_parent_result = caught_view.model.set_new_parent( model, null, side )
        parent_to_update = model;

        if ( this.Class.is_same_typeof_view( caught_view ) ) {
          caught_view = TaskView.transform_to( 'item', caught_view );
        }

        caught_view.correct_position( set_parent_result );
      }
      else {
        if ( !this.Class.is_same_typeof_view( caught_view ) ) {
          caught_view = TaskView.transform_to( 'block', caught_view );
        }

        caught_view.correct_position(
          caught_view.model.set_new_parent( model.parent, model, side )
        );
        parent_to_update = model.parent;
      }

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