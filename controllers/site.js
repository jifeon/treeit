module.exports = Site.inherits( global.autodafe.Controller );
var Patch = require('../components/patch');
//var crypto      = require('crypto');


function Site( params ) {
  this._init( params );
  this.behavior_for( 'not_valid', this.validation_error );
}

Site.prototype.validation_error = function( response, request, errors ){
  response.merge_params({ errors : {
    reg : errors
  }});

  this.action( 'index', response, request);
}


//Site.prototype.global_view_params = function( response, request ){
//
//  var ui = this.app.users.get_by_client( request.client );
//
//  return {
//    user : ui && ui.model
//  }
//};

Site.prototype.connect_client = function ( client ){

  // Для начала достанем специальный объект UserIdentity привязанный к текущему пользователю
  var ui = this.app.users.get_by_client( client );

  // проверяем не авторизован ли уже наш клиент
  if ( !ui.is_guest() ) return true;

  // если не авторизован считываем параметры для авторизации из cookie
  var login = client.get_cookie( 'treeit_login' );
  var pass  = client.get_cookie( 'treeit_pass' );

  // если их нет, даже не пытаемся авторизоваться
  if ( !login || !pass ) return false;

  // иначе производим авторизацию
  return this._authorize( login, pass, client );
};

Site.prototype._authorize = function ( login, pass, client, success, fail ) {
  var emitter = new process.EventEmitter;

  var self = this;
  this.models.user.find_by_attributes( {
    email : login,
    pass  : pass
  } )
    .on( 'error', client.send_error.bind( client ) )
    .on( 'success', function( user ){
      if ( !user ) {
        if (typeof fail == 'function') fail();
        else emitter.emit('success');
        return false;
      }

      self._login_client( client, user );
      if ( typeof success == 'function' ) success();
      else emitter.emit('success');
    } );

  return emitter;
};


Site.prototype._login_client = function ( client, user ) {
  this.app.users.authorize_session( client.session, user );

  client.set_cookie( 'treeit_login',  user.email, 365 );
  client.set_cookie( 'treeit_pass',   user.pass,  365 );
};


Site.prototype._logout_client = function ( client ) {
  this.app.users.logout_session( client.session );

  client.set_cookie( 'treeit_login',  '' );
  client.set_cookie( 'treeit_pass',   '' );
};



Site.prototype.index = function ( response, request ) {
  var ui = this.app.users.get_by_client( request.client );
  if( ui && ui.model )
    response.send({
        user :   this.models.user.With( 'tasks' ).find_by_pk( ui.model.id )
    });

  else response.view_name( "auth" ).send();
};

Site.prototype.register = function ( response, request ) {
  var self      = this;
  var listener  = response.create_listener();
  var params = []
  for( var i in request.params) params.push(request.params[i]);
  // проверяем существует ли указанный логин
  listener.stack <<= this.models.user.exists( 'email=:login', {
    login : params[0]
  });

  listener.success( function( user_exists ){
    // если логин уже занят - отправляем главную страницу с показом ошибки
    if( user_exists ) {
      response.merge_params({ errors : {
        reg : { login : 'This login already in use' }
      }});

      return self.action( 'index', response, request );
    }

    // если нет - создаем модель пользователя
    var user = new self.models.user;

    // задаем ей параметры и сохраняем
    user.email = params[0];
    user.pass  = params[1];
    user.realpass = params[2];
    listener.stack <<= user.save();
    listener.success( function(){
      listener.stack <<= self.create_start_tasks( user, response.create_listener() );
      listener.success( function( template_params ){
      // логиним клиент
        self._login_client( request.client, user );
      // и редиректим его на главную
      request.redirect('/');
      });
    });
  });
};


Site.prototype.login = function ( response, request ) {
  var client  = request.client;
  var self    = this;
  var params = []
  for( var i in request.params) params.push(request.params[i]);

  // пытаемся авотризовать клиента
  this._authorize(
    params[0],//request.params.login,
//    crypto.createHash('md5').update( request.params.pass ).digest("hex"),
    params[1],//request.params.pass,
    client,
    client.redirect.bind( client, '/' ),    // успешно авторизован - редирект на главную
    function(){                             // показ ошибки на главной
      response.merge_params({ errors : {
        login : {login : 'Wrong login or/and password'}
      }});

      self.action( 'index', response, request );
    }
  );
};


Site.prototype.logout = function ( response, request ) {
  this._logout_client( request.client );
  request.redirect( '/' );
};



Site.prototype.save_task = function( response, request ){

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

Site.prototype.create_start_tasks = function( user, listener ) {

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