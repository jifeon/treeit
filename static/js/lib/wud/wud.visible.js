;( function () {

  var name        = 'wud.visible';
  var dependences = [
    'wud.jquery',
    'wud.animate',
    'ofio.event_emitter'
  ];

  var module = new function () {

    this.hide = function ( animate, cb ) {
      var self = this;
      var trigger = function () {
        self.emit( 'visible.hide' );
        if ( typeof cb == 'function' ) cb();
      }

      if ( animate ) this.$.fadeOut( this.animationSpeed, trigger);
      else {
        this.$.hide();
        trigger();
      }
    };

    this.show = function ( animate, cb ) {
      var self = this;
      var trigger = function () {
        self.emit( 'visible.show' );
        if ( typeof cb == 'function' ) cb();
      }

      if ( animate )  this.$.fadeIn( this.animationSpeed, trigger );
      else {
        this.$.show();
        trigger();
      }
    };

    this.vis = function ( visible, animate, cb ) {
      if ( visible == undefined ) return this.$[0].style.display != "none";
      if ( visible == 'toggle' ) visible = !this.vis();
      this[ visible ? "show" : "hide" ]( animate, cb );
    };

  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();