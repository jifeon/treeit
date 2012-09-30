( function () {

  var name        = 'ofio.event_emitter';
  var dependences = [];

  var listeners_by_id   = {};
  var id                = 0;

  function Listener( listener, context ) {
    this.listener = listener;
    this.context  = context;
  }

  Listener.prototype.fire = function( args, context ) {
    this.listener.context = context;
    this.listener.apply( this.context || context, args );
  };
  
  var module = new function () {

    this.on = function ( event, listener, context ) {
      var listeners;

      if ( !this.__listeners )             this.__listeners = {};
      if ( typeof listener != "function" ) return new Error( 'Second argument must be function' );

      if ( !this.__listeners[ event ] ) this.__listeners[ event ] = listeners = {};
      else listeners = this.__listeners[ event ];

      listeners[ id ]         = new Listener( listener, context );
      listeners_by_id[ id ]   = listeners;

      return id++;
    };


    this.emit = function ( event ) {
      var args = Array.prototype.slice.call( arguments, 1 );

      if ( !this.__listeners ) this.__listeners = {};

      if ( this.__listeners[ event ] ) {
        var listeners = this.__listeners[ event ];
        for ( var id in listeners ) {
          var listener = listeners[ id ];

          listener.fire( args, this );
        }
      }

      args.unshift( event, this );

      var extend = this;
      while ( extend ) {
        if ( !extend.emit ) break;
        extend.__constructor.emit.apply( extend.__constructor, args );
        extend = extend.extend;
      }
    };


    this.remove_listener = function( id ) {
      var listeners = listeners_by_id[ id ];
      if ( !listeners ) return false;

      delete listeners[ id ];
    };
  };
  

  var class_on = function( event, listener, context ) {
    var listeners;

    if ( !this.listeners[ event ] ) this.listeners[ event ] = listeners = {};
    else listeners = this.listeners[ event ];

    listeners[ id ]       = new Listener( listener, context );
    listeners_by_id[ id ] = listeners;

    return id++;
  };


  var class_emit = function( event, context ) {
    var listeners = this.listeners[ event ];
    if ( !listeners ) return false;

    var args = Array.prototype.slice.call( arguments, 2 );

    for ( var id in listeners ) {
      listeners[ id ].fire( args, context || this );
    }
  };


  var on_include = function( clazz ) {
    clazz.listeners = {};

    clazz.on        = class_on;
    clazz.emit      = class_emit;
  };


  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences,
    onInclude   : on_include
  } );

})();