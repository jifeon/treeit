/*

ofio.ajax.edit

author : Balakirev Andrey <balakirev.andrey@gmail.com>

Модуль для создания, удалениея и редактирования объекта по средствам ajax

* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

Добавляет свойства:

Object ajaxConfig  = {                                      - должно быть опредеено в прототипе класса
                       vars : [],                           - массив названий переменных которые будут отправлены
                                                              на сервер
                       urls : {
                         view   : String view_url,          - url для получения параметров для создания экземпляра
                                                              класса
                         create : String create_url,        - url для создания объекта на сервере
                         edit   : String view_url,          - url для редактирования объекта
                         remove : String remove_url,        - url для удаения объекта
                       }
                     }


* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//TODO: describe module
Добовляет методы:


(g)Number (s)Wud     Top    ( [  (g|s)Number    top,                      - отступ сверху
                                      Bool      animate     = true,       - задать анимированно
                                      Bool      difference  = false,      - прибавить значение к текущему
                                      Function  callback,                 - функция которую сделать после завершения
                                      Number    delay       = 0 ] )       - задержка перед выполнением
Задает или возвращает верхний отступ объекта $.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

(g)Number (s)Wud     Left   ( [  (g|s)Number    left,                     - отступ слева
                                      Bool      animate     = true,       - задать анимированно
                                      Bool      difference  = false,      - прибавить значение к текущему
                                      Function  callback,                 - функция которую сделать после завершения
                                      Number    delay       = 0 ] )       - задержка перед выполнением
Задает или возвращает отступ слева объекта $.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

(g)Number (s)Wud     Bottom ( [  (g|s)Number    bottom,                   - расположение нижней границы
                                      Bool      animate     = true,       - задать анимированно
                                      Bool      difference  = false,      - прибавить значение к текущему
                                      Function  callback,                 - функция которую сделать после завершения
                                      Number    delay       = 0 ] )       - задержка перед выполнением
Задает или возвращает расположение нижней границы объекта $.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

(g)Number (s)Wud     Right  ( [  (g|s)Number    right,                    - расположение правой границы
                                      Bool      animate     = true,       - задать анимированно
                                      Bool      difference  = false,      - прибавить значение к текущему
                                      Function  callback,                 - функция которую сделать после завершения
                                      Number    delay       = 0 ] )       - задержка перед выполнением
Задает или возвращает расположение правой границы объекта $.


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

(g)Object (s)Wud     PositionEvent ( [  (g|s)Object    position,          - позиция с координатами мыши
                                          Bool      animate     = true,   - задать анимированно
                                          Bool      difference  = false,  - прибавить значение к текущей
                                          Function  callback,             - функция которую сделать после завершения
                                          Number    delay       = 0 ] )   - задержка перед выполнением
Задает или возвращает позицию объекта $.

объект position описывается как
{
  pageX  : Number left | null,
  pageY  : Number top  | null
}
в таком же виде возвращается позиция


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

(g)Object (s)Wud     Position   ( [  (g|s)Object    position,             - позиция
                                          Bool      animate     = true,   - задать анимированно
                                          Bool      difference  = false,  - прибавить значение к текущей
                                          Function  callback,             - функция которую сделать после завершения
                                          Number    delay       = 0 ] )   - задержка перед выполнением
Задает или возвращает позицию объекта $.

объект position описывается как
{
  x  : Number left | null,
  y  : Number top  | null
}
в таком же виде возвращается позиция


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Wud     quickSetPosition    ( Object position )   - быстрое задание позиции, используется во время драга

position =  {
              x  : Number left | null,
              y  : Number top  | null
            }


- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

Object  Center              ()                    - возвращает позицию центра объекта в виде
                                                    {
                                                      x  : Number left_of_center,
                                                      y  : Number top_of_center
                                                    }


* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

Triggers

(s)Top, (s)Left, (s)Position, (s)PositionEvent    -> changePosition        ( Object current_position )
(s)Bottom, (s)Right                               -> changeSize            ( Object current_size     )
quickSetPosition                                  -> Wud.quickSetPosition  ( Object position         )

 */

;( function () {

  var name        = 'ofio.ajax.edit';
  var dependences = [
    'ofio.search',
    'ofio.ajax',
    'ofio.logger',
    'ofio.json'
  ];

  var wrap = function ( _var ) {

    return ( this.ajaxName || this.__className ) + '[' + _var + ']';
  }

  var module = new function () {

    this.initVars = function () {
      if ( !( this.ajaxConfig instanceof Object ) ) this.log( 'this.ajaxConfig is undefined in ofio.ajax.edit', 'e' );
    };


    this.ajax_save = function () {
      if ( typeof this.beforeSave == "function" ) this.beforeSave();

      var saveVars = {
        id : this.Id()
      };

      for ( var v = 0, v_ln = this.ajaxConfig.vars.length; v < v_ln; v++ ) {
        var _var = this.ajaxConfig.vars[v];
        if ( typeof this.saveRules == "function" ) {
          var val = this.saveRules( _var );
          if ( val === null ) val = this[ _var ];
        } else val = this[ _var ];
        if ( val instanceof Array ) val = val.join(',');
        else if ( val != null && val instanceof Object ) val = this.json_decode( val );
        saveVars[ wrap.call( this, _var ) ] = val;
      }

      return this.sjax(
        this.ajaxConfig.urls.edit,
        saveVars
      );
    };


    this.ajax_remove = function ( remove_params ) {
      var ajax_params = {
        id : this.id
      };

      for ( var param in remove_params ) {
        ajax_params[ param ] = remove_params[ param ];
      }

      var params = this.sjax(
        this.ajaxConfig.urls.remove,
        ajax_params
      ) || {};

      return params.ok || null;
    };

  };


  var ajax_create = function ( params, extend_params ) {
    var proto           = this.prototype;
    var params_to_send  = {};

    for ( var prop in params ) {
      params_to_send[ wrap.call( proto, prop ) ] = params[ prop ];
    }

    var create_params = proto.sjax(
      proto.ajaxConfig.urls.create,
      params_to_send
    );

    if ( !create_params ) return null;

    if ( typeof extend_params == "function" ) extend_params( create_params );
    return new this( create_params );
  };


  var ajax_get = function ( id, extend_params, get_params ) {
    var proto = this.prototype;

    var instance;
    if ( instance = proto.getById( id ) ) return instance;

    var params = {
      id : id
    };

    for ( var param in get_params ) {
      params[ param ] = get_params[ param ];
    }

    var init_params = proto.sjax(
      proto.ajaxConfig.urls.view,
      params
    );

    if ( !init_params ) return null;

    if ( typeof extend_params == "function" ) extend_params( init_params );
    return new this( init_params );
  };


  var onInclude = function ( clazz ) {
    clazz.ajax_create = ajax_create;
    clazz.ajax_get    = ajax_get;
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences,
    onInclude   : onInclude
  } );

})();