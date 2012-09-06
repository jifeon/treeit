$(document).ready( function () {

  scene = new Scene({
    width   : 400,
    height  : 300,
    $       : $('#scene'),
    angle   : 0,
    scale   : 50
  });
  //var card  = new Card();

  var cub = new Cub;
  scene.addObject( cub );

//  rotate = function () {
//
//  };

  var alpha = 0;

  var i = setInterval( function () {
    scene.Angle( alpha += Math.PI/36 ).redraw();
	if ( alpha > Math.PI ) {
		//scene.Angle( Math.PI ).redraw();
		//clearTimeout( i );
	}
  }, 20 );

} );