( function () {

  var name        = 'ofio.watches';
  var dependences = [ 'ofio.logger' ];
  var nameSpace   = '';

  var watch = function ( vars ) {
    var self = this;
    for ( var i = 0, i_ln = vars.length; i < i_ln; i++ ) {
      this.watch( vars[i], function ( varName, oldValue, newValue ) {
        self.log( 'ofio.watches для '+varName, 'gb' );
        self.log( 'Переменная %s сменила значение', varName, 'i' );
        self.log( 'Старое значение:' );
        self.log( oldValue, 'dir' );
        self.log( 'Новое значение:' );
        self.log( newValue, 'dir' );
        self.log( 'ge' );
        return newValue;
      } );
    }
  };

  var module = new function () {

    this.initVars = function () {
      this.watches = [];
    };


    this.init = function () {
      watch.call( this, this.watches );
    };

    this.addWatches = function () {
      watch.call( this, arguments );
    };

    this.removeWatches = function () {
      for ( var i = 0, i_ln = arguments.length; i < i_ln; i++ ) {
        var w = arguments[i];
        this.unwatch( w );
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