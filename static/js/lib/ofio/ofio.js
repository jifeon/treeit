/*

  Author: Balakirev Andrey <balakirev.andrey@gmail.com>

  Ofio это javascript фрэймворк обеспечивающий модульную структуру js приложения, с возможностью разграничения
  зависимостей модулей и поддержкой пространств имен для них, наследование, проверку передачи необхдимых параметров для
  инициализации класса и четкую структуру кода.

  Использоване:


  1. Написание класса

  var YourClass = function ( params ) {                   // params - хэш параметров
    this.init( params );
  }


  YourClass.prototype = new Ofio({                        // наследуемся от Ofio
    modules             : [ 'module_1', ... ],            // указываем назавние модулей которые надо подключить
                                                          // необ. по умолчанию []

    className           : 'YourClass',                    // название класса
    extend              : ExtendClass                     // класс от которого наследуем, если необходимо
  });


  YourClass.prototype.init = function ( params ) {
    this.constructor.prototype.init.call( params );       // вызывает Ofio.init

    // ваши действия которые надо произвести в конструкторе класса
  }

  2. Написание модуля

  // без пространства имен

  ;( function () {

    var name        = 'module_1';
    var dependences = [
      'module_2'
      ...
    ];


    var some_private_function_for_this_module = function () {
      // some actions...
    };


    var module = new function () {

      this.some_public_function = function() {

      }
    };

    new Ofio.Module ( {
      name        : name,
      module      : module,
      dependences : dependences
    } );

  })();


  // с пространством имен

  ;( function () {

    var name        = 'module_2';
    var namespace   = 'ns';


    var some_private_function_for_this_module = function () {
      // some actions...
    };


    var module = new function () {

      this.some_public_function = function() {

      }
    };

    new Ofio.Module ( {
      name        : name,
      module      : module,
      dependences : dependences,
      namespace   : namespace
    } );

  })();


  3. Использование

  var impl = new YourClass();

  impl.some_public_function();    // from module_1
  impl.ns.some_public_function(); // from module_2

 */

