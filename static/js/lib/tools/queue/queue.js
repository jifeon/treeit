function Queue ( params ) {
  this.init( params );
}


Queue.prototype = new Ofio({
  modules   : [],
  className : 'Queue'
});


Queue.prototype.initVars = function () {
  this.items   = {};
  this.first   = null;
  this.last    = null;
  this.count   = 0;
};


Queue.prototype.redefineVars = function ( variable ) {
  switch ( variable ) {
    case 'last':
    case 'first':
      break;

    default: return false;
  }

  return true;
};


Queue.prototype.init = function ( params ) {
  this.constructor.prototype.init.call( this, params );
};


Queue.prototype.concat = function( queue ) {
  if ( !this.count ) return queue;
  if ( !queue.length() ) return this;

  var self = this;
  queue.each( function() {
    self._slice_from_self( this );
    if ( self._add( this ) ) self._append( this );
  } );

  this.last.next = queue.first;
  queue.first.prev = this.last;

  this.last = queue.last;
  queue.kill();

  return this;
};


Queue.prototype.add = function( item ) {
  if ( this.count ) this.insert_after( item, this.last );
  else {
    this._slice( item );
    if ( this._add( item ) ) this._append( item );
    this._link( item, null );
    this._link( null, item );
  }
};


Queue.prototype.kill = function() {
  this.initVars();
}


Queue.prototype.insert_after = function ( item, prev ) {
  if ( !this.has( prev ) ) return new Error( 'prev not in Queue. Queue.insert_after' );

  this._slice( item );
  var need_append = this._add( item );

  if ( prev ) this._link( item, prev.next );
  this._link( prev, item );
  if ( need_append ) this._append( item );

  return true;
};


Queue.prototype.insert_before = function ( item, next ) {
  if ( !this.has( next ) ) return new Error( 'next not in Queue. Queue.insert_before' );

  this._slice( item );
  var need_append = this._add( item );

  if ( next ) this._link( next.prev,  item);
  this._link( item, next );
  if ( need_append ) this._append( item );

  return true;
};


Queue.prototype.remove = function ( item ) {
  if ( this.has( item ) ) {
    this.count--;
    this._slice( item );
    delete this.items[ item.id ];
    item.remove_queue();
  }
};


Queue.prototype.has = function ( item ) {
  return item && this.items[ item.id ];
};


Queue.prototype.each = function ( fun ) {
  for ( var item = this.first; item; item = item.next ) {
    if ( fun.call( item ) === true ) break;
  }
};


Queue.prototype.get_last = function () {
  return this.last;
};


Queue.prototype.get_first = function () {
  return this.first;
};


Queue.prototype.length = function () {
  return this.count;
};


Queue.prototype._add = function ( item ) {
  if ( this.has( item ) ) return false;
  this.items[ item.id ] = item;
  return true;
};


Queue.prototype._append = function ( item ) {
  this.count++;
  item.queue = this;
};


Queue.prototype._slice = function ( item ) {
  this._slice_from_self( item );
  this._clean( item );
};


Queue.prototype._slice_from_self = function( item ) {
  if ( this.has( item ) ) this._link( item.prev,  item.next );
}


Queue.prototype._link = function ( prev, next ) {
  if ( prev ) {
    prev.set_next( next );
    if ( next && prev.eq( this.last ) ) this.last = next;
  }
  else this.first = next;

  if ( next ) {
    next.set_prev( prev );
    if ( prev && next.eq( this.first ) ) this.first = prev;
  }
  else this.last = prev;
};


Queue.prototype._clean = function ( item ) {
  if ( this.has( item ) || !item.queue ) {
    item.next = null;
    item.prev = null;
  }
  else if ( item.queue ) item.queue.remove( item );
};