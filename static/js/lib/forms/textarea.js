function Textarea ( params ) {
  this.init( params );
}


Textarea.shadow         = null;
Textarea.create_shadow  = function ( textarea ) {
  if ( this.shadow ) return false;
  this.shadow = $('<div></div>').css({
      position    : 'absolute',
      top         : -10000,
      left        : -10000,
      fontSize    : textarea.css('fontSize'),
      fontFamily  : textarea.css('fontFamily'),
      lineHeight  : textarea.css('lineHeight'),
      resize      : 'none'
  }).appendTo(document.body);
}


Textarea.prototype = new Ofio({
  modules   : [
    'wud.jquery',
    'jquery.api.stub'
  ],
  className : 'Textarea'
});


Textarea.prototype.initVars = function () {
  this.line_height    = 18;
  this.curent_height  = 18;
  this.min_height     = 18;
  this.callback       = function () {};
  this.timeout        = null;
};


Textarea.prototype.redefineVars = function ( variable ) {
  switch ( variable ) {
    case 'timeout':
      break;

    default: return false;
  }

  return true;
};


Textarea.prototype.init = function ( params ) {
  this.constructor.prototype.init.call( this, params );

  Textarea.create_shadow( this.$ );
  this.add_handlers();
};


Textarea.prototype.add_handlers = function () {
  var self = this;

  this.$.keyup( function () {
    self.check_height( true );
  } );
};


Textarea.prototype.check_height = function ( latency ) {
  var self = this;

  if ( this.timeout ) clearTimeout( this.timeout );

  if ( latency ) {
    this.timeout = setTimeout( function () {
      self.check_height();
    }, 50 );
    return false;
  }

  var val   = this.$.val().replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/&/g, '&amp;')
                        .replace(/\n$/, '<br/>&nbsp;')
                        .replace(/\n/g, '<br/>')
                        .replace(/ {2,}/g, function( space ) { return self.get_spaces( space.length-1 ) + ' '; });

  Textarea.shadow.html( val ).width( this._width );
  var height = Math.max( Textarea.shadow.height(), this.min_height );
  if ( height != this.curent_height ) {
    this.curent_height = height;
    this.curent_height = this.get_lines_count() * this.line_height;
    this.$.css( 'height', this.curent_height );
    this.callback.call( this );
  }
};


Textarea.prototype.get_spaces = function ( n ) {
  var res = '';
  for( var i = 0; i < n; i++ ) {
    res = res + '&nbsp';
  }
  return res;
};


Textarea.prototype.val = function ( text ) {
  if ( text == undefined ) return this.$.val();

  this.$.val( text );
  this.check_height();
  return this;
};


Textarea.prototype.width = function( w ) {
  if ( w != undefined ) {
    this._width = w;
    this.check_height();
  }
  return this.$.width( w );
}


Textarea.prototype.get_lines_count = function () {
  return Math.round( this.curent_height / this.line_height );
};