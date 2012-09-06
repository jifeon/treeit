;( function () {

  var name        = 'todo_page.todo_blocks_position';
  var dependences = [
    'ofio.utils'
  ];

  var block_width         = 284;
  var block_margin        = 30;
  var window_top_padding  = 45;
  var window_left_padding = 15;
  var window_min_width    = 800;

  var module = new function () {

    this.init = function () {
      var self = this;

      var _resize = function () {
        self.arrange_blocks();
      }

      var _resize_first = function() {
        $( window ).resize( _resize );
        self.addFunctionToGlobalTrigger( 'todo_page.add_todo_block',    _resize );
        self.addFunctionToGlobalTrigger( 'task_view.remove',            _resize );
        self.addFunctionToGlobalTrigger( 'task_view.set_collapsed',     _resize );
        self.addFunctionToGlobalTrigger( 'todo_block_item.set_height',  _resize );
        _resize();
      }

      this.addFunctionToTrigger( 'todo_page.initialized_todo_blocks', _resize_first );
    };


    this.arrange_blocks = function() {
      var window_width    = Math.max( window_min_width, $( window ).width() );
      var blocks_per_row  = Math.max( Math.floor(
        ( window_width - window_left_padding ) / ( block_width + block_margin )
      ), 1 );

      var blocks_heights  = [];
      for ( var b = 0; b < blocks_per_row; b++ )
        blocks_heights.push( 0 );

      var self = this;

      this.life_task.each_subtask( function () {
        var block         = TaskView.get_by_model_id( this.id );
        if ( !block ) return false;
        var column_number = self.utils.min( blocks_heights );

        var x = window_left_padding + column_number * ( block_width + block_margin );
        var y = window_top_padding + blocks_heights[ column_number ];

        blocks_heights[ column_number ] += block.$$().height() + block_margin;
        block.$$().css({
          left  : x,
          top   : y
        });
      } );

      this.elements.content.height( blocks_heights[ this.utils.max( blocks_heights ) ] + block_margin * 2 );
    }
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();