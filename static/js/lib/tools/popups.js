function Popups ( params ) {
  this.init( params );
}


Popups.precreated_messages  = [];


Popups.precreate_message = function( message_params ) {
  return this.precreated_messages.push( message_params ) - 1;
}


Popups.prototype = new Ofio({
  modules   : [
    'wud.jquery',
    'wud.visible',
    'ofio.utils',
    'ofio.triggers'
  ],
  className : 'Popups'
});


Popups.prototype.initVars = function () {
  this.queue          = [];
  this._ids_in_queue  = {};
  this.current_popup  = -1;
  this.elements       = {};
  this.popup_width    = 200;
  this.swap           = $('<div></div>');
  this.$_executed     = false;
};


Popups.prototype.init = function ( params ) {
  this.constructor.prototype.init.call( this, params );

  this.set_elements();
  this.add_handlers();
  this.check_queue();
};


Popups.prototype.set_elements = function () {
  this.elements = {
    current : this.$.find('.current_message'),
    total   : this.$.find('.total_messages'),
    left    : this.$.find('.arrow_left'),
    right   : this.$.find('.arrow_right'),
    close   : this.$.find('.close'),
    message : this.$.find('.message'),
    multi   : this.$.find('.multi')
  };
};


Popups.prototype.add_handlers = function () {
  var self = this;

  this.elements.left.click( function () {
    self.prev_message();
  } );

  this.elements.right.click( function () {
    self.next_message();
  } );

  this.elements.close.click( function () {
    self.close();
  } );
};


Popups.prototype.check_queue = function () {
  if ( this.queue.length ) {
    this.current_popup = 0;
    this.fill();
  }
};


Popups.prototype.fill = function ( animate ) {
  if ( !this.queue.length ) return false;
  this.current_popup = this.utils.toRange( this.current_popup, 0, this.queue.length - 1 );

  if ( animate == undefined ) animate = true;

  var message, type, html, width;
  if ( typeof this.queue[ this.current_popup ] == "string" ) {

    message = this.queue[ this.current_popup ];
    type    = 'info';
    html    = false;
    width   = this.popup_width;
  }
  else if ( typeof this.queue[ this.current_popup ] == "number" ) {

    var n               = this.queue[ this.current_popup ];
    var message_params  = Popups.precreated_messages[ n ] || {};

    message = message_params.message;
    type    = message_params.type;
    html    = message_params.html;
    width   = message_params.width || this.popup_width;
  }
  else if ( this.queue[ this.current_popup ] instanceof Object ) {

    message = this.queue[ this.current_popup ].message;
    type    = this.queue[ this.current_popup ].type;
    html    = this.queue[ this.current_popup ].html;
    width   = this.queue[ this.current_popup ].width || this.popup_width;
  }

  this.animate( { width : width } );
  this.animate.call({
    $ : this.elements.message
  }, { width : width - 50 });

  if ( this.$_executed ) this.swap.append( this.$_executed );
  
  if ( message instanceof $ ) {
    this.elements.message.empty().append( message );
    this.$_executed = message;
  }
  else {
    this.elements.message[ html ? 'html' : 'text' ]( message );
    this.$_executed = false;
  }
  this.$.attr( 'class', type );

  this.elements.left.css( 'visibility', this.current_popup == 0 ? 'hidden' : 'visible' );
  this.elements.right.css( 'visibility', this.current_popup == this.queue.length - 1 ? 'hidden' : 'visible' );
  this.elements.multi [ this.queue.length  >  1 ? 'show' : 'hide' ]();

  this.elements.current.text( this.current_popup + 1 );
  this.elements.total.text( this.queue.length );

  this.runTrigger( 'popups.fill', [ this.queue ] );

  this.show( animate );
};


Popups.prototype.prev_message = function () {
  this.current_popup--;
  this.fill();
};


Popups.prototype.next_message = function () {
  this.current_popup++;
  this.fill();
};


Popups.prototype.close = function () {
  this.current_popup  = -1;
  this.queue          = [];
  this._ids_in_queue  = {};
  this.hide( true );
};


Popups.prototype.add_messages = function ( messages, switch_to_it, animate ) {
  messages = messages instanceof Array ? messages : [];
  var old_length    = this.queue.length;
  if ( switch_to_it ) this.current_popup = old_length;
  Array.prototype.push.apply( this.queue, messages );

  for ( var message_num = old_length, m_ln = this.queue.length; message_num < m_ln; message_num++ ) {
    var n = this.queue[ message_num ];
    if ( typeof n == 'number' ) {
      if ( this._ids_in_queue[ n ] ) this._ids_in_queue[ n ].push( message_num );
      else this._ids_in_queue[ n ] = [ message_num ];
    }
  }

  this.fill( animate );
};