;( function () {

  var name        = 'page.hotkeys';
  var dependences = [
    'ofio.event_emitter'
  ];


  var module = new function () {

    this.init_hotkeys = function () {
      for ( var h = 0, h_ln = this.hotkeys.length; h < h_ln; h++ ) {
        var hotkeys_params = this.hotkeys[ h ];

        add_hotkeys.call( this, $( hotkeys_params.elem ), hotkeys_params.hk );
      }
    };
  };


  var add_hotkeys = function ( element, hk ) {
    for ( var hotkey in hk ) {
      var hotkey_params = hk[ hotkey ];

      add_hotkey.call( this, element, hotkey, hotkey_params );
    }
  };


  var add_hotkey = function( element, hotkey, hotkey_params ) {
    var action  = hotkey_params.action,
        state   = hotkey_params.state,
        hint    = hotkey_params.hint,
        self    = this;

    element.bind( 'keydown', hotkey, function () {
      return self.hotkey_actions[ action ].call( self );
    } );

    element.bind( 'keyup', hotkey, function () {
      self.emit( 'keyup', hotkey );
      return false;
    } );

    element.bind( 'keypress', hotkey, function () {
      return false;
    } );

    var check_hotkey_vis = function () {
      if ( this.check_state( state ) )
            this.hotkeys_panel.add_hotkey   ( hotkey, typeof hint == 'function' ? hint.call( this ) : hint );
      else  this.hotkeys_panel.remove_hotkey( hotkey );
    };

    this.on( 'add_state',    check_hotkey_vis );
    this.on( 'remove_state', check_hotkey_vis );
  };


  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );
})();