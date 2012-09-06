function DivToolTip ( params ) {
  this.init( params );
}


DivToolTip.prototype = new Ofio({
  modules : [
    'wud.jquery',
    'wud.visible',
    'ofio.utils',
    'wud.position'
  ],
  className : 'DivToolTip'
});



DivToolTip.prototype.initVars = function () {
  this.params = [];
  this.parent = null;
  this.width  = 300;
  this.height = 50;
};


DivToolTip.prototype.init = function ( params ) {
  this.constructor.prototype.init.call( this, params );
  this.css({
    position    : 'absolute',
    background  : 'white',
    border      : '1px solid red'
  });
  this.hide( false );
};


DivToolTip.prototype.show = function ( text, position ) {
  this.$$().text( text || this.params[0] );
  this.Position(
    position
      ? position
      : (
        this.params[1] ||
        typeof mouse != "undefined"
          ? mouse.Position()
          : { x : 0, y : 0 }
        ),
    false
  );
  
  this.__ofio.modules[ 'wud.visible' ].call( this, 'show', [ true ] );
};


DivToolTip.prototype.hide = function ( animate ) {
  this.__ofio.modules[ 'wud.visible' ].call( this, 'hide', [ animate !== false ] );
};
