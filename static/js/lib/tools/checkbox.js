function Checkbox ( params ) {
  this.init( params );
}


Checkbox.prototype = new Ofio({
  modules   : [
    'wud.jquery'
  ],
  className : 'Checkbox'
});


Checkbox.prototype.initVars = function () {
  this.checked = true;
  this.oncheck = function () {};
};


Checkbox.prototype.init = function ( params ) {
  this.constructor.prototype.init.call( this, params );

  this.add_handlers();
};


Checkbox.prototype.add_handlers = function () {
  var self = this;

  this.$.click( function () {
    self.check();
  } );
};


Checkbox.prototype.check = function ( checked ) {
  this.checked = checked == undefined ? !this.checked : Boolean( checked );
  this.oncheck();
};


Checkbox.prototype.is_checked = function () {
  return this.checked;
};