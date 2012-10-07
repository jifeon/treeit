function Form ( params ) {
  this.init( params );
}


Form.prototype = new Ofio({
  modules : [
    'wud.jquery',
    'wud.visible',
    'ofio.ajax',
    'ofio.event_emitter'
  ],
  className : 'Form'
});


Form.prototype.submit = function(){
  var params = {};

  for ( var i = 0, elements = this.$[0].elements, i_ln = elements.length; i<i_ln; i++ ){
    var el = elements[i];
    if ( el.type != 'checkbox' || el.checked )
      params[ el.name ] = el.value;
  }

  var self = this;
  this.ajax( this.$.attr('action'), params, function( e, result ){
    if ( e ) self.emit( 'error', e );
    else window.location = result;
  } );

  return false;
}


Form.prototype.find = function( name ){
  return this.$.find('[name="' + name + '"]');
}


Form.prototype.focus = function(){
  this.$.find('input').focus();
}