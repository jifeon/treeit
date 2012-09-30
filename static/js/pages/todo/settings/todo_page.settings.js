;( function () {

  var name        = 'todo_page.settings';
  var dependences = [
    'ofio.ajax'
  ];

  var module = new function () {

    this.initVars = function() {
      this.pre_pay_url = null;
      this.addons             = [];
      this.addons_to_install  = {};
      this.addons_count       = 0;

      this.payment_error = {
        type    : 'error',
        message : 'Возникла ошибка, попробуйте установить дополнения позднее'
      };

      this.popup_window = false;
    };

    this.init = function () {
      this.popup_window = new PopupWindow({
        $ : $('#settings')
      });

      this.elements   = {
        addons_count  : $('#addons_count'),
        panel         : $('#settings_panel'),
        pay           : $('#go_to_pay')
      };

      this.init_addons();
      this.add_handlers();
//      this.show();
    };

    this.init_addons = function() {
      for ( var a = 0, a_ln = this.addons.length; a < a_ln; a++ ) {
        this._add_addon( this.addons[a] );
      }
    };

    this._add_addon = function( params ) {
      var addon = new Addon({
        $           : $('#' + params.name + '_addon'),
        name        : params.name || '',
        price       : params.price || 0,
        expire_date : new Date( params.expire_date * 1000 )
      });

      addon.on( 'add', this._on_add, this );
      addon.on( 'cancel', this._on_cancel, this );
    };

    this._on_add = function() {
      var addon_name = arguments.callee.context.name;

      if ( !this.addons_to_install[ addon_name ] ) {
        this.addons_to_install[ addon_name ] = this;
        this.elements.addons_count.text( ++this.addons_count );
      }

      this.check_panel_visible();
    };

    this._on_cancel = function() {
      var addon_name = arguments.callee.context.name;

      if ( this.addons_to_install[ addon_name ] ) {
        delete this.addons_to_install[ addon_name ];
        this.elements.addons_count.text( --this.addons_count );
      }

      this.check_panel_visible();
    };

    this.check_panel_visible = function() {
      this.elements.panel[ this.addons_count ? 'show' : 'hide' ]();
    };

    this.show = function() {
      this.popup_window.show();
      this.Class.emit( 'settings_show' );
    };


    this.hide = function() {
      this.popup_window.hide();
      this.Class.emit( 'settings_hide' );
    };


    this.pre_pay = function() {
      this.popup_window.$.hide();
      this.Class.popups.add_messages([{
        type    : 'wait',
        message : 'Ваша заявка обрабатывается'
      }]);

      var chosen_addons = this._get_addons_names();

      var self = this;
      this.Class.ajax( this.pre_pay_url, {
        addons : chosen_addons.toString()
      }, function( data ) {
        if ( !data ) {
          self.Class.popups.add_messages([ self.payment_error ], true);
          self.hide();
        }

        self.pay( data.price, chosen_addons, data.payment_id, data.rnd );
      });
    };


    this.pay = function( price, chosen_addons, payment_id, rnd ) {
      if ( !this.addons_count ) return false;

      var wm_form = document.forms[ 'wm_form' ];
      if ( !wm_form ) return false;

      wm_form[ 'LMI_PAYMENT_AMOUNT' ].value = price;
      wm_form[ 'LMI_PAYMENT_DESC' ].value   = this.calculate_description( chosen_addons );
      wm_form[ 'LMI_PAYMENT_NO' ].value     = payment_id;
      wm_form[ 'RND' ].value                = rnd;

      this.Class.show_save_messsage = false;
      wm_form.submit();
    };


    this.calculate_payment = function() {
      var p = 0;

      for ( var name in this.addons_to_install ) {
        p += this.addons_to_install[ name ].price;
      }

      return p;
    };


    this.calculate_description = function( addons ) {
      return 'Payment for TreeIT addons: "' + addons.join(', ') + '"';
    };


    this._get_addons_names = function() {
      var addons = [];

      for ( var name in this.addons_to_install ) {
        addons.push( name );
      }

      return addons;
    }


    this.add_handlers = function() {
      var self = this;

      this.elements.pay.click( function() {
        self.pre_pay();
      } );
    };
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences,
    namespace   : 'settings'
  } );

})();