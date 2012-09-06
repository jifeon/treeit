function Cub ( params ) {
  this.init( params );
}


Cub.prototype = new Object_3d;


Cub.prototype.initVars = function () {
  this.width  = 1;
  this.height = 1;
  this.deep   = 1;
};


Cub.prototype.init = function ( params ) {
  this.constructor.prototype.init.call( this, params );

  this.makePoints();
};


Cub.prototype.makePoints = function () {
  this.points.push( new Point3d({ x : -this.width/2, y : -this.height/2, z : -this.deep/2 }) );
  this.points.push( new Point3d({ x :  this.width/2, y : -this.height/2, z : -this.deep/2 }) );
  this.points.push( new Point3d({ x :  this.width/2, y :  this.height/2, z : -this.deep/2 }) );
  this.points.push( new Point3d({ x : -this.width/2, y :  this.height/2, z : -this.deep/2 }) );

  this.points.push( new Point3d({ x : -this.width/2, y : -this.height/2, z : this.deep/2 }) );
  this.points.push( new Point3d({ x :  this.width/2, y : -this.height/2, z : this.deep/2 }) );
  this.points.push( new Point3d({ x :  this.width/2, y :  this.height/2, z : this.deep/2 }) );
  this.points.push( new Point3d({ x : -this.width/2, y :  this.height/2, z : this.deep/2 }) );
};


Object_3d.prototype.draw = function ( points, ctx ) {
  points = points || this.points;

  ctx.beginPath();

  ctx.moveTo( points[0].X(), points[0].Y() );
  for ( var p = 1, p_ln = 4; p < p_ln; p++ ) ctx.lineTo( points[p].X(), points[p].Y() );
  ctx.lineTo( points[0].X(), points[0].Y() );

  ctx.moveTo( points[4].X(), points[4].Y() );
  for ( p = 5, p_ln = 8; p < p_ln; p++ ) ctx.lineTo( points[p].X(), points[p].Y() );
  ctx.lineTo( points[4].X(), points[4].Y() );
  
  for ( p = 0; p < points.length/2; p++ ) {
	ctx.moveTo( points[p].X(), points[p].Y() );
	ctx.lineTo( points[p+4].X(), points[p+4].Y() );
  }
  
  ctx.stroke();
};

