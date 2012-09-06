( function () {

  var name        = 'wud.handlers';
  var dependences = [ 'wud.jquery' ];
  var nameSpace   = '';

  var module = new function () {

    this.initVars = function () {
      this.toggle = [];
      this.click  = null;
    };


    this.redefineVars = function ( variable ) {
      switch ( variable ) {
        case 'click':
          break;

        default: return false;
      }

      return true;
    };


    this.initHandlers = function () {
      var self = this;

      if ( this.toggle.length == 2 ) this.$.toggle.apply( this.$,  this.toggle );
      if ( typeof this.click == "function" ) this.$.click( function () {
        self.click();
      } );
    };

    /*
      this.setHandlers([
        [ obj, 'click',     this.fun1 ],
        [ obj, 'mousedown', this.fun2 ]
      ]);
     */
    this.setHandlers = function ( handlers, parent ) {
      parent = parent || this.$;
      var self = this;
      if ( !( parent instanceof $ ) ) return false;
      for ( var i = 0, i_ln = handlers.length; i < i_ln; i++ ) {
        var handlerDescription = handlers[i];

        var obj       = handlerDescription[0];
        var action    = handlerDescription[1];
        var fun       = handlerDescription[2];
        var tmpParent = handlerDescription[3];

        if ( !( tmpParent instanceof $ )  ) tmpParent = parent;
        if ( typeof obj     == "string"   ) obj       = parent.find( obj );
        if ( !( obj       instanceof $ )  ) continue;

        if ( typeof action  != "string"   ) continue;
        if ( typeof fun     != "function" ) continue;

        obj.bind( action, function ( e ) {
          fun.call( self, e );
        } );
      }
    };

  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences,
    namespace   : nameSpace
  } );

})();