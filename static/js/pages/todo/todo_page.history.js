;( function () {

  var name        = 'todo_page.history';
  var dependences = [
    'ofio.event_emitter'
  ];

  var module = new function () {

    this.initVars = function () {};
    this.init = function () {};

    this.init_history_triggers = function () {

      var self = this;

      Task.on( 'create', function () {
        self.add_action({
          params    : this.get_params(),
          operation : Action.create,
          obj       : this
        });
      } );

      Task.on( 'remove', function () {
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

      Task.on( 'set_text',     update );
      Task.on( 'set_done',     update );
      Task.on( 'set_ex_param', update );
      Task.on( 'set_next',     update );
      Task.on( 'set_prev',     update );
      Task.on( 'set_parent',   update );

      this.on( 'before_close', function () {
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