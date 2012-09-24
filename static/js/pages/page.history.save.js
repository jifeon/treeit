;( function () {
  var name        = 'page.history.save';
  var dependences = [
    'page.history',
    'ofio.ajax',
    'ofio.event_emitter',
    'ofio.logger',
    'ofio.json',
    'ofio.utils'
  ];

  var auto_save_ms      = 30000;
  var failed_connection = false;
  var socket = io.connect('http://localhost:8080/treeit');

  var on_add_action = function ( action ) {
    if ( this.current_revision_start == null ) this.current_revision_start = action;
  };

  var collect_actions_to_save = function ( data ) {
    data = data || {};

    if ( !this.current_revision_start ) return data;

    for ( var action = this.current_revision_start; action; action = action.next ) {
      var obj = action.obj;

      var class_name = obj.__className;
      if ( !data[ class_name ] ) data[ class_name ] = {
        create : {},
        update : {},
        remove : {}
      };
      var class_data = data[ class_name ];

      switch ( action.operation ) {
        case Action.create:
          if ( class_data.create[ obj.id ] ) {
            this.log( 'page.history.save.collect_actions_to_save -> creating exist object', 'w' );
            continue;
          }

          class_data.create[ obj.id ] = action.params;
          break;

        case Action.update:
          if ( class_data.create[ obj.id ] ) class_data.create[ obj.id ] = action.params;
          else class_data.update[ obj.id ] = action.params;
          break;

        case Action.remove:
          delete class_data.create[ obj.id ];
          delete class_data.update[ obj.id ];

          if ( obj.serv_id != null ) class_data.remove[ obj.id ] = obj.serv_id;
          break;
      }

    }

    return data;
  };

  var history_save_complete = function ( data ) {
    if ( data == null ) {
      if ( !failed_connection ) this.popups.add_messages([ BAD_CONNECTION_MESSAGE ]);
      failed_connection = true;
      this.emit( 'history_save.complete' );
      return false;
    }

    if ( failed_connection ) {
      
      this.popups.add_messages([ GOOD_CONNECTION_MESSAGE ], true );
      failed_connection = false;
    }

    this.history_revision = data.revision;
    var reinit            = data.reinit || false;

    delete data.revision;
    delete data.reinit;

    this.stop_save();

    if ( reinit ) {
      this.reinit();
      this.elements.content.hide();
    }

    for ( var class_name in data ) {
      var actions = data[ class_name ];
      if ( actions == null || typeof actions != 'object' ) continue;

      if ( this.save_data && this.save_data[ class_name ] ) {
        if ( reinit ) merge.call( this, this.save_data[ class_name ], actions );
        else update_save_data.call( this, class_name, actions );
      }
      if ( typeof window[ class_name ] == 'function' ) window[ class_name ].patch( actions );
    }

    this.elements.content.show();
    this.restore_save();

    this.save_data = null;
    this.emit( 'history_save.complete' );
  };


  var merge = function ( client_actions, serv_actions ) {
    if ( !client_actions ) return false;

    for ( var client_id in client_actions.create ) {
      serv_actions.create[ 'client' + client_id ] = client_actions.create[ client_id ];
    }
  };


  var update_save_data = function( class_name, serv_actions ) {
    if ( !this.save_data ) return false;
    var client_actions = this.save_data[ class_name ];
    if ( !client_actions ) return false;

    for ( var serv_id in serv_actions.update ) {
      var serv_params = serv_actions.update[ serv_id ];
      var client_id   = serv_params.id;
      if ( client_actions.update[ client_id ] ) {
        client_actions.update[ client_id ].serv_id = serv_params[ 'serv_id' ];
        serv_actions.update[ serv_id ] = client_actions.update[ client_id ];
      }
    }
  };


  var BAD_CONNECTION_MESSAGE;
  var GOOD_CONNECTION_MESSAGE;

  var module = new function () {

    this.initVars = function () {
      this.history_revision       = null;
      this.current_revision_start = null;
      this.history_save_url       = null;
      this.last_save_time         = new Date();
      this.save_data              = null;
      this.show_save_messsage     = true;

      BAD_CONNECTION_MESSAGE      = Popups.precreate_message({
        type    : 'warning',
        message : 'У-упс.. Что-то идет не так, Ваши действия могут не сохраняться.'
      });

      GOOD_CONNECTION_MESSAGE     = Popups.precreate_message({
        type    : 'success',
        message : 'Автосохранение восстановлено'
      });
    };


    this.redefineVars = function ( variable ) {
      switch ( variable ) {
        case 'current_revision_start':
        case 'history_revision':
        case 'save_data':
          break;

        default: return false;
      }

      return true;
    };


    this.init = function () {
      var self = this;

      this.on( 'history.add_action', on_add_action );

      setInterval( function () {
        self.history_save();
      }, auto_save_ms );

      Date.prototype.get_time = function () {
        return self.utils.two_pos( this.getHours() ) + ':' + self.utils.two_pos( this.getMinutes() );
      }

      window.onbeforeunload = function () {
        self.emit( 'before_close' );

        var show_success_popup = function () {
          self.popups.add_messages( [{
            type    : 'success',
            message : 'Сохранение выполнено'
          }], true );
        };

        if ( self.current_revision_start ) {
          self.popups.add_messages([
            {
              type    : 'wait',
              message : 'Сохранение..'
            }
          ], true, false);
          self.history_save( show_success_popup );
          return self.show_save_messsage
            ? 'У вас есть несохраненные действия. Вы уверены, что хотите покинуть страницу?'
            : undefined;
        }
      }
    };


    this.history_save = function ( cb ) {

      socket.on( 'after_history_save', function ( data, messages ) {
        history_save_complete.call( self, data );
        if ( typeof cb == "function" ) cb();
      } );

      this.emit( 'history_save.start' );
      var only_update = Boolean( this.save_data );

      this.save_data = collect_actions_to_save.call( this, this.save_data );
      if ( !only_update && this.current_revision_start == null ) only_update = true;
      this.current_revision_start = null;

      var self = this;
      socket.emit( 'message', {
        action    : 'save_task',
        params    : {
          actions   : only_update ? '{ "only_update" : "true" }' : this.json_decode( this.save_data, true, true ),
          revision  : this.history_revision
          }
      });

//      this.ajax( this.history_save_url, {
//        actions   : only_update ? '{ "only_update" : "true" }' : this.json_decode( this.save_data, true, true ),
//        revision  : this.history_revision
//      }, function ( data, messages ) {
//        history_save_complete.call( self, data );
//        if ( typeof cb == "function" ) cb();
//      } );

      return only_update;
    };

  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();