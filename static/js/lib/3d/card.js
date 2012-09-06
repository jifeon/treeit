function Card ( params ) {
  this.init( params );
}


Card.prototype = new Object_3d;


Card.prototype.initVars = function () {
  this.width  = 2;
  this.height = 1;
};


Card.prototype.init = function ( params ) {
  this.constructor.prototype.init.call( this, params );

  this.makePoints();
};


Card.prototype.makePoints = function () {
  this.points.push( new Point3d({ x : -this.width/2, y : -this.height/2, z : 0 }) );
  this.points.push( new Point3d({ x :  this.width/2, y : -this.height/2, z : 0 }) );
  this.points.push( new Point3d({ x :  this.width/2, y :  this.height/2, z : 0 }) );
  this.points.push( new Point3d({ x : -this.width/2, y :  this.height/2, z : 0 }) );
};

