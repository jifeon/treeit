( function () {

  var name        = 'ofio.id';
  var dependences = [];
  var nameSpace   = '';

  var id = 0;

  var module = new function () {

    this.initVars = function () {
      this.id = id++;
    };

    
    this.Id = function () {
      return this.id;
    };


    this.eq = function ( instance ) {
      return Boolean( instance ) && this.id == instance.id;
    };

  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences,
    namespace   : nameSpace
  } );

})();