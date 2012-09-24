;( function () {

  var name        = 'wud.dragndrop';
  var dependences = [
    'wud.position',
    'ofio.event_emitter',
    'ofio.text',
    'ofio.utils'
  ];

  var mousedown = function ( e ) {
    if ( this.lock_drag ) return false;
    if ( typeof this.on_mousedown == "function" && this.on_mousedown.call( this, e ) === false ) return false;
    this.emit( 'wud.dragndrop.mousedown' );
    this.dif_drag = {
      x : e.pageX - this.$$().offset().left,
      y : e.pageY - this.$$().offset().top
    };
    this.dragging = true;
    this.is_moved = false;

    this.dif_root = {
      x : this.root_element.offset().left,
      y : this.root_element.offset().top
    };

    this.preventSelection( 'body' );
    $( document ).mousemove( this.mousemove );
    $( document ).mouseup(   this.mouseup   );
  };


  var mousemove = function ( e ) {
    if ( !this.dragging ) return false;
    this.is_moved     = true;
    this.tmp_position  = {
      x : e.pageX - this.dif_drag.x - this.dif_root.x,
      y : e.pageY - this.dif_drag.y - this.dif_root.y
    };
    this.quickSetPosition( this.tmp_position );
  };


  var mouseup = function ( e ) {
    this.unpreventSelection( 'body' );
    $( document ).unbind( 'mousemove',  this.mousemove  );
    $( document ).unbind( 'mouseup',    this.mouseup    );

    this.old_position = this.utils.clone( this.Position() );
    this.Position( this.tmp_position, false );

    var onDropResult;
    if ( typeof this.on_drop == 'function' && ( onDropResult = this.on_drop.call( this, this.old_position ) ) === false ) {
      this.Position( this.old_position );
      this.tmpPosition = this.Position();
      this.emit( 'wud.dragndrop.mouseup.drop_false' );
      return false;
    }

    this.emit( 'wud.dragndrop.mouseup.drop_true', onDropResult );

    this.dif_drag  = { x : 0, y : 0 };
    this.dragging = false;
    this.wasMove  = false;
    return true;
  };


  var addHandlers = function () {
    var self = this;
    this.drag_starter.mousedown( function (e) {
      mousedown.call( self, e );
    });
  };


  var module = new function () {

    this.init = function () {
      addHandlers.call( this );

      var self = this;

      this.mousemove = function ( e ) {
        mousemove.call( self, e );
      };

      this.mouseup = function ( e ) {
        mouseup.call( self, e );
      };

      this.$.css({
        cursor : this.lock_drag ? 'default' : 'move'
      });
    };


    this.initVars = function () {
      this.dif_drag     = { x : 0, y : 0 };
      this.dif_root     = { x : 0, y : 0 };
      this.is_moved     = false;
      this.lock_drag    = false;
      this.tmp_position = { x : 0, y : 0 };
      this.root_element = null;
      this.drag_starter = null;

      this.on_drop      = function () { return true; };
      this.on_mousedown = function () { return true; };
    };


    this.redefineVars = function ( variable ) {
      switch ( variable ) {
        case 'root_element':
          this.root_element = this.parent;
          break;


        case 'drag_starter':
          if ( !this.$ || !this.$.length ) return false;
          this.drag_starter = this.$;
          break;

        default: return false;
      }

      return true;
    };

    this.start_drag = function( e ) {
      mousedown.call( this, e );
    };
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();