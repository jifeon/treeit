function ConsoleToolTip ( params ) {
  this.init( params );
}


ConsoleToolTip.prototype = new Ofio({
  modules : [],
  className : 'ConsoleToolTip'
});



ConsoleToolTip.prototype.initVars = function () {
  this.params = [];
};


ConsoleToolTip.prototype.init = function ( params ) {
  this.constructor.prototype.init.call( this, params );
};


ConsoleToolTip.prototype.show = function () {
  console.log( this.params.join('') );
};


ConsoleToolTip.prototype.hide = function () {
  console.log( 'end '+this.params.join('') );
};
