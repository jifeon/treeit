function Action ( params ) {
  this.init( params );
}


Action.create = 0;
Action.update = 1;
Action.remove = 2;


Action.prototype = new Ofio({
  modules   : [
  ],
  className : 'Action'
});


Action.prototype.initVars = function () {
  this.params     = {};
  this.operation  = null;
  this.obj        = null;
  this.next       = null;
  this.prev       = null;
};


Action.prototype.redefineVars = function ( variable ) {
  switch ( variable ) {
    case 'next':
    case 'prev':
      break;

    default: return false;
  }

  return true;
};


Action.prototype.init = function ( params ) {
  this.constructor.prototype.init.call( this, params );
};



