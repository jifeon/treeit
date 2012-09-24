function HotkeysPanel ( params ) {
  this.init( params );
}


HotkeysPanel.prototype = new Ofio({
  modules   : [
    'wud.jquery'
  ],
  className : 'HotkeysPanel'
});


HotkeysPanel.prototype.initVars = function () {
  this.hotkeys = {};
  this.very_hot = {
  };
};


HotkeysPanel.prototype.init = function ( params ) {
  this.constructor.prototype.init.call( this, params );
};


HotkeysPanel.prototype.add_hotkey = function ( hk, description ) {
  if ( !hk || !description || this.hotkeys[ hk ] ) return false;

  var hk_span = $('<span class="hk"></span>').text( this.replace_special_symbols( hk )  );
  var hkd_span = $('<span class="hk_descr"></span>').text( description );

  this.hotkeys[ hk ] = $('<div></div>').append( hk_span ).append( hkd_span ).appendTo( this.$ );
  if ( this.very_hot[ hk ] ) this.hotkeys[ hk ].css({
    color : '#cc3300'
  })
};


HotkeysPanel.prototype.replace_special_symbols = function ( str ) {
  return str.replace( /down/g, '↓' ).replace( /up/g, '↑' ).replace( /left/g, '←' ).replace( /right/g, '→' );
};


HotkeysPanel.prototype.remove_hotkey = function ( hk ) {
  if ( this.hotkeys[ hk ] ) {
    this.hotkeys[ hk ].remove();
    delete this.hotkeys[ hk ];
  }
};
