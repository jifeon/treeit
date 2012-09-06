;( function () {

  var name        = 'jquery.api.stub';
  var dependences = [
    'wud.jquery'
  ];

  var module = new function () {

    this.click = function( fun ) {
      this.$.click( fun );
    }

    this.focus = function( fun ) {
      this.$.focus( fun );
    }

    this.blur = function( fun ) {
      this.$.blur( fun );
    }
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();