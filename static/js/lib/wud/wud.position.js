/*

wud.position

author : Balakirev Andrey <balakirev.andrey@gmail.com>

Модуль для управления положением на странице элемента интрефейса.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

Добавляет свойства:

Object position    = {
                       x : Number current_left_offset,
                       y : Number current_top_offset
                     }


* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

Добовляет методы:


(g)Number (s)Wud     Top    ( [  (g|s)Number    top,                      - отступ сверху
                                      Bool      animate     = true,       - задать анимированно
                                      Bool      difference  = false,      - прибавить значение к текущему
                                      Function  callback,                 - функция которую сделать после завершения
                                      Number    delay       = 0 ] )       - задержка перед выполнением
Задает или возвращает верхний отступ объекта $.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

(g)Number (s)Wud     Left   ( [  (g|s)Number    left,                     - отступ слева
                                      Bool      animate     = true,       - задать анимированно
                                      Bool      difference  = false,      - прибавить значение к текущему
                                      Function  callback,                 - функция которую сделать после завершения
                                      Number    delay       = 0 ] )       - задержка перед выполнением
Задает или возвращает отступ слева объекта $.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

(g)Number (s)Wud     Bottom ( [  (g|s)Number    bottom,                   - расположение нижней границы
                                      Bool      animate     = true,       - задать анимированно
                                      Bool      difference  = false,      - прибавить значение к текущему
                                      Function  callback,                 - функция которую сделать после завершения
                                      Number    delay       = 0 ] )       - задержка перед выполнением
Задает или возвращает расположение нижней границы объекта $.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

(g)Number (s)Wud     Right  ( [  (g|s)Number    right,                    - расположение правой границы
                                      Bool      animate     = true,       - задать анимированно
                                      Bool      difference  = false,      - прибавить значение к текущему
                                      Function  callback,                 - функция которую сделать после завершения
                                      Number    delay       = 0 ] )       - задержка перед выполнением
Задает или возвращает расположение правой границы объекта $.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

(g)Object (s)Wud     PositionEvent ( [  (g|s)Object    position,          - позиция с координатами мыши
                                          Bool      animate     = true,   - задать анимированно
                                          Bool      difference  = false,  - прибавить значение к текущей
                                          Function  callback,             - функция которую сделать после завершения
                                          Number    delay       = 0 ] )   - задержка перед выполнением
Задает или возвращает позицию объекта $.

объект position описывается как
{
  pageX  : Number left | null,
  pageY  : Number top  | null
}
в таком же виде возвращается позиция


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

(g)Object (s)Wud     Position   ( [  (g|s)Object    position,             - позиция
                                          Bool      animate     = true,   - задать анимированно
                                          Bool      difference  = false,  - прибавить значение к текущей
                                          Function  callback,             - функция которую сделать после завершения
                                          Number    delay       = 0 ] )   - задержка перед выполнением
Задает или возвращает позицию объекта $.

объект position описывается как
{
  x  : Number left | null,
  y  : Number top  | null
}
в таком же виде возвращается позиция


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Wud     quickSetPosition    ( Object position )   - быстрое задание позиции, используется во время драга

position =  {
              x  : Number left | null,
              y  : Number top  | null
            }


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Object  Center              ()                    - возвращает позицию центра объекта в виде
                                                    {
                                                      x  : Number left_of_center,
                                                      y  : Number top_of_center
                                                    }


* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

Triggers

(s)Top, (s)Left, (s)Position, (s)PositionEvent    -> changePosition        ( Object current_position )
(s)Bottom, (s)Right                               -> changeSize            ( Object current_size     )
quickSetPosition                                  -> Wud.quickSetPosition  ( Object position         )

 */
;( function () {

  var name        = 'wud.position';
  var dependences = [
    'wud.animate',
    'ofio.triggers',
    'wud.jquery',
    'ofio.utils'
  ];

  var module = new function () {

    this.initVars = function () {
      this.position = null;

      this.left = {
        inPercent       : false,
        valueInPercent  : 0,
        valueInPx       : 0
      }

      this.top = {
        inPercent       : false,
        valueInPercent  : 0,
        valueInPx       : 0
      }
    };


    this.redefineVars = function ( variable ) {
      switch ( variable ) {
        case 'position':
          if ( !this.$ || !this.$.length ) return false;
          this.position = {
            x : this.$.offset().left,
            y : this.$.offset().top
          };
          break;

        default: return false;
      }

      return true;
    };


    this.init = function () {
      this.Position( this.position, false );
    };


    this.PositionEvent = function ( position, animate, difference, callback, delay ) {
      if ( position == undefined ) {
        position = this.Position();
        return {
          pageX : position.x,
          pageY : position.y
        };
      }
      this.Position( {
        x : position.pageX,
        y : position.pageY
      }, difference, animate, callback, delay );
      return this;
    };


    var setIndent = function( position, side, indent, parentDim, difference ) {
      var result;

      if ( position[ indent ] == null ) result = this[ side ].valueInPx;
      else {
        result = position[ indent ];
        if ( this[ side ].inPercent = ( typeof result == "string" && result.indexOf( '%' ) != -1 ) )
          result = Math.round( parentDim * parseInt( result, 10 ) / 100 );
        else result = this.utils.toInt( result );

        if ( difference ) result += this[ side ].valueInPx;
      }

      return result;
    }


    this.Position = function ( position, animate, difference, callback, delay ) {
      if ( position === undefined ) return this.position;

      var self = this;
      if ( delay = this.utils.toInt( delay ) ) setTimeout( function () {
        self.Position( position, difference, animate, callback, false );
      }, delay );

      var parentWidth   = this.parent.width(),
          parentHeight  = this.parent.height();
      var x = setIndent.call( this, position, 'left', 'x', parentWidth,  difference ),
          y = setIndent.call( this, position, 'top',  'y', parentHeight, difference ),
          l = this.left,
          t = this.top;

      this.runTrigger( 'changePosition', [ position = { x : x, y : y } ] );

      this.position.x = l.valueInPx = position.x;
      this.position.y = t.valueInPx = position.y;

      l.valueInPercent = this.position.x / parentWidth;
      t.valueInPercent = this.position.y / parentHeight;

      x = l.inPercent
        ? Math.round( l.valueInPercent * 100 ) + '%'
        : l.valueInPx + 'px';

      y = t.inPercent
        ? Math.round( t.valueInPercent * 100 ) + '%'
        : t.valueInPx + 'px';

      if ( animate || animate == undefined ) {
        this.animate( { left : x, top : y }, callback );
      } else {
        this.$[0].style.left = x;
        this.$[0].style.top  = y;
        if ( typeof callback == 'function' ) callback.call( this );
      }

      return this;
    };


    this.quickSetPosition = function ( position ) {
      this.runTrigger( 'Wud.quickSetPosition', [ position ] );
      this.$[0].style.left = position.x + "px";
      this.$[0].style.top  = position.y + "px";
      return this;
    };
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();