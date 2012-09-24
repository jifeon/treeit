;( function () {

  var name        = 'queue.item';
  var dependences = [];

  var module = new function () {

    this.initVars = function () {
      this.prev   = null;
      this.next   = null;
      this.queue  = null;
    };


    this.redefineVars = function ( variable ) {
      switch ( variable ) {
        case 'prev':
        case 'next':
        case 'queue':
          break;

        default: return false;
      }

      return true;
    };


    this.set_next = function ( next ) {
      if ( this == next || this.next == next ) return false;
      this.next = next;
      return true;
    };


    this.get_next = function ( rounded ) {
      return this.next || ( rounded && this.queue ? this.queue.get_first() : null );
    };


    this.set_prev = function ( prev ) {
      if ( this == prev || this.prev == prev ) return false;
      this.prev = prev;
      return true;
    };


    this.get_prev = function ( rounded ) {
      return this.prev || ( rounded && this.queue ? this.queue.get_last() : null );
    };


    this.is_first = function () {
      return this.queue && this == this.queue.get_first();
    };


    this.is_last = function () {
      return this.queue && this == this.queue.get_last();
    };


    this.move_down = function() {
      if ( !this.next || !this.queue ) return new Error( 'Next task does not exist or this task is not in queue' );
      return this.queue.insert_after( this, this.next );
    };


    this.move_up = function() {
      if ( !this.prev || !this.queue ) return new Error( 'Prev task does not exist or this task is not in queue' );
      return this.queue.insert_before( this, this.prev );
    };


    this.remove_queue = function() {
      this.queue = null;
    };
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();