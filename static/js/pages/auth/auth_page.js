function AuthPage ( params ) {
  var self = this;
  $( function () {
    self.init( params );
  } );
}


AuthPage.prototype = new Ofio({
  modules   : [
    'ofio.event_emitter',
    'page.state',
    'auth_page.state',
    'auth_page.hotkeys'
  ],
  className : 'AuthPage',
  ignoreNulls : [
    'current_slide'
  ]
});


AuthPage.prototype.initVars = function () {
  this.auth_form            = new Form({ $ : $('#login')});
  this.rem_form             = new Form({ $ : $('#remember')});
  this.reg_form             = new Form({ $ : $('#registration')});
  this.popups               = null;
  this.messages             = [];
  this.reg_login_switch     = null;
  this.features_switch      = null;
  this.current_login_form   = 'auth';
  this.current_form         = null;
  this.current_slide        = null;
  this.help_link            = $('.help_link');
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
  var self = this;
  this.auth_form.$.validate({
    rules : {
      'user[email]' : {
        required      : true,
        email         : true },

      'user[pass]' : {
        required      : true,
        minlength     : 6 }
    },
    submitHandler : function(){
      self.auth_form.submit();
    },
    invalidHandler: function(form, validator) {
      var errors = validator.numberOfInvalids();
      if (errors) {
        var message = errors == 1
          ? 'You missed 1 field. It has been highlighted'
          : 'You missed ' + errors + ' fields. They have been highlighted';
        $("div.error span").html(message);
        $("div.error").show();
      } else {
        $("div.error").hide();
      }
    }
  });

  this.rem_form.$.validate({
    rules : {
      'user[email]' : {
        required      : true,
        email         : true }
    }
  });

  this.reg_form.$.validate({
    rules : {
      'user[email]' : {
        required      : true,
        email         : true },

      'user[pass]' : {
        required      : true,
        minlength     : 6 }
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

  this.auth_form.show();
  this.auth_form.focus();
};


AuthPage.prototype.to_rem_form = function () {
  var email = this.current_form.find('user[email]').val();
  if ( email ) this.rem_form.find('user[email]').val( email );

  this.auth_form.hide();
  this.reg_form.hide();
  this.rem_form.show();
  this.rem_form.focus();

  this.current_login_form = 'rem';
  this.current_form       = this.rem_form;
};


AuthPage.prototype.to_auth_form = function () {
  var email = this.current_form.find('user[email]').val();
  if ( email ) this.auth_form.find('user[email]').val( email );

  this.rem_form.hide();
  this.reg_form.hide();
  this.auth_form.show();
  this.auth_form.focus();

  this.current_login_form = 'auth';
  this.current_form       = this.auth_form;
};


AuthPage.prototype.to_reg_form = function () {
  var email = this.current_form.find('user[email]').val();
  if ( email ) this.reg_form.find('user[email]').val( email );

  this.rem_form.hide();
  this.auth_form.hide();
  this.reg_form.show();
  this.reg_form.focus();

  this.current_form = this.auth_form;
};

AuthPage.prototype.to_slide = function ( n ) {
  if ( this.current_slide ) this.current_slide.hide();

  this.current_slide = $( '#slide' + n );
  if ( this.current_slide ) this.current_slide.show();
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
    start_item : 0
  });

  this.features_switch = new Switch({
    $ : $('#feature_preview_switch'),
    items : [
      {
        name : 'Общий вид',
        callback : function () {
          self.to_slide(1);
        }
      },
      {
        name : 'Как выглядит блок',
        callback : function () {
          self.to_slide(2);
        }
      },
      {
        name : 'Действия',
        callback : function () {
          self.to_slide(3);
        }
      },
      {
        name : 'Горячие клавиши',
        callback : function () {
          self.to_slide(4);
        }
      },
      {
        name : 'Дополнения',
        callback : function () {
          self.to_slide(5);
        }
      }
    ],
    start_item  : 0,
    auto_switch : {
      timeout : 10000
    }
  });

  this.to_slide( 1 );
};


AuthPage.prototype.init_triggers = function () {
  var self = this;

  Form.on( 'error', function(e){
    self.popups.add_messages([{
      type    : 'error',
      message : e
    }]);
  });
};


AuthPage.prototype.init_popups = function () {
  this.popups = new Popups({
    $               : $('#popup'),
    queue           : this.messages,
    animationSpeed  : 500
  });

  var help_popup = new PopupWindow({
    $ : $('#help_popup')
  });

  this.help_link.click( function() {
    help_popup.show();
  } );
};


AuthPage.prototype.init_hotkeys_panel = function () {
  this.hotkeys_panel = new HotkeysPanel({
    $ : $('#footer')
  });
};


