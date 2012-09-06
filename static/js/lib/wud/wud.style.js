/*

wud.style

author : Balakirev Andrey <balakirev.andrey@gmail.com>

Модуль для управления внешним видом.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

Добавляет свойства:

String bgi = ''   - фоновая картинка в формате path/to/img.png

String bgc = ''   - цвет фона в любом формате ( #ff0, #23fa54, black, rgb(125,85,35), ... )


* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

Добовляет методы:

void htmlInj    ( String class, String html )   Вставляет html в дочерние узлы элемента $ ( см wud.jquery ), имеющие
                                                css класс class

void set_bgi    ( String url )                  Задает фоновую картинку по url

void set_bgc    ( String bgc )                  Задает фоновый цвет


 */

;( function () {

  var name        = 'wud.style';
  var dependences = [ 'wud.jquery' ];
  var nameSpace   = '';

  var module = new function () {

    this.initVars = function () {
      this.bgi        = '';
      this.bgc        = '';
      this.css_rules  = null;
    };


    this.redefineVars = function ( variable ) {
      switch ( variable ) {
        case 'css_rules':
          break;

        default: return false;
      }

      return true;
    };


    this.init = function () {
      if ( this.bgi ) this.set_bgi( this.bgi );
      if ( this.bgc ) this.set_bgc( this.bgc );
      if ( this.css_rules ) this.css( this.css_rules );
    };

    this.htmlInj = function ( cl, html ) {
      this.$$().find( '.' + cl ).html( html.toString() );
    };


    this.set_bgi = function ( url ) {
      this.$$().css( "background-image", "url("+url+")" );
    };


    this.set_bgc = function ( bgc ) {
      this.$$().css( "background-color", bgc );
    };

    this.css = function () {
      this.$.css.apply( this.$, arguments );
    };

  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences,
    namespace   : nameSpace
  } );

})();



