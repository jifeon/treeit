function Point3d ( params ) {
  this.init( params );
}


Point3d.prototype = new Ofio({
  modules : [ '2d', '3d' ]
});


Point3d.prototype.clone = function () {
  return new Point3d({
    x : this.x,
    y : this.y,
    z : this.z
  });
};