;( function () {
  /*
    базывай класс Ofio для всех классов испоьлзующих фреймворк
  */

  function Ofio ( params ) {
    params = params || {};

    var new_class,                                        // здесь будет лежать прототип нашего нового класса
        extend    = function () {},                       // класс от которого наследуем, сначала - пустой
        className = params.className;

    if ( !className ) log( 'className is undefined' );

    if ( typeof params.extend == "function" ) {           // если будем наследовать

      extend.prototype        = params.extend.prototype;    // задаем прототип классу от которого будем наследовать
                                                          // равный прототипу базового класса, переданного в параметрах
                                                          // все это надо чтобы не выполнялся конструктор настоящего
                                                          // базового класса
      new_class               = new extend;                 // создаем экземпляр класса без конструктора
      new_class.__className   = className;                  // меняем classname у нового класса
      new_class.__constructor = window[ className ];

      var old__ofio = new_class.__ofio;
      new_class.__ofio = {
        modules     : {},
        namespaces  : old__ofio.namespaces.slice(0),
        ignoreNulls : old__ofio.ignoreNulls.slice(0).concat( params.ignoreNulls || [] )
      };

      for ( var module_name in old__ofio.modules ) {
        var module = old__ofio.modules[ module_name ];
        new_class.__ofio.modules[ module_name ] = module;
        module.OnInclude().call( new_class, new_class.__constructor );
      }


      new_class.extend = extend.prototype;                // создаем ссылку на базовый класс
    } else {
      new_class = this;                                   // если нет наследования, то в качестве базового класса
      Ofio.it.call( new_class, className, params.ignoreNulls );
    }

                                                          // проверяем не указано ли неправильное имя класса
                                                          // это может возникнуть из-за синтаксической ошибки или
                                                          // например после рафакторинга
    if ( typeof new_class.__constructor != 'function' )
      log( 'wrong className ' + new_class.__className );

    if ( params.feature_modules ) for ( var m = 0, m_ln = params.feature_modules.length; m < m_ln; m++ ) 
      if ( Ofio.modules[ params.feature_modules[ m ] ] ) params.modules.push( params.feature_modules[ m ] );

                                                          // выполняем подключение всех модулей к классу
    includeModules.call( new_class, params.modules || [] );
    return new_class;
  }

  /*
    функция добавляет стандартные методы и свойства Ofio создаваемому классу
   */
  Ofio.it = function ( className, ignoreNulls ) {
    this.__ofio = {                                       // единственный объект который пишется в прототип класса

      modules         : {},                               // сюда будут записываться модули подключенный к классу
                                                          // в виде { 'имя модуля' : ссылка на модуль }

      namespaces      : [],                               // массив пространств имен для подключаемых модулей, имеет
                                                          // вид [ 'название_пространства1', ... ]

      ignoreNulls     : ignoreNulls || []
    };

    this.__className    = className                         // имя создаваемого класса
    this.__constructor  = window[ className ];

    this.init         = Ofio.prototype.init;
    this.initVars     = function () {};                   // заглушки
    this.redefineVars = function () {};
  };


  Ofio.modules = {};                                      // сюда будут складываться при загрузки все доступные модули
                                                          // в виде { название_модуля : сам_модуль }

  /*
    функция для добавления модуля к списку существующих модулей, происходит во время загрузки страницы
    принимет объект типа Ofio.Module
  */
  Ofio.addModule = function( module ) {
    if ( !( module instanceof Ofio.Module ) ) {
      log( 'module not instance of Ofio.Module in Ofio.addModule' );
      return false;
    }

    this.modules[ module.name ] = module;
  };


  /*
    инициализация которая должна происходить для каждого класса наследуемого от Ofio
    если в классе или модуле есть своя функция инит она должна иметь вид как показано выше ( строка 29 )
  */
  Ofio.prototype.init = function ( params ) {
    for ( var module_name in this.__ofio.modules ) {
      this.__ofio.modules[ module_name ].applyNamespace( this );
    }

    runModulesMethod.call( this, 'initVars' );            // инициализируем переменные из всех модулей
    this.initVars();                                      // инициализируем переменные самого класса
    initParametrs.call( this, params );                   // присваиваем инициализационные параметры
    runModulesMethod.call( this, 'init' );                // выполняем инит для всех модулей
  };


  /////////////// PRIVATE ZONE////////////////////////

  /*
    определяем функцию логирования. Если доступна консоль, то выводим все в нее, если нет - используем alert
   */
  var log = function () {
    var params = [];
    for ( var a = 0, a_ln = arguments.length; a < a_ln; a++ ) {
      var arg = arguments[a];
      params.push( arg );
    }

    if ( typeof console == 'undefined' ) alert( params.join('') );
    else console.error.apply( console, params );
  };


  /*
    функция для подключения списка модулей, принимает массив имен подключаемых модулей
   */
  var includeModules = function ( modules ) {
    for ( var m = 0, m_ln = modules.length; m < m_ln; m++ ) {
      includeModule.call( this, modules[m] );
    }
  };


  /*
    функция для подключения модуля к классу
    String moduleName
   */
  var includeModule = function ( moduleName ) {
    var module = Ofio.modules[ moduleName ];                              // сначала надо проверить загружен ли модуль
                                                                          // который мы хотим подключить к классу
    if ( !module ) {
      log( 'Warning! Module "' + moduleName + '" does not exist' );
      return false;
    }

    if ( this.__ofio.modules[ module.name ] ) return false;               // потом проверить не подключен ли он уже
    this.__ofio.modules[ module.name ]  = module;                         // и записать информацию о его подключении

    includeModules.call( this, module.dependences );                      // проверяем зависимости модуля
                                                                          // и пытаемся их удовлетворить

    var moduleContent = module.Content();
    var namespace     = module.namespace;                                 // определяем пространство имен модуля
    if ( namespace && !this[ namespace ] ) {
      //this[ namespace ] = {};                                             // и создаем его если его нет
      this.__ofio.namespaces.push( namespace );                           // запоминаем существование этого
                                                                          // пространства в параметрах класса
    }
                                                                          // и если оно используется модулем
    for ( var methodName in moduleContent ) {                             // каждый метод модуля необходимо
      if ( methodName == 'init' || methodName == 'initVars' || methodName == 'redefineVars' ) continue;

      var method = moduleContent[ methodName ];
      if ( !method ) continue;

      if ( !namespace )                                                   // либо добавить к пространству имен
        this[ methodName ] = method;                                      // либо добавить в сам класс
    }

    module.OnInclude().call( this, this.__constructor );                               // context == prototype
  };


  /*
    функция для вызова метода во всех подключаемых модулях, используется для init, initVars и redefineVars
    если какая либо функция вернет результат отличный от false, вызов прекращается и возвращается этот результат
   */
  var runModulesMethod = function ( method, args ) {
    for ( var moduleName in this.__ofio.modules ) {
      var module = this.__ofio.modules[ moduleName ];
      var res = module.call( this, method, args );
      if ( res ) return res;
    }
  }


  /*
    функция для нахождения пространства имен в котором есть переменная.each Нужна чтобы правильно присвоить
    инициализационную переменную
  */
  var findNamespaceWithVar = function ( variable ) {
    if ( this[ variable ] !== undefined ) return this;

    for ( var n in this.__ofio.namespaces ) {
      var namespace = this[ this.__ofio.namespaces[n] ] || {};
      if ( namespace[ variable ] !== undefined ) return namespace;
    }
    return null;
  };


  /*
    функция для инициализации переданных классу параметров и распределение их по модулям и пространствам имен
  */
  var initParametrs = function ( params ) {
    inheritanceMethods.call( this, params );          // само присвоение
    checkVars.call( this );                           // проверка того как все прошло
    return true;
  };


  /*
    функция для импорта методов из модуля в сам класс
  */
  var inheritanceMethods = function ( params ) {
    for ( var variable in params ) {
      var varNameSpace = findNamespaceWithVar.call( this, variable );           // находим пространсво имен для
                                                                                // переменной
      if ( varNameSpace == null ) {                                             // если нет пространства значит
        log( "Попытка присваения необъявленной переменной " + variable );       // перменная нигдк не объявлена
        log( this.__className );
        continue;
      }

      if ( params[ variable ] === undefined )                                   // проверяем не сбрасывается ли
        log( variable + " сбрасывается в undefibed" );                          // переменннная в undefined

      varNameSpace[ variable ] = params[ variable ];                            // момент истины
    }
  };


  /*
    функция для проверки состояния переменных после их инициализации
  */
  var checkVars = function () {
    var namespaces = this.__ofio.namespaces;
    namespaces.push('this');                                                    // для удобства добавляем this
                                                                                // как пространство имен

    for ( var n = 0, n_ln = namespaces.length; n < n_ln; n++ ) {                // проверять будем во всех
      var namespace_name  = namespaces[n];
      var namespace       = namespace_name == 'this'
        ? this
        : this[ namespace_name ] || {};                                         // пространствах имен
      for ( var variable in namespace ) {
        
        if (                                                                    // если переменная осталась null
          namespace[ variable ] === null &&                                     // вызываем для нее redefineVars
          $.inArray( variable, this.__ofio.ignoreNulls ) == -1 &&
          !runModulesMethod.call( this, 'redefineVars', [ variable ] ) &&       // и если его нет или он вернул
          !this.redefineVars( variable )                                        // false то выдаем предупреждение
        ) log( variable + ( namespace_name == 'this' ? '' : ' in ' + namespace_name + " name space" ) + " is null" );

      }
    }

    namespaces.pop();                                                           // убираем this из пространств имен
  };

  window.Ofio = Ofio;                                       // добавляем ссылку на Ofio в глобальную область видимости

  ///////////////////////////////// Ofio.Module class ////////////////////////////////////

  Ofio.Module = function ( params ) {
    this.init( params );
  };


  var Module = Ofio.Module;
  Module.prototype = new Ofio({
    className : 'Ofio'                // грязный хак, ибо window[ 'Ofio.module' ] == undefined
  });                                 // наследуем от ofio


  Module.prototype.initVars = function () {
    this.name         = '';                                   // имя модуля
    this.dependences  = [];                                   // зависимости модуля
    this.module       = {};                                   // сам модуль, т е функции
    this.namespace    = '';                                   // пространство имен модуля
    this.onInclude    = function () {};                       // функция которая должна выполниться во время
                                                              // подключения модуля
    this.namespace_constructor = function( link_to_class ) {
      this.Class = link_to_class;
    };
  };


  Module.prototype.init = function ( params ) {
    this.constructor.prototype.init.call( this, params );
    if ( this.namespace ) this.namespace_constructor.prototype = this.module;
    this.constructor.addModule( this );                       // при инициализации добавляем его к списку
                                                              // существующих модулей
  };


  /////////////////////////// Ofio.Module getters /////////////////////////////

  Module.prototype.Content = function () {
    return this.module;
  };


  Module.prototype.OnInclude = function () {
    return typeof this.onInclude == "function" ? this.onInclude : function () {};
  };


  Module.prototype.applyNamespace = function ( obj ) {
    if ( this.namespace && !obj[ this.namespace ] ) obj[ this.namespace ] = new this.namespace_constructor( obj );
  };


  // функция вызова метода модуля не из класса
  Module.prototype.call = function ( proto, method, args ) {
    if ( typeof this.module[ method ] == 'function' )
      return this.module[ method ].apply( this.namespace ? proto[ this.namespace ] : proto, args || [] );
  };
})();