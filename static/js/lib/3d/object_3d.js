function Object_3d ( params ) {
  this.init( params );
}


Object_3d.prototype = new Ofio({
  modules : [ 'ofio.triggers' ]
});



Object_3d.prototype.initVars = function () {
  this.points = [];
};


Object_3d.prototype.Points = function () {
  return this.points;
};


Object_3d.prototype.draw = function ( points, ctx ) {
  points = points || this.points;

  ctx.beginPath();

  ctx.moveTo( points[0].X(), points[0].Y() );
  for ( var p = 1, p_ln = points.length; p < p_ln; p++ ) ctx.lineTo( points[p].X(), points[p].Y() );
  ctx.lineTo( points[0].X(), points[0].Y() );

  ctx.stroke();
};