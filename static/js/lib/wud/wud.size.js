/*

wud.size

author : Balakirev Andrey <balakirev.andrey@gmail.com>

������ ��� ���������� ��������� �������� ����������.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

��������� ��������:

Number width      = 0           - ������ �������

Number minWidth   = 0           - ����������� ������ �������

Number maxWidth   = Infinity    - ������������ ������ �������

Number height     = 0           - ������ �������

Number minHeight  = 0           - ����������� ������ �������

Number maxHeight  = Infinity    - ������������ ������ �������

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

��������� ������:

(g)Number (s)Wud     Width  ( [  (g|s)Number    width,                    - ������
                                      Bool      animate     = true,       - ������ ������������
                                      Bool      difference  = false,      - ��������� �������� � �������
                                      Function  callback,                 - ������� ������� ������� ����� ����������
                                      Number    delay       = 0 ] )       - �������� ����� �����������
������ ��� ���������� ������ ������� $.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

(g)Number (s)Wud     Height ( [  (g|s)Number    height,                   - ������
                                      Bool      animate     = true,       - ������ ������������
                                      Bool      difference  = false,      - ��������� �������� � �������
                                      Function  callback,                 - ������� ������� ������� ����� ����������
                                      Number    delay       = 0 ] )       - �������� ����� �����������
������ ��� ���������� ������ ������� $.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

(g)Object (s)Wud     Size   ( [  (g|s)Object    size,                     - �������
                                      Bool      animate     = true,       - ������ ������������
                                      Bool      difference  = false,      - ��������� �������� � �������
                                      Function  callback,                 - ������� ������� ������� ����� ����������
                                      Number    delay       = 0 ] )       - �������� ����� �����������
������ ��� ���������� ������� ������� $.

������ size ����������� ���
{
  width   : Number width  | null,
  height  : Number height | null
}
� ����� �� ���� ������������ ������

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

G|S

MinWidth            ����������� ������

MinHeight           ����������� ������

MaxWidth            ������������ ������

MaxHeight           ������������ ������

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

 */

;( function () {

  var name        = 'wud.size';
  var dependences = [ 'wud.animate', 'ofio.utils', 'ofio.event_emitter' ];

  var module = new function () {

    this.initVars = function () {
      this.width  = null;
      this.height = null;

      this._width            = {
        inPercent       : false,
        valueInPercent  : 0,
        valueInPx       : 0,
        min             : -Infinity,
        max             : Infinity
      };

      this._height            = {
        inPercent       : false,
        valueInPercent  : 0,
        valueInPx       : 0,
        min             : -Infinity,
        max             : Infinity
      };
    };


    this.redefineVars = function ( variable ) {
      switch ( variable ) {
        case 'width':
        case 'height':
          if ( !this.$ || !this.$.length ) return false;
          if ( !this.$.parent().parent().length ) {
            this.$.appendTo( this.parent );
            this.parentFromParams = false;
          }
          this[ variable ] = this.$[ variable ]();
          break;

        default: return false;
      }

      return true;
    };


    this.init = function () {
      this.Size({
        width   : this.width,
        height  : this.height
      }, false );
    };


    this.Width = function ( width, animate, difference, callback, delay ) {
      if ( width === undefined ) return this.width;
      this.Size({
        width  : width,
        height : null
      }, animate, difference, callback, delay );
      return this;
    };


    this.Height = function ( height, animate, difference, callback, delay ) {
      if ( height === undefined ) return this.height;
      this.Size({
        width  : null,
        height : height
      }, animate, difference, callback, delay );
      return this;
    };


    this.Size = function ( size, animate, difference, callback, delay ) {
      if ( size === undefined ) return {
        width  : this.width,
        height : this.height
      };

      var self = this;
      if ( isFinite( delay = parseInt( delay ) ) && delay ) return setTimeout( function () {
        self.Size( size, difference, animate, callback, false );
      }, delay );

      var changedParametrs = [];
      var parentWidth   = this.parent.width(),
          parentHeight  = this.parent.height();
      var width         = setDimension.call( this, size, 'width',  parentWidth,  changedParametrs, difference ),
          height        = setDimension.call( this, size, 'height', parentHeight, changedParametrs, difference );
      var w             = this._width,
          h             = this._height;

      this.emit( 'wud.size.Size', size = { width : width, height : height }, changedParametrs );

      this.width  = w.valueInPx  = size.width;
      this.height = h.valueInPx  = size.height;

      w.valueInPercent = this.width  / parentWidth;
      h.valueInPercent = this.height / parentHeight;

      width = w.inPercent
        ? Math.round( w.valueInPercent * 100 ) + '%'
        : w.valueInPx + 'px';

      height = h.inPercent
        ? Math.round( h.valueInPercent * 100 ) + '%'
        : h.valueInPx + 'px';

      if ( animate || animate == undefined ) {
        this.animate( { width : width, height : height }, callback );
      } else {
        this.$[0].style.width  = width;
        this.$[0].style.height = height;
        if ( typeof callback == 'function' ) callback.call( this );
      }

      return this;
    };


    this.MinWidth = function ( minWidth ) {
      if ( minWidth === undefined ) return this._width.min;
      this._width.min = Math.min( this.utils.toInt( minWidth ), this._width.max );
      return this;
    };


    this.MinHeight = function ( minHeight ) {
      if ( minHeight === undefined ) return this._height.min;
      this._height.min = Math.min( this.utils.toInt( minHeight ), this._height.max );
      return this;
    };


    this.MaxWidth = function ( maxWidth ) {
      if ( maxWidth === undefined ) return this._width.max;
      this._width.max = Math.max( this.utils.toInt( maxWidth ), this._width.min );
      return this;
    };


    this.MaxHeight = function ( maxHeight ) {
      if ( maxHeight === undefined ) return this._height.max;
      this._height.max = Math.max( this.utils.toInt( maxHeight ), this._height.min );
      return this;
    };


    this.updateSize = function () {
      this.Size({
        width  : this._width.inPercent  ? this._width.valueInPercent * 100 + '%' : this._width.valueInPx,
        height : this._height.inPercent  ? this._height.valueInPercent * 100 + '%' : this._height.valueInPx
      }, false );
    }

  };

  var setDimension = function ( size, dim, parentDim, changedParametrs, difference ) {
    var result,
        dimParams = this[ '_'+dim ];

    if ( size[ dim ] == null ) {
      result = dimParams.valueInPx;
    } else {
      result = size[ dim ];

      if ( dimParams.inPercent = ( typeof result == 'string' && result.substr(-1) == '%' ) )
        result = Math.round( parentDim * parseInt( result, 10 ) / 100 );
      else result = this.utils.toInt( result );

      if ( difference ) result += dimParams.valueInPx;
      result = this.utils.toRange( result, dimParams.min, dimParams.max );
      changedParametrs.push( dim );
    }

    return result;
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();