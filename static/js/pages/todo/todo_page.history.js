;( function () {

  var name        = 'todo_page.history';
  var dependences = [
    'ofio.triggers'
  ];

  var module = new function () {

    this.initVars = function () {};
    this.init = function () {};

    this.init_history_triggers = function () {

      var self = this;

      this.addFunctionToGlobalTrigger( 'task.create', function () {
        self.add_action({
          params    : this.get_params(),
          operation : Action.create,
          obj       : this
        });
      } );

      this.addFunctionToGlobalTrigger( 'task.remove', function () {
        self.add_action({
          operation : Action.remove,
          obj       : this
        });
      } );

      var update = function () {
        self.add_action({
          params    : this.get_params(),
          operation : Action.update,
          obj       : this
        });
      };

      this.addFunctionToGlobalTrigger( 'task.set_text',     update );
      this.addFunctionToGlobalTrigger( 'task.set_done',     update );
      this.addFunctionToGlobalTrigger( 'task.set_ex_param', update );
      this.addFunctionToGlobalTrigger( 'task.set_next',     update );
      this.addFunctionToGlobalTrigger( 'task.set_prev',     update );
      this.addFunctionToGlobalTrigger( 'task.set_parent',   update );

      this.addFunctionToTrigger( 'page.before_close', function () {
        var view = this.get_focused_view();
        view.save_title();
      } );
    };
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();