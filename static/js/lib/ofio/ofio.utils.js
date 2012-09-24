;( function () {

  var name        = 'ofio.utils';
  var dependences = [];
  var nameSpace   = 'utils';


  var simpleClone = function ( cloned ) {
    var result = {};

    if ( cloned instanceof Array ) result = cloned.slice(0);
    else if ( cloned instanceof Object ) for ( var par in cloned ) {
      result[ par ] = cloned[ par ];
    } else result = cloned;

    return result;
  };


  var recursiveClone = function ( cloned ) {
    var result;

    if ( cloned instanceof Array ) {
      result = [];
      for ( var c = 0, c_ln = cloned.length; c < c_ln; c++ ) {
        result.push( recursiveClone( cloned[c] ) );
      }
    }
    else if ( cloned instanceof Object ) {
      result = {};
      for ( var prop in cloned ) {
        result[ prop ] = recursiveClone( cloned[ prop ] );
      }
    }
    else result = cloned;

    return result;
  };


  var module = new function () {

    this.inArray = function ( el, array ) {
      var l = array.length;
      while ( l-- ) {
        if ( array[l] == el ) return l;
      }
      return -1;
    };


    this.toRange = function ( n, Min, Max ) {
      return Math.max( Math.min( n, Max ), Min );
    };


    this.rnd = function () {
      return Math.round(Math.random() * 1000);
    };


    this.toInt = function ( val, def ) {
      def = def || 0;
      val = parseInt( val );
      return isFinite( val ) ? val : def;
    };


    this.clone = function ( cloned, recursive ) {
      if ( recursive == undefined ) recursive = true;
      return recursive ? recursiveClone( cloned ) : simpleClone( cloned );
    };


    this.capitalize = function ( text ) {
      return text.charAt(0).toUpperCase() + text.substr(1);
    };


    this.eval_jspath = function ( str, error ) {
      if ( typeof error != "function" ) error = alert;

      var substr = str.substr(1);
      var result;

      switch ( str[0] ) {
        case '@':
          result = {
            value : function ( obj ) {
              var res, s;
              try {
                with ( obj ) {
                  s = 'result = ' + substr;
                  eval(s);
                }
              } catch ( e ) {
                error( e.message + ' -> ' + s );
              }
              return res;
            }
          };
          break;

        case '~':
        default:
          result = jsPath( substr );
          break;

      }

      return result;
    };


    this.inst = function ( obj, cl, def ) {
      return obj instanceof cl ? obj : def || new cl;
    };


    this.two_pos = function ( i ) {
      return i < 10 ? '0' + i : i;
    };


    this.min = function ( array ) {
      var min = array[0];
      var num = 0;
      for ( var a = 1, a_ln = array.length; a < a_ln; a++ ) if ( array[ a ] < min ) {
        min = array[ a ];
        num = a;
      }
      return num;
    };


    this.max = function ( array ) {
      var max = array[0];
      var num = 0;
      for ( var a = 1, a_ln = array.length; a < a_ln; a++ ) if ( array[ a ] > max ) {
        max = array[ a ];
        num = a;
      }
      return num;
    };


    this.substr = function( text, max, def ) {
      return text.length
        ? text.length < max
          ? text
          : text.substr( 0, max-2 ) + '...'
        : def || '(без названия)';
    }
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences,
    namespace   : nameSpace
  } );

})();