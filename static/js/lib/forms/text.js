function Text ( params ) {
  this.init( params );
}


Text.prototype = new Ofio({
  modules : [
    'form_element.checks'
  ],
  className : 'Text'
});


Text.prototype.initVars = function () {
  this.trim = true;
};


Text.prototype.init = function ( params ) {
  this.constructor.prototype.init.call( this, params );
};


Text.prototype.get_value = function () {
 return this.trim ? this.$.val().replace( /^\s+|\s+$/g, '' ) : this.$.val();
};