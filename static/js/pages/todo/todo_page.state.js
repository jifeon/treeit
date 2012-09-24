;( function () {

  var name        = 'todo_page.state';
  var dependences = [
    'ofio.event_emitter',
    'ofio.logger'
  ];

  var module = new function () {

    this.initVars = function () {
      this.STATE          = {
        BLANK                               : 0x00000000,
        SHOWN_POPUP                         : 0x00000001,
        SHOWN_POPUP_HAS_MANY_MESSAGES       : 0x00000002,
        TODO_BLOCK_FOCUSED                  : 0x00000004,
        TODO_TASK_FOCUSED                   : 0x00000008,
        TODO_EXPANDED_TASK_FOCUSED          : 0x00000010,
        TODO_BLOCK_TITLE_FOCUSED            : 0x00000020,
        DRAGNDROP_PROCESSING                : 0x00000040,
        SHOWN_POPUP_WINDOW                  : 0x00000080
      }
    };


    this.init_state_triggers = function () {
      var self = this;

      // popups
      this.popups.on( 'visible.show', function () {
        self.add_state( self.STATE.SHOWN_POPUP );
      } );

      this.popups.on( 'visible.hide', function () {
        self.remove_state( self.STATE.SHOWN_POPUP );
        self.remove_state( self.STATE.SHOWN_POPUP_HAS_MANY_MESSAGES );
      } );

      this.popups.on( 'fill', function ( messages ) {
        self[ messages.length > 1 ? 'add_state' : 'remove_state' ]( self.STATE.SHOWN_POPUP_HAS_MANY_MESSAGES );
      } );

      // to do service
      TodoBlock.on( 'focus', function () {
        self.add_state( self.STATE.TODO_BLOCK_FOCUSED | self.STATE.TODO_BLOCK_TITLE_FOCUSED );
      } );

      TodoBlock.on( 'unfocus', function () {
        self.remove_state( self.STATE.TODO_BLOCK_FOCUSED | self.STATE.TODO_BLOCK_TITLE_FOCUSED );
      } );

      TodoBlockItem.on( 'focus', function () {
        // todo: учесть смену статуса и во время фокуса тоже
        self.add_state( self.STATE.TODO_TASK_FOCUSED );
        if ( this.model.has_subtasks() ) self.add_state( self.STATE.TODO_EXPANDED_TASK_FOCUSED );
        self.remove_state( self.STATE.TODO_BLOCK_TITLE_FOCUSED );
      } );

      TodoBlockItem.on( 'unfocus', function () {
        self.remove_state( self.STATE.TODO_TASK_FOCUSED | self.STATE.TODO_EXPANDED_TASK_FOCUSED );
        self.add_state( self.STATE.TODO_BLOCK_TITLE_FOCUSED );
      } );

      this.on( 'start_drag', function () {
        self.add_state( self.STATE.DRAGNDROP_PROCESSING );
      } );

      this.on( 'stop_drag', function () {
        self.remove_state( self.STATE.DRAGNDROP_PROCESSING );
      } );

      PopupWindow.on( 'show', function () {
        self.add_state( self.STATE.SHOWN_POPUP_WINDOW );
      } );

      PopupWindow.on( 'hide', function () {
        self.remove_state( self.STATE.SHOWN_POPUP_WINDOW );
      } );

      with ( this.STATE )
      this.add_state( BLANK );
    };
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();