;( function () {

  var name        = 'form_element';
  var dependences = [
    'wud.jquery',
    'ofio.triggers'
  ];

  var module = new function () {

    this.initVars = function () {
      this.name   = '';
    };


    this.init = function () {
      this.add_triggers();
    };


    this.add_triggers = function () {
      var self = this;

      this.$.focus( function () {
        self.runTrigger( 'form_element.focus' );
      } );

      this.$.blur( function () {
        self.runTrigger( 'form_element.blur' );
      } );
    };


    this.get_value = function () {
      return null;
    };


    this.set_value = function( val ) {
      this.$.val( val );
    }
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();