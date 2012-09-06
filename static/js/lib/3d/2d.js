( function () {

  var name        = '2d';
  var dependences = [];
  var nameSpace   = '';

  var module = new function () {

    this.initVars = function () {
      this.x = 0;
      this.y = 0;
    };

    this.X = function ( x ) {
      if ( x === undefined ) return this.x;
      this.x = Number( x );
      return this;
    };


    this.Y = function ( y ) {
      if ( y === undefined ) return this.y;
      this.y = Number( y );
      return this;
    };

  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences,
    namespace   : nameSpace
  } );

})();