function SwitchItem ( params ) {
  this.init( params );
}


SwitchItem.prototype = new Ofio({
  modules   : [
    'wud.jquery'
  ],
  className : 'SwitchItem'
});


SwitchItem.prototype.initVars = function () {
  this.name     = null;
  this.callback = function () {};
  this._switch  = null;
};


SwitchItem.prototype.init = function ( params ) {
  this.constructor.prototype.init.call( this, params );

  var self = this;

  this.$.text( this.name );
  this.$.click( function () {
    if ( self._switch.to_item( self, true, true )  ) self.fire_event();
  });
};


SwitchItem.prototype.fire_event = function () {
  if ( typeof this.callback == 'function' ) this.callback();
};
