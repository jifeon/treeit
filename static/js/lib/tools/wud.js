function WUD ( params ) {
  this.init( params );
}

WUD.prototype = new Ofio({
  modules : [
    'ofio.search',
    'ofio.logger',
    'ofio.triggers',
    'wud.jquery',
    'wud.size',
    'wud.dragndrop',
    'wud.category',
    'wud.position.limits',
    'wud.position.conserning',
//    'wud.group',
    'wud.handlers',
    'wud.style'
  ],
  className : 'WUD'
});


WUD.prototype.indexBy          = {
//  'id'        : { type : "number" },
//  'Left()'    : { range : 20, type : 'number' },
//  'Right()'   : { range : 20, type : 'number' },
//  'Bottom()'  : { range : 20, type : 'number' },
//  'Top()'     : { range : 20, type : 'number' }
};


WUD.prototype.initVars = function () {
  this.text             = "";
//  this.autoconnect      = false;
//  this.connectable      = function () { return true; };
//  this.connectPriority  = function () {};
};


WUD.prototype.init = function ( params ) {
  
  this.constructor.prototype.init.call( this, params );

  this.applyWudStyle();
  if ( this.text ) this.Text( this.text );
  this.initHandlers();

  this.runTrigger('wud.init.end');
};


WUD.prototype.applyWudStyle = function () {
  this.$.css({
    position  : 'absolute'
  }, false );
};


WUD.prototype.Text = function ( text ) {
  if ( text === undefined ) return this.text;
  this.text = String( text );
  var textEl = this.$.find(".text");
  if ( !textEl.length ) textEl = this.$;
  textEl.html( this.text );
  return this;
};


WUD.prototype.exec = function ( funName, args ) {
  try {
    for ( var a in args ) {
      args[ a ] = eval( args[ a ] );
    }
    this[ funName ].apply( this, args );
  } catch ( e ) {
    this.log( e.message, 'e' );
  }
};