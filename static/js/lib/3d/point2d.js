function Point2d ( params ) {
  this.init( params );
}


Point2d.prototype = new Ofio({
  modules : [ '2d' ]
});


Point2d.prototype.clone = function () {
  return new Point2d({
    x : this.x,
    y : this.y
  });
};
