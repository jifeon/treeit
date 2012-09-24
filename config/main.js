/**
 * Настройки приложения
 */
var config = module.exports = {

  /**
   * Название приложения ( пока что используется только для логирования )
   *
   * @type {String}
   */
  name                : 'treeit',

  /**
   * Корневая директория приложения, в ней по умолчанию ищутся директории с моделями, контроллерами, вьюшками,
   * компонентами, а также относительно нее задаются другие пути в конфигурационном файле
   *
   * @type {String}
   */
  base_dir            : require('path').join( __dirname, '..' ),

  default_controller  : 'site',
  cache_views         : false,

  /**
   * Настройки компонента отвечающего за перенаправление запросов и генерацию запросов
   *
   * @type {Object}
   */
  router : {
    rules     : {
      ''                      : 'site.index',
      '/register'             : 'site.register',
      '/login'                : 'site.login',
      '/logout'               : 'site.logout',

      '/save_task'             : 'site.save_task'
    }
  },

  /**
   * Компоненты, загружаемые до инициализации ядра приложения
   * log_router - чтобы видеть этапы инициализации ядра
   *
   * @type {Array}
   */
  preload_components : [ 'log_router', 'db' ],

  /**
   * Настройка подключаемых компонентов. Здесь указываются как компоненты autodafe, так и пользовательские. Ключами
   * всегда является название подключаемого компонентка ( для пользовательских компонентов это название файла ), а
   * значениями - настройки для компонента. Если для компонента не надо передавать настройки, нужно просто указать true
   *
   * @type {Object}
   */
  components : {
    web_sockets : {
      port : 8080
    },

    // http сервер
    http                : {
      port : 3000,
      root_folders    : {
        js       : 'static/js',
        css      : 'static/css'
      }

    },
    //db

    db : {
      type      : 'mysql',
      user      : 'root',
      password  : '',
      database  : 'treeit',
      host      : 'localhost'
    },

    users    : true,

    // настройки логгера
    log_router          : {
      routes : {
        console : {
          levels : [ 'trace', 'info', 'warning', 'error' ]
    } } }
  }
};