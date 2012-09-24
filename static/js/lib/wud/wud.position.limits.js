/*

wud.position.limits

author : Balakirev Andrey <balakirev.andrey@gmail.com>

������ ��� ���������� ����������� ����������� �������� ���������� �� ��������.

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

��������� ��������:

Object limits    =  {
                      Number xmin : -Infinity,
                      Number ymin : -Infinity,
                      Number xmax : Infinity,
                      Number ymax : Infinity
                    }


* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

��������� ������:


(g)Object (s)Wud     Limits   ( [ (g|s)Mixed     limits   ] )

limits :

1. Object limits  = {
                      Number xmin : ������� ����� �������,
                      Number ymin : ������� ������� �������,
                      Number xmax : ������� ������ �������,
                      Number ymax : ������� ������ �������
                    }
� ������� ������� �������� ������, ����� �������� getter


2. Boolean limits === true

� ����� �� ������� ��� � � 1 �������� ������� ������ �������


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Wud     noLimits    ()     - ������� �������


* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

Triggers

(s) Limits                     -> changePosition        ( Object current_position )

���������� �������             <- changePosition        ( Object current_size     )
���������� �������             <- quickSetPosition  ( Object position         )

 */


;( function () {

  var name        = 'wud.position.limits';
  var dependences = [
    'wud.position',
    'ofio.event_emitter',
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
      this.on( 'changePosition', applyLimits );
      this.on( 'quickSetPosition', applyLimits );
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