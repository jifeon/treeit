;( function () {

  var name        = 'task.patch';
  var dependences = [];

  var tasks_to_remove = [];

  var patch = function ( actions ) {
    if ( !actions ) return false;
    this.create( actions.create );
    this.update( actions.update );
    this.remove( actions.remove );
  };


  var create = function ( tasks ) {
    if ( !tasks ) return false;

    var task_params, ex_params, serv_id;

    for ( serv_id in tasks ) {
      task_params = tasks[ serv_id ];
      try {
        eval( 'ex_params = ' + task_params[ 'ex_params' ] );
      } catch ( e ) { ex_params = null; }
      this.serv_task_index[ task_params.serv_id ] = new Task({
        serv_id   : task_params.serv_id,
        text      : task_params.text,
        done      : task_params.done,
        ex_params : ex_params
      });
    }

    var task;

    for ( serv_id in tasks ) {
      task_params = tasks[ serv_id ];
      task        = this.serv_task_index[ task_params.serv_id ];

      var parent = this.serv_task_index[ task_params.parent_id ];
      if ( parent ) {
        var prev    = this.serv_task_index[ task_params.prev_id ];
        var next    = this.serv_task_index[ task_params.next_id ];

        parent.add_unsorted_subtask( task, prev, next );
      } else tasks_to_remove.push( task );
    }

    this.serv_task_index[ 'life' ].combine_subtasks();
    this.serv_task_index[ 'life' ].update_levels();
  };


  var update = function ( tasks ) {
    if ( !tasks ) return false;

    var task_params, ex_params, serv_id;

    for ( serv_id in tasks ) {
      task_params = tasks[ serv_id ];
      try {
        eval( 'ex_params = ' + task_params[ 'ex_params' ] );
      } catch ( e ) { ex_params = null; }

      var task = Task.getById( task_params.id );
      if ( !task ) task = this.serv_task_index[ task_params.serv_id ];
      else this.serv_task_index[ task_params.serv_id ] = task;
      if ( task instanceof Task ) {
        task.set_serv_id( task_params.serv_id );
        task.set_text( task_params.text );
        task.set_done( task_params.done );
        task.set_ex_params( ex_params );
        
      }
    }
  };


  var remove = function ( tasks ) {
    for ( var t = 0, t_ln = tasks.length; t < t_ln; t++ ) {
      var task = this.serv_task_index[ tasks[ t ] ];
      if ( !task ) continue;
      task.remove();
    }
  };


  var clean = function () {
    for ( var t = 0, t_ln = tasks_to_remove.length; t < t_ln; t++ ) {
      tasks_to_remove[ t ].kill_self();
    }
  };


  var remove_from_index = function ( task ) {
    delete this.serv_task_index[ task.id ];
  };


  var on_include = function ( clazz ) {

    clazz.serv_task_index   = {};

    clazz.patch             = patch;
    clazz.create            = create;
    clazz.update            = update;
    clazz.remove            = remove;
    clazz.remove_from_index = remove_from_index;
    clazz.clean             = clean;
  };

  new Ofio.Module ( {
    name        : name,
    dependences : dependences,
    onInclude   : on_include
  } );

})();