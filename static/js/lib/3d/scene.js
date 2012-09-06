function Scene ( params ) {
  this.init( params );
}


Scene.prototype = new Ofio({
  modules : [ 'wud.jquery', 'wud.size', 'ofio.triggers', 'math' ]
});



Scene.prototype.initVars = function () {
  this.canvas   = null;
  this.ctx      = null;
  this.objects  = [];

  this.angle  = 0;
  this.scale  = 100;
  this.center = new Point3d;
};


Scene.prototype.addObject = function ( obj ) {
  this.objects.push( obj );
  this.redraw();
};


Scene.prototype.redefineVars = function ( variable ) {
  switch ( variable ) {
    case 'canvas':
      this.canvas = $('canvas');
      break;


    case 'ctx':
      if ( !this.canvas || !this.canvas.length ) return false;
      this.ctx = this.canvas[0].getContext('2d');
      break;

    default: return false;
  }

  return true;
};


Scene.prototype.Angle = function ( angle ) {
  if ( angle === undefined ) return this.angle;
  this.angle = Number( angle );
  return this;
};


Scene.prototype.init = function ( params ) {
  this.constructor.prototype.init.call( this, params );

  this.initCanvas();
};


Scene.prototype.initCanvas = function ( ) {
  this.canvas.attr( 'width', this.Width() );
  this.canvas.attr( 'height', this.Height() );
};


Scene.prototype.redraw = function () {
  this.empty();
  
  for ( var o = 0, o_ln = this.objects.length; o < o_ln; o++ ) {
    var object = this.objects[o];
    var points = object.Points();
    points = this.modifPoints( points );
    object.draw( points, this.ctx );
  }
};


Scene.prototype.empty = function () {
  this.ctx.clearRect( 0, 0, this.Width(), this.Height() );
};


Scene.prototype.modifPoints = function ( points ) {
  var newPoints = [];

  for ( var p = 0, p_ln = points.length; p < p_ln; p++ ) {
    var point = points[p].clone();
    this.rotate( point );
    this.resize( point );
    point2d = this.to2d( point );
	this.centrize( point2d );
    newPoints.push( point2d );
  }

  return newPoints;
};


Scene.prototype.centrize = function ( point ) {
  point.X( point.X() + this.width/2 );
  point.Y( point.Y() + this.height/2 );
};


Scene.prototype.rotate = function ( point ) {
  var l = this.math.distance( point, this.center );
  var startAngle = this.math.findAngle( point, this.center );

  var x = Math.cos( this.angle + startAngle );
  var z = Math.sin( this.angle + startAngle );

  point.X( l * x );
  point.Z( l * z );
};


Scene.prototype.resize = function ( point ) {
  point.X( point.X() * this.scale );
  point.Y( point.Y() * this.scale );
};


Scene.prototype.to2d = function ( point ) {
  return new Point2d({
    x : point.X() * Math.pow( Math.sqrt(2), point.Z() ),
    y : point.Y() * Math.pow( Math.sqrt(2), point.Z() )
  });
};


Scene.prototype.Scale = function ( scale ) {
  if ( scale === undefined ) return this.scale;
  this.scale = Number( scale );
  return this;
};
