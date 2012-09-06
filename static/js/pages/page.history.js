/*
  модуль для управления историей страницы

  history = [
    {
      action : 'task.create',
      params : {},
      id     : 1
    }
  ]
 */
;( function () {

  var name        = 'page.history';
  var dependences = [
    'ofio.logger',
    'ofio.utils',
    'ofio.triggers'
  ];

  var stopped = false;

  var module = new function () {

    this.initVars = function () {
      this.history = [];
    };


    this.add_action = function ( params ) {
      if ( stopped ) return false;

      var action = new Action( params );

      if ( this.history.length ) {
        var last_action = this.history[ this.history.length - 1 ];
        action.prev = last_action;
        last_action.next = action;
      }

      this.history.push( action );
      this.runTrigger( 'page.history.add_action', [ action ] );
    };


    this.stop_save = function() {
      stopped = true;
    };


    this.restore_save = function () {
      stopped = false;
    }
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();