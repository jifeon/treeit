;( function () {

  var name        = 'wud.position.ex';
  var dependences = [
    'wud.position',
    'wud.size'
  ];

  var module = new function () {
    this.Top = function ( top, animate, difference, callback, delay ) {
      if ( top === undefined ) return this.top.valueInPx;
      this.Position({
        x : null,
        y : top
      }, animate, difference, callback, delay );
      return this;
    };


    this.Left = function ( left, animate, difference, callback, delay ) {
      if ( left === undefined ) return this.Position().x;
      this.Position({
        x : left,
        y : null
      }, animate, difference, callback, delay );
      return this;
    };


    this.Bottom = function ( bottom, animate, difference, callback, delay ) {
      var top = this.Top();
      if ( bottom == undefined ) return top + this.Height();
      bottom = this.utils.toInt( bottom, top );
      if ( difference ) bottom += this.Bottom();
      if ( bottom < this.Top() ) bottom = top;
      return this.Height( bottom - top, animate, false, callback, delay );
    };


    this.Right = function ( right, animate, difference, callback, delay ) {
      var left = this.Left();
      if ( right == undefined ) return left + this.Width();
      right = this.utils.toInt( right, left );
      if ( difference ) right += this.Right();
      if ( right < this.Left() ) right = left;
      return this.Width( right - left, animate, false, callback, delay );
    };


    this.Center = function () {
      return {
        x : this.Left() + this.Width() / 2,
        y : this.Top() + this.Height() / 2
      };
    };
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();