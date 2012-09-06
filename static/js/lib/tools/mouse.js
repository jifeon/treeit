function Mouse ( params ) {
  this.init( params );
}


Mouse.prototype = new Ofio( {
  modules : [
    'wud.position',
    'wud.style',
    'ofio.search',
    'ofio.utils',
    'ofio.callback'
  ],
  className : 'Mouse'
} );


Mouse.prototype.initVars = function () {
  this.watches = [ 'group' ];
  this.busy         = false;
  this.actionsStack = [];
  this.currentWud   = false;
};


Mouse.prototype.pos = function () {
  var pos = this.Position();
  return {
    pageX : pos.x,
    pageY : pos.y
  };
};


Mouse.prototype.down = function ( wud ) { // todo : may be optimized
  if ( !this.checkBusy( 'down', arguments ) ) return false;

  if ( wud ) {
    this.currentWud = wud;
  } else {
    var range = this.utils.toInt( this.indexBy['Left()'].range, 1 );

    var wuds = this.search_intersection({
      'Top()'     : { val : this.Top()    / range, direct : 'left' },
      'Left()'    : { val : this.Left()   / range, direct : 'left' },
      'Bottom()'  : { val : this.Bottom() / range, direct : 'right' },
      'Right()'   : { val : this.Right()  / range, direct : 'right' }
    }, 'similar' );

    for ( var id in wuds ) {
      this.currentWud = wuds[ id ];
      break;
    }
  }

  this.currentWud.set_bgc( 'yellow' );

  this.runStack();
};


Mouse.prototype.move = function ( position, animate, difference, delay ) {
  if ( !this.checkBusy( 'move', arguments ) ) return false;
  if ( this.currentWud ) {
    this.currentWud.Position( {
      x : position.x - this.Left(),
      y : position.y - this.Top()
    }, true, true, null, delay );
  }

  this.Position( position, animate, difference, this.runStack, delay );
};


Mouse.prototype.up = function () {
  if ( !this.checkBusy( 'up', arguments ) ) return false;

  this.currentWud.set_bgc( 'red' );
  this.currentWud = null;

  this.runStack();
};


Mouse.prototype.action = function ( cb, context ) {
  if ( !this.checkBusy( 'action', arguments ) ) return false;
  this.runCallback( cb );
  this.runStack();
};


Mouse.prototype.checkBusy = function ( action, params ) {
  if ( this.busy ) {
    this.actionsStack.push({
      params : params,
      action : action
    });
    return false;
  }
  this.busy = true;
  return true;
};


Mouse.prototype.runStack = function () {
  var action = this.actionsStack.shift();
  if ( !action ) return false;
  this.busy = false;
  this[ action.action ].apply( this, action.params );
};