function PopupWindow ( params ) {
  this.init( params );
}

PopupWindow.current_popup = null;


PopupWindow.prototype = new Ofio({
  modules   : [
    'wud.jquery',
    'ofio.event_emitter'
  ],
  className : 'PopupWindow'
});


PopupWindow.prototype.initVars = function () {
  this.elements = {};
};


PopupWindow.prototype.init = function ( params ) {
  this.constructor.prototype.init.call( this, params );

  this.elements.close = this.$.find( '.close_popup' );
  this.elements.shade = $('#shade');

  this.add_handlers();
};


PopupWindow.prototype.add_handlers = function () {
  var self = this;

  this.elements.shade.click( function() {
    self.hide();
  } );

  this.elements.close.click( function() {
    self.hide();
  });
};


PopupWindow.prototype.show = function() {
  if ( PopupWindow.current_popup ) PopupWindow.current_popup.hide();
  PopupWindow.current_popup = this;

  this.$.show();
  this.elements.shade.show();
  this.emit( 'show' );
};


PopupWindow.prototype.hide = function() {
  PopupWindow.current_popup = null;
  this.$.hide();
  this.elements.shade.hide();
  this.emit( 'hide' );
};



