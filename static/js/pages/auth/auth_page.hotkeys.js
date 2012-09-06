;( function () {

  var name        = 'auth_page.hotkeys';
  var dependences = [
    'auth_page.state',
    'page.hotkeys'
  ];

  var module = new function () {

    this.initVars = function () {
      var self = this;

      this.hotkeys = [
        {
          elem  : document,
          hk    : {
            'ctrl+m' : {
              action  : 'message_next',
              hint    : 'седующее сообщение',
              state   : this.STATE.SHOWN_POPUP_HAS_MANY_MESSAGES
            },
            'ctrl+shift+m'  : {
              action  : 'message_prev',
              hint    : 'предыдущее сообщение',
              state   : this.STATE.SHOWN_POPUP_HAS_MANY_MESSAGES
            },
            'ctrl+h'  : {
              action  : 'close_popups',
              hint    : 'закрыть попап',
              state   : this.STATE.SHOWN_POPUP
            },
            'ctrl+2'  : {
              action  : 'show_rem_form',
              hint    : 'я забыл пароль',
              state   : [ this.STATE.SHOWN_LOGIN_FORM, this.STATE.SHOWN_REG_FORM ]
            },
            'ctrl+1'  : {
              action  : 'show_login_form',
              hint    : 'я вспомнил пароль',
              state   : [ this.STATE.SHOWN_REM_FORM, this.STATE.SHOWN_REG_FORM ]
            },
            'ctrl+3'  : {
              action  : 'show_reg_form',
              hint    : 'регистрация',
              state   : [ this.STATE.SHOWN_REM_FORM, this.STATE.SHOWN_LOGIN_FORM ]
            }
          }
        }
      ];


      this.hotkey_actions = new function () {
        this.message_next = function () {
          self.popups.next_message();
          return false;
        };

        this.message_prev = function () {
          self.popups.prev_message();
          return false;
        };

        this.close_popups = function () {
          self.popups.close();
          return false;
        };

        this.show_rem_form = function () {
          self.to_rem_form();
          self.reg_login_switch.to( 0 );
          return false;
        };

        this.show_login_form = function () {
          self.to_auth_form();
          self.reg_login_switch.to( 0 );
          return false;
        };

        this.show_reg_form = function() {
          self.to_reg_form();
          self.reg_login_switch.to( 1 );
          return false;
        }
      };
    };
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();