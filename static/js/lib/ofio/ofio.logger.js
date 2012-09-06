( function () {

  var name        = 'ofio.logger';
  var dependences = [];

  var showLog     = false;

  var module = new function () {

    this.init = function () {
      if ( typeof console == 'undefined' ) {
        var console_alert = function () {
          //alert( arguments );
        }

        console = {
          error : console_alert,
          log   : console_alert,
          info  : console_alert,
          warn  : console_alert,
          trace : function () {},
          group : function () {},
          groupEnd : function () {}
        };
      }
    }

    this.log = function () {
      if ( !showLog ) return false;

      var mess = [], type;
      for ( var i = 0, i_ln = arguments.length; i < i_ln; i++ ) {
        var arg = arguments[i];
        if ( i == arguments.length - 1 ) type = arg;
        else mess.push( arg );
      }

      switch ( type ) {
        case 'e':
          console.error.apply( console, mess );
          break;

        case 'w':
          console.warn.apply( console, mess );
          console.trace();
          break;

        case 'dir':
          if ( mess.length && mess[0] instanceof Object ) console.dir.apply( console, mess );
          else console.log.apply( console, mess );
          break;

        case 'i':
          console.info.apply( console, mess );
          break;

        case 'l':
          console.log.apply( console, mess );
          break;

        case 'gb':
          console.group.apply( console, mess );
          break;

        case 'ge':
          console.groupEnd();
          break;

        default:
          console.log.apply( console, arguments );
          break;

      }

    };

    this.runLog = function () {
      showLog = true;
    };

    this.stopLog = function () {
      showLog = false;
    };

  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();
