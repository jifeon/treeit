;( function () {

  var name        = 'ofio.html';
  var dependences = [];

  var getSpaces = function ( num ) {
    for ( var n = 0, res = ''; n < num; n++, res += ' ' );
    return res;
  }

  var module = new function () {

    this.html_decode = function ( str ) {
      str = ( typeof str == "string" ) ? str.replace( /\n/gi, '' ).replace( /\s{2,}/g, ' ' ) : '';

      var result    = [],
          indent    = 0,
          d_indent  = 2,
          css       = false,
          tag       = '',
          collect   = false;

      for ( var c = 0, ch = str.charAt( c ); c < str.length; ch = str.charAt( ++c ) ) {
        switch ( ch ) {
          case '>':
            collect = false;
            if ( tag == 'style' ) css = true;
            if ( tag == '/style' ) css = false;
            tag = '';
            result.push( ch, '\n', getSpaces( indent ) );
            break;

          case '}':
          case '{':
//            indent += ( ch == '{' ? d_indent : -d_indent );
          case ';':
            result.push( ch );
            if ( css ) result.push( '\n', getSpaces( indent ) );
            break;

          case '<':
//            indent += d_indent;
            collect = true;
            result.push( ch );
            break;

          case '/':
//            if ( str.charAt( c - 1 ) == '<' ) indent -= d_indent;

          default:
            if ( collect ) tag += ch;
            result.push( ch );
        }
      }

      return result.join('');
    };

  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();