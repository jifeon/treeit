/*

wud.position.conserning

author : Balakirev Andrey <balakirev.andrey@gmail.com>

ћодуль дл€ сравнени€ позиции одного элемента, относительно другого

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

ƒобовл€ет методы:


Boolean     concernePosition   ( Mixed comparision,   Wud wud,   [ Boolean ignoreSizes = false ] )

String    comparision     - может принимать значение€ above        проверка на то что текуща€ плашка находитс€ выше
                                                      below        ниже
                                                      moreleft     левее
                                                      moreright    правее
                                                      intersect    пересекаетс€ с wud
                                                      include      или включает в себ€ wud

Array     comparision     - сравнение по нескольким параметрам из списка выше. ¬ернетс€ конъюнкци€ всех сравнений.

Wud       wud             - елемент с позицией которого идет сравнение

Boolean   ignoreSize      - нужно ли учитывать высоту и ширину объектов при сравнении дл€ above, below, moreleft
                            и moreright

 */


;( function () {

  var name        = 'wud.position.conserning';
  var dependences = [];
  var nameSpace   = '';

  var module = new function () {

    this.concernePosition = function ( comparision, wud, ignoreSizes ) {
      if ( comparision == undefined || wud == undefined ) return false;
      if ( !(wud instanceof this.constructor )  ) return false;
      if ( !(comparision instanceof Array )  )    comparision = [comparision];
      ignoreSizes = ignoreSizes || false;
      if ( !( ignoreSizes instanceof Array )  ) ignoreSizes = [ ignoreSizes ];

      for ( var c in comparision ) {
        switch ( comparision[c] ) {
          case 'above':
            if ( this.Top() + ( ignoreSizes[c] ? 0 : this.Height() ) > wud.Top() ) return false;
            break;

          case 'below':
            if ( this.Top() < wud.Top() + ( ignoreSizes[c] ? 0 : wud.Height() ) ) return false;
            break;

          case 'moreleft':
            if ( this.Left() + ( ignoreSizes[c] ? 0 : this.Width() ) > wud.Left() ) return false;
            break;

          case 'moreright':
            if ( this.Left() < wud.Left() + ( ignoreSizes[c] ? 0 : wud.Width() ) ) return false;
            break;

          case 'intersect':
            if (
              this.concernePosition( 'above',     wud) ||
              this.concernePosition( 'below',     wud) ||
              this.concernePosition( 'moreleft',  wud) ||
              this.concernePosition( 'moreright', wud)
            ) return false;
            break;

          case 'include':
            var i = this.concernePosition( [ 'above', 'moreleft' ], wud, [true, true] );
            var b = this.Bottom() > wud.Bottom();
            var r = this.Right() > wud.Right();
            i = i && b && r;
            if (!i) return false;
            break;
        }
      }

      return true;
    };
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences,
    namespace   : nameSpace
  } );

})();