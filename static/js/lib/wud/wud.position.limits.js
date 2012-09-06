/*

wud.position.limits

author : Balakirev Andrey <balakirev.andrey@gmail.com>

ћодуль дл€ управлени€ предельными положени€ми элемента интрефейса на странице.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

ƒобавл€ет свойства:

Object limits    =  {
                      Number xmin : -Infinity,
                      Number ymin : -Infinity,
                      Number xmax : Infinity,
                      Number ymax : Infinity
                    }


* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

ƒобовл€ет методы:


(g)Object (s)Wud     Limits   ( [ (g|s)Mixed     limits   ] )

limits :

1. Object limits  = {
                      Number xmin : крайн€€ лева€ граница,
                      Number ymin : крайн€€ верхн€€ граница,
                      Number xmax : крайн€€ права€ граница,
                      Number ymax : крайн€€ нижн€€ граница
                    }
¬ такомже формате отдаетс€ объект, когда работает getter


2. Boolean limits === true

в таком же формате как в п 1 отдаютс€ пределы самого объекта


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Wud     noLimits    ()     - убирает пределы


* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

Triggers

(s) Limits                     -> changePosition        ( Object current_position )

применение лимитов             <- changePosition        ( Object current_size     )
применение лимитов             <- Wud.quickSetPosition  ( Object position         )

 */


;( function () {

  var name        = 'wud.position.limits';
  var dependences = [
    'wud.position',
    'ofio.triggers',
    'ofio.utils',
    'wud.size'
  ];


  var applyLimits = function ( position ) {
    position.x = this.utils.toRange(
      position.x,
      this.limits.xmin,
      this.limits.xmax - this.Width()
    );
    position.y = this.utils.toRange(
      position.y,
      this.limits.ymin,
      this.limits.ymax - this.Height()
    );
  };


  var module = new function () {

    this.init = function () {
      this.addFunctionToTrigger( 'changePosition', applyLimits );
      this.addFunctionToTrigger( 'Wud.quickSetPosition', applyLimits );
    };


    this.initVars = function () {
      this.limits = {
        xmin : -Infinity,
        ymin : -Infinity,
        xmax : Infinity,
        ymax : Infinity
      };
    };


    this.Limits = function ( limits ) {
      if ( limits === undefined ) return this.limits;
      if ( limits === true ) return {
        xmin : this.Left(),
        ymin : this.Top(),
        xmax : this.Right(),
        ymax : this.Bottom()
      };
      if ( limits instanceof Object ) this.limits = limits;
      this.Position( this.Position() );
      return this;
    };


    this.noLimits = function () {
      this.limits = {
        xmin : -Infinity,
        ymin : -Infinity,
        xmax : Infinity,
        ymax : Infinity
      };
      return this;
    };

  };


  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();