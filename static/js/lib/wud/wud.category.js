/*

wud.category

author : Balakirev Andrey <balakirev.andrey@gmail.com>

Модуль позволяющий задавать объектам категории произвольного типа, а также предоставляющий методы для работы с
категориями.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

Добавляет свойства:

Object category = {};


* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

Добовляет методы:


Object  Category            ()                      - возвращает категорию целиком

void    setCategoryOptions  ( Object options )      - добовляет опции к категории

Boolean inOneCategory       ( Wud wud, String jsp ) - проверяет совпадение категорий у текущего объекта и wud по
                                                      заданному jsPath выраженю jsp

 */

;( function () {

  var name        = 'wud.category';
  var dependences = [];
  var nameSpace   = '';

  var module = new function () {

    this.initVars = function () {
      this.category = {};
    };

    this.init = function () {
      this.category.jsp = function ( jsp ) {
        return jsPath( jsp, this ).value();
      };
    };

    this.setCategoryOptions = function ( options ) {
      if ( !( options instanceof Object ) ) return false;
      for ( var o in options ) {
        this.category[o] = options[o];
      }
    };

    this.inOneCategory = function ( wud, jsp ) {
      return this.Category().jsp( jsp ) == wud.Category().jsp( jsp );
    };

    this.Category = function () {
      return this.category;
    };

  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences,
    namespace   : nameSpace
  } );

})();