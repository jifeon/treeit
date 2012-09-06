;( function () {

  var name        = 'auth_page.state';
  var dependences = [
    'ofio.triggers',
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
        SHOWN_REG_FORM                      : 0x00000080
      }
    };


    this.init_state_triggers = function () {
      var self = this;

      // auth_form
      this.auth_form.addFunctionToTrigger( 'wud.visible.show', function () {
        self.add_state( self.STATE.SHOWN_LOGIN_FORM );
      } );

      this.auth_form.addFunctionToTrigger( 'wud.visible.hide', function () {
        self.remove_state( self.STATE.SHOWN_LOGIN_FORM );
      } );

      this.auth_form.elements.email.addFunctionToTrigger( 'form_element.focus', function () {
        self.add_state( self.STATE.LOGIN_FORM_EMAIL_ACTIVE );
      } );

      this.auth_form.elements.email.addFunctionToTrigger( 'form_element.blur', function () {
        self.remove_state( self.STATE.LOGIN_FORM_EMAIL_ACTIVE );
      } );

      this.auth_form.elements.pass.addFunctionToTrigger( 'form_element.focus', function () {
        self.add_state( self.STATE.LOGIN_FORM_PASS_ACTIVE );
      } );

      this.auth_form.elements.pass.addFunctionToTrigger( 'form_element.blur', function () {
        self.remove_state( self.STATE.LOGIN_FORM_PASS_ACTIVE );
      } );


      // rem_form
      this.rem_form.addFunctionToTrigger( 'wud.visible.show', function () {
        self.add_state( self.STATE.SHOWN_REM_FORM );
      } );

      this.rem_form.addFunctionToTrigger( 'wud.visible.hide', function () {
        self.remove_state( self.STATE.SHOWN_REM_FORM );
      } );

      this.rem_form.elements.email.addFunctionToTrigger( 'form_element.focus', function () {
        self.add_state( self.STATE.REM_FORM_EMAIL_ACTIVE );
      } );

      this.rem_form.elements.email.addFunctionToTrigger( 'form_element.blur', function () {
        self.remove_state( self.STATE.REM_FORM_EMAIL_ACTIVE );
      } );

      // reg_form
      this.reg_form.addFunctionToTrigger( 'wud.visible.show', function () {
        self.add_state( self.STATE.SHOWN_REG_FORM );
      } );

      this.reg_form.addFunctionToTrigger( 'wud.visible.hide', function () {
        self.remove_state( self.STATE.SHOWN_REG_FORM );
      } );


      // popups
      this.popups.addFunctionToTrigger( 'wud.visible.show', function () {
        self.add_state( self.STATE.SHOWN_POPUP );
      } );

      this.popups.addFunctionToTrigger( 'wud.visible.hide', function () {
        self.remove_state( self.STATE.SHOWN_POPUP );
        self.remove_state( self.STATE.SHOWN_POPUP_HAS_MANY_MESSAGES );
      } );

      this.popups.addFunctionToTrigger( 'popups.fill', function ( messages ) {
        self[ messages.length > 1 ? 'add_state' : 'remove_state' ]( self.STATE.SHOWN_POPUP_HAS_MANY_MESSAGES );
      } );

//      var showState = function () {
//        self.log( 'Page state: ', self.state, 'i' );
//      };
//
//      this.addFunctionToTrigger( 'page.state.add_state',    showState );
//      this.addFunctionToTrigger( 'page.state.remove_state', showState );

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