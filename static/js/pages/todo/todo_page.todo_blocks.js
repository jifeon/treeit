;( function () {

  var name        = 'todo_page.todo_blocks';
  var dependences = [
    'ofio.utils'
  ];

  var block_width         = 284;
  var block_margin        = 30;
  var window_top_padding  = 45;
  var window_left_padding = 15;
  var window_min_width    = 800;

  var module = new function () {

    this.initVars = function() {
      this.focused_todo_block = null;

    };


    this.redefineVars = function ( variable ) {
      switch ( variable ) {
        case 'focused_todo_block':
          break;

        default: return false;
      }

      return true;
    };


    this.init = function () {
      var self = this;

      var _resize = function () {
        self.arrange_blocks();
      }

      var _resize_first = function() {
        $( window ).resize( _resize );
        self.on( 'add_todo_block',              _resize );
        TaskView.on( 'task_view.remove',        _resize );
        TaskView.on( 'task_view.set_collapsed', _resize );
        TodoBlockItem.on( 'set_height',         _resize );
        _resize();
      }

      this.on( 'initialized_todo_blocks', _resize_first );
    };


    this.init_todo_blocks = function () {
      this.elements.content.hide();

      var self = this;
      this.life_task.each_subtask( function () {
        self.add_todo_block( this );
      } );

      var add_todo_block = function ( task ) {
        self.add_todo_block( task );
      }

      this.life_task.on( 'create_subtask', add_todo_block );
      this.life_task.on( 'append_subtask', add_todo_block );

      this.elements.content.show();

      this.emit( 'initialized_todo_blocks' );
    };


    this.add_todo_block = function ( model ) {
      var block = new TodoBlock({
        $     : this.elements.sample_block.clone().removeAttr('id').appendTo( this.elements.content ),
        model : model,
        page  : this
      });

      this.emit( 'add_todo_block', block );
      return block;
    };


    this.focus_last_block = function () {
      var task_view = TaskView.get_by_model( this.life_task.subtasks.get_last() );
      if ( task_view ) task_view.focus( 'create' );
    };


    this.set_focused_todo_block = function ( block ) {
      if ( this.focused_todo_block && !this.focused_todo_block.model.eq( block && block.model ) )
        this.focused_todo_block.unfocus();
      this.focused_todo_block = block;
    };


    this.get_focused_block = function () {
      return this.focused_todo_block;
    };


    this.get_focused_view = function () {
      if ( !this.focused_todo_block ) return null;
    
      return this.focused_todo_block.focused_subtask || this.focused_todo_block;
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