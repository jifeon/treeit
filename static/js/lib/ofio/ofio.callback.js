( function () {

  var name        = 'ofio.callback';
  var dependences = [];
  var nameSpace   = '';

  var callbacks   = [];

  var module = new function () {

    this.createCallback = function ( fun, context, args ) {
      var callback_id = callbacks.push( function ( fun_args ) {
        fun.apply( context, args || fun_args || [] );
      } );
      return callback_id - 1;
    };

    this.runCallback = function ( callback_id, args, not_destroy ) {
//      console.log( 'call ' + callback_id );
      not_destroy = not_destroy || false;
      var callback = callbacks[ callback_id ];
      if ( typeof callback != 'function' ) return false;
      callback( args );
      if ( !not_destroy ) delete callbacks[ callback_id ];
    };

  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences,
    namespace   : nameSpace
  } );

})();