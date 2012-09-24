;( function () {

  var name        = 'auth_page.state';
  var dependences = [
    'ofio.event_emitter',
    'ofio.logger'
  ];

  var module = new function () {

    this.initVars = function () {
      this.STATE          = {
        BLANK                               : 0x00000000,
        SHOWN_LOGIN_FORM                    : 0x00000001,
        LOGIN_FORM_EMAIL_ACTIVE             : 0x00000002,
        LOGIN_FORM_PASS_ACTIVE              : 0x00000004,
        SHOWN_REM_FORM                      : 0x00000008,
        REM_FORM_EMAIL_ACTIVE               : 0x00000010,
        SHOWN_POPUP                         : 0x00000020,
        SHOWN_POPUP_HAS_MANY_MESSAGES       : 0x00000040,
        SHOWN_REG_FORM                      : 0x00000080,
        SHOWN_POPUP_WINDOW                  : 0x00000100
      }
    };


    this.init_state_triggers = function () {
      var self = this;

      // auth_form
      this.auth_form.on( 'visible.show', function () {
        self.add_state( self.STATE.SHOWN_LOGIN_FORM );
      } );

      this.auth_form.on( 'visible.hide', function () {
        self.remove_state( self.STATE.SHOWN_LOGIN_FORM );
      } );

      this.auth_form.elements.email.on( 'focus', function () {
        self.add_state( self.STATE.LOGIN_FORM_EMAIL_ACTIVE );
      } );

      this.auth_form.elements.email.on( 'blur', function () {
        self.remove_state( self.STATE.LOGIN_FORM_EMAIL_ACTIVE );
      } );

      this.auth_form.elements.pass.on( 'focus', function () {
        self.add_state( self.STATE.LOGIN_FORM_PASS_ACTIVE );
      } );

      this.auth_form.elements.pass.on( 'blur', function () {
        self.remove_state( self.STATE.LOGIN_FORM_PASS_ACTIVE );
      } );


      // rem_form
      this.rem_form.on( 'visible.show', function () {
        self.add_state( self.STATE.SHOWN_REM_FORM );
      } );

      this.rem_form.on( 'visible.hide', function () {
        self.remove_state( self.STATE.SHOWN_REM_FORM );
      } );

      this.rem_form.elements.email.on( 'focus', function () {
        self.add_state( self.STATE.REM_FORM_EMAIL_ACTIVE );
      } );

      this.rem_form.elements.email.on( 'blur', function () {
        self.remove_state( self.STATE.REM_FORM_EMAIL_ACTIVE );
      } );

      // reg_form
      this.reg_form.on( 'visible.show', function () {
        self.add_state( self.STATE.SHOWN_REG_FORM );
      } );

      this.reg_form.on( 'visible.hide', function () {
        self.remove_state( self.STATE.SHOWN_REG_FORM );
      } );


      // popups
      this.popups.on( 'visible.show', function () {
        self.add_state( self.STATE.SHOWN_POPUP );
      } );

      this.popups.on( 'visible.hide', function () {
        self.remove_state( self.STATE.SHOWN_POPUP );
        self.remove_state( self.STATE.SHOWN_POPUP_HAS_MANY_MESSAGES );
      } );

      this.popups.on( 'fill', function ( messages ) {
        self[ messages.length > 1 ? 'add_state' : 'remove_state' ]( self.STATE.SHOWN_POPUP_HAS_MANY_MESSAGES );
      } );

      PopupWindow.on( 'show', function () {
        self.add_state( self.STATE.SHOWN_POPUP_WINDOW );
      } );

      PopupWindow.on( 'hide', function () {
        self.remove_state( self.STATE.SHOWN_POPUP_WINDOW );
      } );

      with ( this.STATE )
      this.add_state( this.failed_registration ? SHOWN_REG_FORM : SHOWN_LOGIN_FORM | LOGIN_FORM_EMAIL_ACTIVE );
    };
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();