;( function () {

  var name        = 'page.hotkeys';
  var dependences = [
    'ofio.triggers'
  ];

  var add_hotkey = function ( element, hk, context ) {
    var self = this;
    context = context || this;

    for ( var hotkey in hk ) {
      var hotkey_params = hk[ hotkey ];

      ( function ( state, hint, action, hotkey, context ) {

        element.bind( 'keydown', hotkey, function () {
          return self.hotkey_actions[ action ].call( context );
        } );

        element.bind( 'keyup', hotkey, function () {
          self.runTrigger( 'page.keyup', [ hotkey ] );
          return false;
        } );

        element.bind( 'keypress', hotkey, function () {
          return false;
        } );

        var check_hotkey_vis = function () {
          if ( this.check_state( state ) )
            this.hotkeys_panel.add_hotkey( hotkey, typeof hint == 'function' ? hint.call( context ) : hint );
          else this.hotkeys_panel.remove_hotkey( hotkey );
        };

        self.addFunctionToTrigger( 'page.state.add_state',    check_hotkey_vis );
        self.addFunctionToTrigger( 'page.state.remove_state', check_hotkey_vis );
      })( hotkey_params.state, hotkey_params.hint, hotkey_params.action, hotkey, context );
    }
  };

  var module = new function () {

    this.init_hotkeys = function () {
      var self = this;

      for ( var h = 0, h_ln = this.hotkeys.length; h < h_ln; h++ ) {
        var hotkeys_params = this.hotkeys[ h ];

        if ( hotkeys_params.elem ) add_hotkey.call( this, $( hotkeys_params.elem ), hotkeys_params.hk );
        else this.addFunctionToGlobalTrigger( hotkeys_params.trigger, function () {
          add_hotkey.call( self, hotkeys_params.get_element.call( this ), hotkeys_params.hk, this );
        } );
      }
    };
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();