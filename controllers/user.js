module.exports = User.inherits( require('./base') );


function User( params ){
  this._init( params );
}


User.prototype._init = function( params ){
  User.parent._init.call( this, params );

  this.views_folder     = 'json';
  this.views_ext        = '.json';
}


User.prototype.login = function( response, request ){
  var self      = this;

  var listener  = response.create_listener();
  listener.stack <<= this.models.user.find_by_attributes({
    email : request.params.user.email,
    pass  : request.params.user.pass.md5()
  });

  listener.success(function( user ){
    if ( user ) self.app.users.login( user, request, request.params['remember'] ? 356 : 0 );

    response.view_name('main').send({
      error  : user ? null : 'Пользователя с таким e-mail не существует, или указан неправильный пароль',
      result : user ? self.create_url( 'site.index' ) : null
    })
  });
}


User.prototype.logout = function ( response, request ) {
  this.app.users.logout( request );
  request.redirect( '/' );
};


User.prototype.register = function ( response, request ) {
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