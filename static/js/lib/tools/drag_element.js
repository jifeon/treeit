function DragElement ( params ) {
  this.init( params );
}


DragElement.prototype = new Ofio({
  modules   : [
    'wud.dragndrop',
    'wud.visible'
  ],
  className : 'DragElement'
});


DragElement.prototype.start_drag = function ( e ) {
  this.show();
  this.PositionEvent( e );
  this.Position( {
    x : 10,
    y : -25
  }, false, true );
  this.__ofio.modules[ 'wud.dragndrop' ].call( this, 'start_drag', [ e ] );
};


DragElement.prototype.stop_drag = function () {
  this.hide();
};
