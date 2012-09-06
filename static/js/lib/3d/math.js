( function () {

  var name        = 'math';
  var dependences = [];
  var nameSpace   = 'math';

  var module = new function () {

    this.distance = function ( point1, point2 ) {
      var d = Math.sqrt(
        Math.pow( point1.X() - point2.X(), 2 ) +
        Math.pow( point1.Y() - point2.Y(), 2 ) + 
        Math.pow( point1.Z() - point2.Z(), 2 )
      );

      return ( point1.X() - point2.X() > 0 ) ? d : -d;
    };


    this.findAngle = function ( point1, point2 ) {
      return Math.atan( ( point2.Z() - point1.Z() ) / ( point2.X() - point1.X() ) );
    };

  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences,
    namespace   : nameSpace
  } );

})();