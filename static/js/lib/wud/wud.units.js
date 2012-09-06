/*

wud.units

состояние : в разработке

модуль предназначенный для управления единицами измерения. 

 */

;( function () {

  var name        = 'wud.units';
  var dependences = [];

  var module = new function () {

    this.initVars = function () {
      this.units = 'px';
    };

    this.Units = function ( units ) {
      switch ( units ) {

        case '%':
        case 'px':
          this.units = units;
          break;

      
        default:
          return this.units;
          break;

      }
      return this;
    };

  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();