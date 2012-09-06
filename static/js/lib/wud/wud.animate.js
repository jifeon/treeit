/*

wud.animate

author : Balakirev Andrey <balakirev.andrey@gmail.com>

ћодуль дл€ анимированного изменений свойств объекта.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

ƒобавл€ет свойства:

Number    animationSpeed = 1000        - скорость изменени€ свойста. мс на происхождение полного изменени€


* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

ƒобовл€ет методы:


(g)Number (s)Wud  AnimationSpeed ( [ (g|s)Number  animationSpeed = 1000  ] )


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Wud     animate    (  Object props,  [ Function callback ]  )


Object props                - желаемые css свойства

пример
{
  left  : 200,
  width : 500
}


 */

;( function () {

  var name        = 'wud.animate';
  var dependences = [ 'wud.jquery', 'ofio.utils' ];

  var module = new function () {

    this.initVars = function () {
      this.animationSpeed = 1000;
    };

    this.AnimationSpeed = function ( animationSpeed ) {
      if ( animationSpeed === undefined ) return this.animationSpeed;
      this.animationSpeed = this.utils.toInt( animationSpeed, 1000 );
      return this;
    };

    this.animate = function ( props, callback ) {
      var self = this;
      props = props || {};
      this.$.animate( props, this.animationSpeed, function () {
        if ( typeof callback == 'function' ) callback.call( self );
      } );
      return this;
    };
    
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();