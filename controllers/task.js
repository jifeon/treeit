module.exports = Task.inherits( require('./base') );
var Patch = require('../components/patch');


function Task( params ){
  this._init( params );
}


Task.prototype.save_task = function( response, request ){

  var ui    = this.app.users.get_by_client( request.client );
  if ( ui.is_guest() ) return response.send( new Error('Only users can add task'), 403 );

  var messages   = {
    errors : []
  };

  // проверяем действия которые пришли с клиента
  var client_actions  = JSON.parse( request.params.actions );

  if ( client_actions == null || client_actions.only_update  ) {
    if ( client_actions == null ) messages.errors.push( {
      type    : 'touser',
      content : 'Возникла ошибка при работе сервиса, некоторые ваши последнии действия будут утерены.' +
        'Рекомендуется перезагрузить страницу'
    } );
    //todo: после реализации захвата попапов по ид, следить за тем чтобы чообщение не выводилось постоянно
    client_actions = new Patch( { app : this.app, name : 'patch' } );
//    client_actions.set_client_index();
  }
  else client_actions = new Patch({
    create : client_actions.Task.create,
    update : client_actions.Task.update,
    remove : Object.values( client_actions.Task.remove ),
    app    : this.app,
    name   : 'patch'
  });
  client_actions.set_client_index();
  var listener = response.create_listener();

  listener.stack <<= this.models.user.With('tasks').find_by_pk( ui.model.id );

  listener.success( function( user ){
    response.view_file_name( 'json.json').send({
      errors  : messages.errors,
      action  : 'after_history_save',
      params  : user.save_actions( client_actions, request.params.revision, response.create_listener() )
    })
  })
}


Task.prototype.create_start_tasks = function( user, listener ) {

  var actions = new Patch({
      name : 'patch',
      app  : this.app,
      create : {
        1 : {
          id              : 1,
          parent_id       : 'life',
          next_id         : null,
          prev_id         : null,
          serv_id         : null,
          parent_serv_id  : 'life',
          next_serv_id    : null,
          prev_serv_id    : null,
          text            : "Древовизировать",
          done            : 0,
          ex_params       : '{}'
        },
        3 : {
          id              : 3,
          parent_id       : 1,
          next_id         : 4,
          prev_id         : null,
          serv_id         : null,
          parent_serv_id  : null,
          next_serv_id    : null,
          prev_serv_id    : null,
          text            : "Зарегистрироваться",
          done            : true,
          ex_params       : '{}'
        },
        4 : {
          id              : 4,
          parent_id       : 1,
          next_id         : 7,
          prev_id         : 3,
          serv_id         : null,
          parent_serv_id  : null,
          next_serv_id    : null,
          prev_serv_id    : null,
          text            : "Освоить интерфейс",
          done            : 0,
          ex_params       : '{}'
        },
        5 : {
          id              : 5,
          parent_id       : 4,
          next_id         : 6,
          prev_id         : null,
          serv_id         : null,
          parent_serv_id  : null,
          next_serv_id    : null,
          prev_serv_id    : null,
          text            : "Потыкать мышью",
          done            : 0,
          ex_params       : '{}'
        },
        6 : {
          id              : 6,
          parent_id       : 4,
          next_id         : null,
          prev_id         : 5,
          serv_id         : null,
          parent_serv_id  : null,
          next_serv_id    : null,
          prev_serv_id    : null,
          text            : "Попробовать хоткеи",
          done            : 0,
          ex_params       : '{}'
        },
        7 : {
          id              : 7,
          parent_id       : 1,
          next_id         : null,
          prev_id         : 4,
          serv_id         : null,
          parent_serv_id  : null,
          next_serv_id    : null,
          prev_serv_id    : null,
          text            : "Высказать мнение",
          done            : 0,
          ex_params       : '{}'
        }
      },
      update : {},
      remove : [],
      index_type : 0
    }
  );
  //actions.set_client_index();
  return user.save_actions( actions, 0, listener );
}