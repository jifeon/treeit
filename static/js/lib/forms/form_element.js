;( function () {

  var name        = 'form_element';
  var dependences = [
    'wud.jquery',
    'ofio.event_emitter'
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
        self.emit( 'focus' );
      } );

      this.$.blur( function () {
        self.emit( 'blur' );
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