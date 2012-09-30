function Addon ( params ) {
  this.init( params );
}


Addon.prototype = new Ofio({
  modules   : [
    'wud.jquery',
    'ofio.event_emitter',
    'ofio.utils'
  ],
  className   : 'Addon',
  ignoreNulls : [ 'expire_date' ]
});


Addon.prototype.initVars = function () {
  this.name         = null;
  this.price        = 0;
  this.expire_date  = null;
};


Addon.prototype.init = function ( params ) {
  this.constructor.prototype.init.call( this, params );

  this.init_elements();
  this.add_handlers();
};


Addon.prototype.init_elements = function () {
  this.elements = {
    add         : this.$.find('.add'),
    cancel      : this.$.find('.cancel'),
    prolong     : this.$.find('.prolong'),
    expire_date : this.$.find('.expire_date'),
    expire_date_message : this.$.find('.expire_date_message')
  };
  
  if ( this.expire_date && ( new Date ) < this.expire_date ) {
    this.elements.add.hide();
    this.elements.prolong.show();
    this.elements.expire_date_message.show();
    var d = this.expire_date;
    this.elements.expire_date.text(
      this.utils.two_pos( d.getDate() ) + '.' +
      this.utils.two_pos( d.getMonth() + 1 ) + '.' +
      d.getFullYear()
    );
  }
  else {
    this.expire_date = null;
  }
};


Addon.prototype.add_handlers = function () {
  var self = this;

  this.elements.add.click( function() {
    this.style.display = 'none';
    self.elements.cancel.show();
    self.emit( 'add' );
  });

  this.elements.prolong.click( function() {
    this.style.display = 'none';
    self.elements.cancel.show();
    self.emit( 'add' );
  });

  this.elements.cancel.click( function() {
    this.style.display = 'none';
    self.elements[ self.expire_date ? 'prolong' : 'add' ].show();
    self.emit( 'cancel' );
  });
};



