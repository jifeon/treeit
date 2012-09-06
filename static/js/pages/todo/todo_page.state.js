;( function () {

  var name        = 'todo_page.state';
  var dependences = [
    'ofio.triggers',
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
        TODO_BLOCK_TITLE_FOCUSED            : 0x00000020
      }
    };


    this.init_state_triggers = function () {
      var self = this;

      // popups
      this.popups.addFunctionToTrigger( 'wud.visible.show', function () {
        self.add_state( self.STATE.SHOWN_POPUP );
      } );

      this.popups.addFunctionToTrigger( 'wud.visible.hide', function () {
        self.remove_state( self.STATE.SHOWN_POPUP );
        self.remove_state( self.STATE.SHOWN_POPUP_HAS_MANY_MESSAGES );
      } );

      this.popups.addFunctionToTrigger( 'popups.fill', function ( messages ) {
        self[ messages.length > 1 ? 'add_state' : 'remove_state' ]( self.STATE.SHOWN_POPUP_HAS_MANY_MESSAGES );
      } );

      // to do service
      this.addFunctionToGlobalTrigger( 'TodoBlock.focus', function () {
        self.add_state( self.STATE.TODO_BLOCK_FOCUSED | self.STATE.TODO_BLOCK_TITLE_FOCUSED );
      } );

      this.addFunctionToGlobalTrigger( 'TodoBlock.unfocus', function () {
        self.remove_state( self.STATE.TODO_BLOCK_FOCUSED | self.STATE.TODO_BLOCK_TITLE_FOCUSED );
      } );

      this.addFunctionToGlobalTrigger( 'TodoBlockItem.focus', function () {
        // todo: учесть смену статуса и во время фокуса тоже
        self.add_state( self.STATE.TODO_TASK_FOCUSED );
        if ( this.model.has_subtasks() ) self.add_state( self.STATE.TODO_EXPANDED_TASK_FOCUSED );
        self.remove_state( self.STATE.TODO_BLOCK_TITLE_FOCUSED );
      } );

      this.addFunctionToGlobalTrigger( 'TodoBlockItem.unfocus', function () {
        self.remove_state( self.STATE.TODO_TASK_FOCUSED | self.STATE.TODO_EXPANDED_TASK_FOCUSED );
        self.add_state( self.STATE.TODO_BLOCK_TITLE_FOCUSED );
      } );

      

//      var showState = function () {
//        self.log( 'Page state: ', self.state, 'i' );
//      };
//
//      this.addFunctionToTrigger( 'page.state.add_state',    showState );
//      this.addFunctionToTrigger( 'page.state.remove_state', showState );

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