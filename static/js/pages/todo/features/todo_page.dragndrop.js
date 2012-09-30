;( function () {

  var name        = 'todo_page.dragndrop';
  var dependences = [
    'ofio.utils'
  ];

  var module = new function () {

    this.initVars = function () {
      this.dragged_task_view_dnd = null;

      var self = this;

      this.drag_element = new DragElement({
        $             : $('#drag_element'),
        root_element  : $('body'),
        on_drop       : function() {
          self.stop_drag();
        }
      });
    };


    this.redefineVars = function ( variable ) {
      switch ( variable ) {
        case 'dragged_task_view_dnd':
          break;

        default: return false;
      }

      return true;
    };


    this.init = function () {
      var self = this;

      TaskView.on( 'dragndrop.start', function( task_view_dnd, e ) {
        self.start_drag( task_view_dnd, e );
      } );

      TaskView.on( 'dragndrop.drop', function( task_view_dnd, side ) {
        self.drop_to( task_view_dnd, side );
      } );

      this.Class.on( 'initialized', function() {
        self._init();
      } );
    };


    this._init = function() {
      var self = this;

      this.Class.elements.content.mouseup( function( e ) {
        var last_block_model = self.Class.life_task.subtasks.get_last();
        if ( !last_block_model ) return false;

        var last_block_view = TaskView.get_by_model( last_block_model );
        if ( !last_block_view ) return false;

        self.drop_to( last_block_view.feature_dragndrop, 'after' );
      });
    };


    this.start_drag = function( task_view_dnd, e ) {
      this.Class.emit( 'start_drag' );

      this.Class.elements.content.addClass( 'dragndrop_processing' );

      var text = this.Class.utils.substr( task_view_dnd.Class.model.get_text(), 15 );
      this.drag_element.$$().text( text );
      this.drag_element.start_drag( e );

      this.dragged_task_view_dnd = task_view_dnd;
    };


    this.stop_drag = function() {
      this.drag_element.stop_drag();
      this.Class.elements.content.removeClass( 'dragndrop_processing' );

      if ( this.dragged_task_view_dnd ) {
        this.dragged_task_view_dnd.stop_drag();
        this.dragged_task_view_dnd = null;
      }

      this.Class.emit( 'stop_drag' );
    };


    this.drop_to = function( task_view_dnd, side ) {
      if ( !this.dragged_task_view_dnd || !task_view_dnd ) return false;

      task_view_dnd._catch( this.dragged_task_view_dnd, side );

      this.dragged_task_view_dnd.stop_drag();
      this.dragged_task_view_dnd = null;
    };
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences,
    namespace   : 'feature_dragndrop'
  } );

})();