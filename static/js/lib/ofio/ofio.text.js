;( function () {

  var name        = 'ofio.text';
  var dependences = [];

  var preventSelectionFlag = false;

  var module = new function () {

    this.removeSelection = function () {
      if ( !preventSelectionFlag ) return;
      if ( window.getSelection ) {
        window.getSelection().removeAllRanges();
      }
      else
        if ( document.selection && document.selection.empty )
          document.selection.empty();
    };


    this.preventSelection = function (element) {
      var self = this;
      $( element )
        .mousemove( this.removeSelection )
        .mouseup(   this.removeSelection );
      $( element )
        .mousedown(function (event) {
        var sender = event.target || event.srcElement;
        preventSelectionFlag = !sender.tagName.match( /input|textarea/i );
      })
        .keydown( function ( event ) {
        var sender = event.target || event.srcElement;
        preventSelectionFlag = !sender.tagName.match( /input|textarea/i );
        if ( preventSelectionFlag ) self.removeSelection();
      });
      if ( !$.browser.msie ) element.onselectstart = function () {
        return false;
      };
    };


    this.unpreventSelection = function ( element ) {
      $( element )
        .unbind( 'mousemove', this.removeSelection )
        .unbind( 'mouseup',   this.removeSelection );
      if ( !$.browser.msie ) element.onselectstart = null;
      this.preventSelectionFlag = false;
    };


    this.get_caret_position = function ( element ) {
      if ( document.selection ) {
        element.focus();
        var range = document.selection.createRange();
        range.moveStart( 'character', -element.value.length );
        return range.text.length;
      } else if ( isFinite( element.selectionStart ) ) return element.selectionStart;
      return 0;
    };

    
    this.set_caret_position = function ( element, position ) {
      if ( !$( element ).is( ':visible' ) ) return false;
      if ( element.setSelectionRange ) {
        element.focus();
        element.setSelectionRange( position, position );
      } else if ( element.createTextRange ) {
        var range = element.createTextRange();
        range.collapse( true );
        range.moveEnd( 'character', position);
        range.moveStart( 'character', position);
        range.select();
      }
    };
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();