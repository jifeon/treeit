/*

wud.jquery

author : Balakirev Andrey <balakirev.andrey@gmail.com>

������ ��� ���������� � ������ ������ �������� jQuery

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

��������� ��������:

jQuery          $                     - ���� ������� �� �����, �� ��������� ��� � ����������� � parent ���
                                        document.body

jQuery          parent                - ���� �������� �����, �� ����� ����������� $
                                        ���� �������� �� �����, �� �� ����� ������� ��� �������� $


* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

��������� ������:


(g)jQuery (s)Wud     $$    ( [  (g|s)jQuery    $  ] )
������ ��� ���������� jQuery ������� $.


 */

;( function () {

  var name        = 'wud.jquery';
  var dependences = [];

  var module = new function () {

    this.initVars = function () {
      this.$                = null;
      this.parent           = null;
      this.parentFromParams = true;
    };

    this.redefineVars = function ( variable ) {
      switch ( variable ) {

        case '$':
          this.$ = $("<div></div>").appendTo( this.parent ? this.parent : $('body') );
          return true;


        case 'parent':
          if ( !this.$ ) return false;
          this.parent = this.$.parent();
          this.parentFromParams = false;
          return true;

      }

      return false;
    };


    this.init = function () {
      if ( this.parentFromParams ) {
        this.parent.append( this.$ );
      }
      delete this.parentFromParams;
    };


    this.$$ = function ( $ ) {
      if ( $ == undefined ) return this.$;
      this.$ = window.$( $ );
      return this;
    };

  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();