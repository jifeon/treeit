function FormCheckbox ( params ) {
  this.init( params );
}


FormCheckbox.prototype = new Ofio({
  modules   : [
    'form_element.checks'
  ],
  className : 'FormCheckbox'
});


FormCheckbox.prototype.get_value = function () {
  return this.$[0].checked;
};


FormCheckbox.prototype.set_value = function ( val ) {
  this.$[0].checked = val;
};