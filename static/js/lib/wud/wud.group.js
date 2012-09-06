/*

wud.group

Author: Balakirev Andrey  <balakirev.andrey@gmail.com>

модуль для управления группой объектов

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

Свойства:

Array   wuds    =   []    Массив объектов ...  



 */


;( function () {

  var name        = 'wud.group';
  var dependences = [];
  var nameSpace   = '';

  var module = new function () {

    this.initVars = function () {
      this.wuds = [];
      this.group = null;
    };


    this.redefineVars = function ( variable ) {
      switch ( variable ) {
        case 'group':
          this.group = Boolean( this.wuds.length );
          break;

        default: return false;
      }

      return true;
    };


    this.getWud = function ( num ) {
      return this.wuds[ num ] || null;
    };


    this.delWud = function ( wud ) {
      var num = -1;
      this.each( function ( n ) {
        if ( this.eq( wud ) ) {
          num = n;
          return false;
        }
      } );

      if ( num >= 0 ) this.wuds.splice( num, 1 );
      if ( !this.wuds.length ) this.group = false;
    };


    this.each = function ( fun ) {
      if ( typeof fun != "function" ) return false;
      for ( var w = 0, w_ln = this.wuds.length; w < w_ln; w++ ) {
        var res = fun.call( this.wuds[w], w );
        if ( res === false ) break;
      }
    };

    this.push = function ( wud ) {
      if ( !( wud instanceof this.constructor ) ) return false;
      this.wuds.push( wud );
      this.group = true;
    };

    this.isGroup = function () {
      return this.group;
    };


    this.empty = function () {
      this.wuds = [];
      this.group = false;
    };


  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences,
    namespace   : nameSpace
  } );

})();