function TodoPage ( params ) {
  var self = this;
  $( function () {
    self.init( params );
  } );
}


TodoPage.prototype = new Ofio({
  modules   : [
    'page.history',
    'page.history.save',
    'todo_page.history',
    'ofio.logger',
    'ofio.event_emitter',
    'page.state',
    'todo_page.state',
    'todo_page.hotkeys',
    'todo_page.todo_blocks',
    'todo_page.menu',
    'todo_page.features',
    'todo_page.settings'
  ],
  feature_modules : [
    'todo_page.dragndrop'
  ],
  className : 'TodoPage'
});


TodoPage.prototype.initVars = function () {
  this.popups             = {};
  this.messages           = [];
  this.start_actions      = null;
  this.elements           = {};
  this.inited             = false;
  this.life_task          = {};
};


TodoPage.prototype.init = function ( params ) {
  this.constructor.prototype.init.call( this, params );
  this.extend_classes();

  this.init_elements();
  this.init_popups();
  this.init_hotkeys_panel();
  this.init_hotkeys();
  this.init_tasks();
  this.init_todo_blocks();
  this.init_buttons();
  this.init_history_triggers();
  this.init_ajax_triggers();
  this.init_state_triggers();

  this.init_features();

  this.clean();

  this.inited = true;
  this.emit( 'initialized' );

  this.focus_last_block();
};


TodoPage.prototype.reinit = function () {
  Task.serv_task_index = {
    life : this.life_task
  };
  this.life_task.kill();
};


TodoPage.prototype.clean = function () {
  Task.clean();
};


TodoPage.prototype.extend_classes = function () {
  var self = this;

  Error.is = function( obj ) {
    return obj instanceof this;
  }

  Error.prototype.show = function() {
    self.popups.add_messages( [{
      type    : 'warning',
      message : this.message
    }], true );
  };

  Error.prototype.log = function() {
    self.log( this.message, 'e' );
  }
};


TodoPage.prototype.init_elements = function () {
  this.elements = {
    sample_block      : $('#sample_block'),
    sample_block_item : $('#sample_task'),
    content           : $('#content')
  };
};


TodoPage.prototype.init_popups = function () {
  this.popups = new Popups({
    $               : $('#popup'),
    queue           : this.messages,
    animationSpeed  : 500
  });
};


TodoPage.prototype.init_tasks = function () {
  this.life_task = new Task({
    id      : 'life',
    serv_id : 'life',
    level   : LEVEL.LIFE
  });

  Task.serv_task_index[ 'life' ] = this.life_task;
  Task.create( this.start_actions.Task );
};


TodoPage.prototype.init_buttons = function () {
  var self = this;

  $('#new_list').click( function () {
    self.create_list();
  } );

  $('#clean_lists').click( function () {
    self.clean_lists();
  } );
};


TodoPage.prototype.init_hotkeys_panel = function () {
  this.hotkeys_panel = new HotkeysPanel({
    $ : $('#footer')
  });
};


TodoPage.prototype.init_ajax_triggers = function () {
  var self = this;

  var show_message = function ( message, type ) {
    switch ( message.type ) {
      case 'server':
        self.log( message.content, type.charAt( 0 ) );
        break;

      case 'touser':
        self.popups.add_messages([{
          type    : type,
          message : message.content
        }]);
        break;
    }
  };

  var ajax_handler = function ( messages ) {
    if ( messages.errors ) for ( var m = 0, m_ln = messages.errors.length; m < m_ln; m++ ) {
      show_message( messages.errors[ m ], 'error' );
    }
    if ( messages.info ) for ( m = 0, m_ln = messages.info.length; m < m_ln; m++ ) {
      show_message( messages.info[ m ], 'info' );
    }
  };

  this.on( 'ofio.ajax.error',   ajax_handler );
  this.on( 'ofio.ajax.success', ajax_handler );
};


TodoPage.prototype.create_list = function () {
  var task  = this.life_task.create_subtask();
  this.focus_last_block();
};


TodoPage.prototype.clean_lists = function () {
  this.life_task.clean();
};
