( function () {

  var name        = 'ofio.triggers';
  var dependences = [];

  var globalTriggers = {};

  var module = new function () {

    this.addFunctionToTrigger = function ( triggerName, fun, prev ) {
      prev = prev || false;
      if ( typeof this.triggers == "undefined" ) this.triggers = {};
      if ( typeof fun != "function" ) return false;
      if ( !this.triggers[ triggerName ] ) this.triggers[ triggerName ] = [ fun ];
      else this.triggers[ triggerName ][ prev ? 'unshift' : 'push' ]( fun );
    };

    this.addFunctionToGlobalTrigger = function ( triggerName, fun, prev ) {
      prev = prev || false;
      if ( !globalTriggers[ triggerName ] ) globalTriggers[ triggerName ] = [];
      globalTriggers[ triggerName ][ prev ? 'unshift' : 'push' ]( fun );
    };

    this.runTrigger = function ( triggerName, args ) {
      args = args || [];
      if ( typeof this.triggers == "undefined" ) this.triggers = {};
      if ( this.triggers[ triggerName ] ) {
        var triggers = this.triggers[ triggerName ];
        for ( var t = 0; t < triggers.length; t++ ) {
          triggers[t].apply( triggers[t].namespace || this, args );
        }
      }
      this.runGlobalTrigger( triggerName, args );
    };

    this.runGlobalTrigger = function ( triggerName, args ) {
      var triggers = globalTriggers[ triggerName ];
      if ( !triggers || !triggers.length ) return false;

      if ( !( args instanceof Array ) ) args = [];

      for ( var t = 0, t_ln = triggers.length; t < t_ln; t++ ) {
        var trigger = triggers[ t ];
        trigger.apply( this, args );
      }
    };
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();