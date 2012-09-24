;( function () {

  var name        = 'ofio.json';
  var dependences = [];

  var getSpaces = function ( num ) {
    for ( var n = 0, res = ''; n < num; n++, res += ' ' );
    return res;
  }

  var decode = function ( obj, indent ) {
    indent = indent || 0;
    var result = [];
    if ( obj == null ) result.push( 'null' );
    else if ( obj instanceof Array ) {
      result.push( '[\n' );

      for ( var o = 0, o_ln = obj.length; o < o_ln; o++ ) {
        var val = obj[ o ];
        result.push( getSpaces( indent + 2 ) );
        Array.prototype.push.apply( result, decode( val, indent + 2 ) );
        result.push( ',\n' );
      }
      if ( result.length > 1 ) result.pop();
      result.push( '\n', getSpaces( indent ), ']' );
    }
    else if ( obj instanceof Object ) {
      result.push( '{\n' );

      for ( var prop in obj ) {
        var val = obj[ prop ];
        result.push( getSpaces( indent + 2 ), prop, ' : ' );
        Array.prototype.push.apply( result, decode( val, indent + 2 ) );
        result.push( ',\n' );
      }
      if ( result.length > 1 ) result.pop();
      result.push( '\n', getSpaces( indent ), '}' );
    }
    else if ( typeof obj == 'number' || obj === true || obj === false ) result.push( obj );
    else if ( typeof obj == 'string' ) result.push( '"', obj, '"' );

    return result;
  }

  var php_decode = function ( obj, quot ) {
    var result  = [];
    quot        = quot || '"';
    if ( obj == null ) result.push( 'null' );
    else if ( obj instanceof Array ) {
      result.push( '[' );

      for ( var o = 0, o_ln = obj.length; o < o_ln; o++ ) {
        Array.prototype.push.apply( result, php_decode( obj[ o ], quot ) );
        result.push( ',' );
      }
      if ( result.length > 1 ) result.pop();
      result.push( ']' );
    }
    else if ( obj instanceof Object ) {
      result.push( '{' );

      for ( var prop in obj ) {
        var val = obj[ prop ];
        result.push( '"', prop, '" : ' );
        Array.prototype.push.apply( result, php_decode( val, quot ) );
        result.push( ',' );
      }
      if ( result.length > 1 ) result.pop();
      result.push( '}' );
    }
    else if ( typeof obj == 'number' || obj === true || obj === false ) result.push( obj );
    else if ( typeof obj == 'string' ) result.push( quot, obj.replace( /("|\\)/g, "\\$1" ), quot );

    return result;
  }

  var module = new function () {

    this.json_decode = function ( obj, wrapped, for_php, quot ) {
      if ( wrapped == undefined ) wrapped = true;

      var decoded = for_php ? php_decode( obj, quot ) : decode( obj, 0 );

      if ( !wrapped && decoded.length >= 2 ) {
        decoded.pop();
        decoded.shift();
      }
      
      return decoded.join( '' );
    }

  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();