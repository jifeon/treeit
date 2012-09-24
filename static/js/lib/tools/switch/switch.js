function Switch ( params ) {
  this.init( params );
}


Switch.prototype = new Ofio({
  modules   : [
    'wud.jquery'
  ],
  className : 'Switch',
  ignoreNulls : [
    'chooser',
    'auto_switch'
  ]
});


Switch.prototype.initVars = function () {
  this.items          = null;
  this.created_items  = [];
  this.item_sample    = $('<div class="switch_item"></div>');
  this.chooser        = null;
  this.start_item     = 0;
  this.auto_switch    = null;
  this.current_item   = 0;
};


Switch.prototype.init = function ( params ) {
  this.constructor.prototype.init.call( this, params );

  this.chooser = this.$.find('.switch_chooser');

  this.init_items();
  this.init_sizes();
  this.to( this.start_item, false );
  this.init_auto_switch();

  this.$.css({
    visibility : 'visible'
  });
};


Switch.prototype.init_items = function () {
  for ( var i = 0, i_ln = this.items.length; i < i_ln; i++ ) {
    var item_params     = this.items[i];
    item_params.$       = this.item_sample.clone().appendTo( this.$ );
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


Switch.prototype.init_auto_switch = function () {
  if ( !this.auto_switch || !this.auto_switch.timeout ) return false;

  var self = this;

  this.auto_switch.interval = setInterval( function() {
    var next = self.current_item + 1;
    self.to( next >= self.created_items.length ? 0 : next );
    self.created_items[ self.current_item ].fire_event();
  }, this.auto_switch.timeout );
};


Switch.prototype.to = function ( n, animated, stop_auto_switch ) {
  var item = this.created_items[ n ];
  if ( item ) this.current_item = n;
  return this.to_item( item, animated, stop_auto_switch );
};


Switch.prototype.to_item = function ( item, animated, stop_auto_switch ) {
  if ( !item ) return false;
  if ( animated == undefined ) animated = true;
  
  if ( stop_auto_switch && this.auto_switch ) clearInterval( this.auto_switch.interval );

  this.chooser[ animated ? 'animate' : 'css' ]({
    width : item.$$().width() + 10,
    left  : item.$$().offset().left - this.$.offset().left + 1
  }, 200);

  return true;
};