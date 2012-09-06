function Switch ( params ) {
  this.init( params );
}


Switch.prototype = new Ofio({
  modules   : [
    'wud.jquery'
  ],
  className : 'Switch'
});


Switch.prototype.initVars = function () {
  this.items          = null;
  this.created_items  = [];
  this.item_sample    = $('#sample_switch_item');
  this.chooser        = {};
  this.start_item     = 0;
};


Switch.prototype.init = function ( params ) {
  this.constructor.prototype.init.call( this, params );

  this.chooser = this.$.find('.switch_chooser');

  this.init_items();
  this.init_sizes();
  this.to( this.start_item, false );
};


Switch.prototype.init_items = function () {
  for ( var i = 0, i_ln = this.items.length; i < i_ln; i++ ) {
    var item_params     = this.items[i];
    item_params.$       = this.item_sample.clone().removeAttr( 'id' ).appendTo( this.$ );
    item_params._switch = this;
    this.created_items.push( new SwitchItem( item_params ) );
  }
};


Switch.prototype.init_sizes = function () {
  var width = this.$.width();
  this.$.css({
    'float' : 'none',
    'width' : width
  });
};


Switch.prototype.to = function ( n, animated ) {
  var item = this.created_items[ n ];
  return this.to_item( item, animated );
};


Switch.prototype.to_item = function ( item, animated ) {
  if ( !item ) return false;
  if ( animated == undefined ) animated = true;

  this.chooser[ animated ? 'animate' : 'css' ]({
    width : item.$$().width() + 10,
    left  : item.$$().offset().left - this.$.offset().left + 1
  }, 200);

  return true;
};