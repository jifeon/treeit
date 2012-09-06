( function () {

  var name        = '3d';
  var dependences = [];
  var nameSpace   = '';

  var module = new function () {

    this.initVars = function () {
      this.z = 0;
    };


    this.Z = function ( z ) {
      if ( z === undefined ) return this.z;
      this.z = Number( z );
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