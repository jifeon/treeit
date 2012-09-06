function AuthPage ( params ) {
  var self = this;
  $( function () {
    self.init( params );
  } );
}


AuthPage.prototype = new Ofio({
  modules   : [
    'ofio.triggers',
    'page.state',
    'auth_page.state',
    'auth_page.hotkeys'
  ],
  className : 'AuthPage'
});


AuthPage.prototype.initVars = function () {
  this.auth_form            = {};
  this.rem_form             = {};
  this.reg_form             = {};
  this.popups               = {};
  this.messages             = [];
  this.reg_login_switch     = {};
  this.current_login_form   = 'auth';
  this.current_form         = {};
  this.failed_registration  = false;
};


AuthPage.prototype.init = function ( params ) {
  this.constructor.prototype.init.call( this, params );

  this.init_forms();
  this.init_switch();
  this.init_triggers();
  this.init_popups();
  this.init_hotkeys_panel();
  this.init_hotkeys();
  this.init_state_triggers();
};


AuthPage.prototype.init_forms = function () {
  this.auth_form = new Form({
    $         : $('#login'),
    name      : 'User',
    elements  : {
      email : new Text({
        $       : $('#email'),
        rules   : { required : 1, email : 1 },
        name    : 'E-mail'
      }),
      pass : new Text({
        $       : $('#pass'),
        rules   : { required : 1, len : { min : 6 }, latin_num_punto : 1 },
        name    : 'Пароль',
        trim    : false
      }),
      rememberMe : new FormCheckbox({
        $       : $('#rememberMe')
      })
    },
    submit_button : $('#login_submit')
  });

  this.rem_form = new Form({
    $ : $('#remember'),
    name     : 'User',
    elements : {
      email : new Text({
        $       : $('#email_rem'),
        rules   : { required : 1, email : 1 },
        name    : 'E-mail'
      })
    },
    submit_button : $('#remember_submit')
  });

  this.reg_form = new Form({
    $     : $("#registration"),
    name  : 'User',
    elements  : {
      email : new Text({
        $       : $('#email_reg'),
        rules   : { required : 1, email : 1 },
        name    : 'E-mail'
      }),
      realpass : new Text({
        $       : $('#pass_reg'),
        rules   : { required : 1, len : { min : 6 }, latin_num_punto : 1 },
        name    : 'Пароль',
        trim    : false
      }),
      pass2 : new Text({
        $       : $('#pass2_reg'),
        rules   : { required : 1, len : { min : 6 }, latin_num_punto : 1 },
        name    : 'Повтор пароля',
        trim    : false
      })
    },
    submit_button : $('#reg_submit'),
    on_validate   : function () {
      var messages = [];

      if ( this.get_value( 'realpass' ) != this.get_value( 'pass2' ) ) messages.push({
        message : 'Введенные пароли не совпадают',
        type    : 'error'
      });

      return messages;
    }
  });

  var self = this;

  $('#i_forgot').click( function () {
    self.to_rem_form();
  });

  $('#i_recollect').click( function () {
    self.to_auth_form();
  });

  this.current_form = this.auth_form;

  if ( this.failed_registration ) this.to_reg_form();
  else {
    this.auth_form.show();
    this.auth_form.focus();
  }
};


AuthPage.prototype.to_rem_form = function () {
  var email = this.current_form.get_value( 'email' );
  if ( email ) this.rem_form.set_value( 'email', email );

  this.auth_form.hide();
  this.reg_form.hide();
  this.rem_form.show();
  this.rem_form.focus();

  this.current_login_form = 'rem';
  this.current_form       = this.rem_form;
};


AuthPage.prototype.to_auth_form = function () {
  var email = this.current_form.get_value( 'email' );
  if ( email ) this.auth_form.set_value( 'email', email );

  this.rem_form.hide();
  this.reg_form.hide();
  this.auth_form.show();
  this.auth_form.focus();

  this.current_login_form = 'auth';
  this.current_form       = this.auth_form;
};


AuthPage.prototype.to_reg_form = function () {
  var email = this.current_form.get_value( 'email' );
  if ( email ) this.reg_form.set_value( 'email', email );

  this.rem_form.hide();
  this.auth_form.hide();
  this.reg_form.show();
  this.reg_form.focus();

  this.current_form = this.auth_form;
};


AuthPage.prototype.init_switch = function () {
  var self = this;

  this.reg_login_switch = new Switch({
    $ : $('#login_registration'),
    items : [
      {
        name : 'Вход',
        callback : function () {
          if ( self.current_login_form == 'rem' ) self.to_rem_form();
          else self.to_auth_form();
        }
      },
      {
        name : 'Регистрация',
        callback : function () {
          self.to_reg_form();
        }
      }
    ],
    start_item : this.failed_registration ? 1 : 0
  });

  this.reg_login_switch.$.css({
    visibility : 'visible'
  });
};


AuthPage.prototype.init_triggers = function () {
  var self = this;
  this.addFunctionToGlobalTrigger( 'Form.submit.has_messages', function ( messages ) {
    self.popups.add_messages( messages, true );
  } );
};


AuthPage.prototype.init_popups = function () {
  this.popups = new Popups({
    $               : $('#popup'),
    queue           : this.messages,
    animationSpeed  : 500
  })
};


AuthPage.prototype.init_hotkeys_panel = function () {
  this.hotkeys_panel = new HotkeysPanel({
    $ : $('#footer')
  });
};


