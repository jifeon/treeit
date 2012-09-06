function VerticalPlaceHolder ( params ) {
  this.init( params );
}


VerticalPlaceHolder.prototype = new Ofio({
  modules : [
    'wud.jquery',
    'wud.size'
  ],
  className : 'VerticalPlaceHolder'
});



VerticalPlaceHolder.prototype.initVars = function () {
  this.toggle = $('<div></div>').css({
    position  : 'absolute',
    right     : 5,
    top       : 5,
    width     : 15,
    height    : 15,
    backgroundColor : 'gray'
  });

  this.holder = $('<div></div>');
  this.height = '100%';

  this.startWidth = 0;
};


VerticalPlaceHolder.prototype.init = function ( params ) {
  this.constructor.prototype.init.call( this, params );

  this.$.css( {
    borderRight : '1px solid gray',
    float       : 'left',
    position    : 'relative',
    overflowX   : 'hidden',
    overflowY   : 'auto'
  });

  this.$.prepend( this.holder );
  this.$.prepend( this.toggle );

  this.startWidth = this.Width();

  this.addHandlers();
};


VerticalPlaceHolder.prototype.addHandlers = function () {
  var self = this;

  this.toggle.toggle(
    function () {
      self.hide();
    },
    function () {
      self.show();
    }
  );


};


VerticalPlaceHolder.prototype.hide = function () {
  this.holder.hide();
  this.Width( 25, false );
};


VerticalPlaceHolder.prototype.show = function () {
  this.holder.show();
  this.Width( this.startWidth, false );
};


VerticalPlaceHolder.prototype.Holder = function () {
  return this.holder;
};

