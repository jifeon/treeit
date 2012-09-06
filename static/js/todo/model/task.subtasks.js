;( function () {

  var name        = 'task.subtasks';
  var dependences = [
    'ofio.logger'
  ];

  var module = new function () {

    this.initVars = function () {
      this.subtasks           = new Queue;
      this.unsorted_subtasks  = {};
      this.sorted_subtasks    = {};
      this.unsorted_queues    = [];
      this.current_queue      = false;
    };


    this.each_subtask = function ( fun, req ) {
      if ( req ) this.subtasks.each( function () {
        this.req_each( fun );
      });
      else this.subtasks.each( fun );
    };


    this.req_each = function ( fun ) {
      if ( typeof fun == 'function' ) fun.call( this );
      this.each_subtask( fun, true );
    }


    this.create_subtask = function ( params, prev ) {
      params        = params || {};
      params.parent = this;
      params.level  = this.level + 1;

      var task = new Task( params );
      var res = prev ? this.subtasks.insert_after( task, prev ) : this.subtasks.add( task );
      if ( Error.is( res ) ) res.log();

      this.check_done();

      this.runTrigger( 'task.create_subtask', [ task ] );
      return task;
    };


    this.add_subtask = function ( task, prev, next ) {
      this.unsorted_subtasks[ task.id ] = {
        task : task,
        prev : prev,
        next : next
      };
      task.parent = this;
    };


    this.combine_subtasks = function() {
      for ( var id in this.unsorted_subtasks ) {
        if ( this.sorted_subtasks[ id ] ) continue;
        this.current_queue = new Queue;
        this.unsorted_queues.push( this.current_queue );
        this.append_subtask( this.unsorted_subtasks[ id ], true, true );
      }

      this.unsorted_subtasks  = {};
      this.sorted_subtasks    = {};

      if ( !this.current_queue ) return false;

      var q_ln = this.unsorted_queues.length;
      if ( q_ln == 1 ) this.subtasks = this.current_queue;
      else for ( var q = 0; q < q_ln; q++ ) this.subtasks = this.subtasks.concat( this.unsorted_queues[ q ] );

      this.unsorted_queues = [];

      this.each_subtask( function() {
        this.combine_subtasks();
      } );
    };


    this.append_subtask = function ( unsorted_subtask, add_prev, add_next ) {
      var prev = unsorted_subtask.prev,
          next = unsorted_subtask.next,
          task = unsorted_subtask.task;

      if ( this.sorted_subtasks[ task.id ] ) return false;
      
      this.sorted_subtasks[ task.id ] = true;

      if ( add_prev ) {
        if ( prev && this.unsorted_subtasks[ prev.id ] )
          this.append_subtask( this.unsorted_subtasks[ prev.id ], true, false );
        this.current_queue.add( task );
        this.runTrigger( 'task.add_subtask', [ task ] );
      }

      if ( add_next ) {
        if ( !add_prev ) {
          this.current_queue.add( task );
          this.runTrigger( 'task.add_subtask', [ task ] );
        }
        if ( next && this.unsorted_subtasks[ next.id ] )
          this.append_subtask( this.unsorted_subtasks[ next.id ], false, true );
      }
    };


    this.in_subtasks = function ( task ) {
      return this.subtasks.has( task );
    };


    this.has_subtasks = function () {
      return this.subtasks.length();
    };


    this.has_visible_subtasks = function () {
      return this.has_subtasks() && !this.get_ex_param( 'collapsed' );
    };


    this.get_absolute_last_task = function () {
      return this.has_visible_subtasks() ? this.subtasks.get_last().get_absolute_last_task() : this;
    };


    this.remove_task = function ( task ) {
      task.runTrigger( 'task.before_remove' );
      this.subtasks.remove( task );

      task.post_remove();
      this.runTrigger( 'task.remove_task' );
    };


    this.remove = function () {
      if ( this.parent ) this.parent.remove_task( this );
      else this.post_remove();
    };


    this.post_remove = function () {
      Task.remove_from_index( this );

      this.subtasks.each( function () {
        this.post_remove();
      });

      this.runTrigger( 'task.remove' );
    };


    this.kill = function () {
      this.each_subtask( function () {
        this.post_remove();
      } );

      this.subtasks = new Queue;
    };


    this.kill_self = function() {
      this.kill();
      this.post_remove();
    };


    this.clean = function () {
      var self      = this;
      var to_remove = [];

      this.each_subtask( function () {
        if ( this.is_done() ) to_remove.push( this );
        else this.clean();
      } );

      for ( var t = 0, t_ln = to_remove.length; t < t_ln; t++ ) {
        self.remove_task( to_remove[ t ] );
      }
    };
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();