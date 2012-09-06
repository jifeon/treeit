function Form ( params ) {
  this.init( params );
}


Form.prototype = new Ofio({
  modules : [
    'wud.jquery',
    'wud.visible',
    'ofio.triggers'
  ],
  className : 'Form'
});



Form.prototype.initVars = function () {
  this.elements           = {};
  this.validate_warnings  = [];
  this.name               = 'form';
  this.submit_button      = null;
  this.on_validate        = function () { return [] };
};


Form.prototype.init = function ( params ) {
  this.constructor.prototype.init.call( this, params );

  this.add_handlers();
  this.set_names();
};


Form.prototype.add_handlers = function () {
  var self = this;

  this.submit_button.click( function () {
    self.submit();
  } );

  this.$.find('input').keyup(function ( e ) {
    if ( e.keyCode == 13 ) self.submit();
  });

  this.$[0].onsubmit = function () {
    return false;
  }
};


Form.prototype.set_names = function () {
  for ( var element in this.elements ) {
    if ( this.elements[ element ].$ )
      this.elements[ element ].$.attr( 'name', this.name + '[' + element + ']' );
  }
};


Form.prototype.submit = function () {
  var messages = this.validate();
  if ( typeof this.on_validate == 'function' ) Array.prototype.push.apply( messages, this.on_validate.call( this ) );
  if ( messages.length ) this.runTrigger( 'Form.submit.has_messages', [ messages ] );
  else this.$[0].submit();
};


Form.prototype.validate = function () {
  var messages = [];

  for ( var element in this.elements ) {
    Array.prototype.push.apply( messages, this.elements[ element ].validate() );
  }

  return messages;
};


Form.prototype.focus = function () {
  for ( var e in this.elements ) {
    if ( this.elements[e].$ ) this.elements[e].$.focus();
    break;
  }
};


Form.prototype.get_value = function ( element_name ) {
  return this.elements[ element_name ] ? this.elements[ element_name ].get_value() : '';
};


Form.prototype.set_value = function ( element_name, value ) {
  if ( this.elements[ element_name ] ) this.elements[ element_name ].set_value( value );
};