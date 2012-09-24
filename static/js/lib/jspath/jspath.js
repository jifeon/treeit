/**
 * Author: Balakirev Andrey <balakirev.andrey@gmail.com>
 *
 * jsPath - язык запросов к javascrip
 *
 * jsPath позволяет описать в виде строки запрос к javascript объекту, при это использовать свойства и методы
 * этого и его дочерних объектов.
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * условыные обозначения для этой инструкции:
 *
 * перед названием переменной всегда идет ее тип
 * в [] необезательные параметры
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * API:
 *
 *
 * для создания объекта jsPath необходимо:
 *
 * var jspObj = jsPath( String path[, Object object] );
 *
 * - path       выражение на языке jsPath
 * - object     ( необ. ) любой объект, с которым надо произвести манипуляции или считать свойства
 *              если объект не задан, то выражение просто скомпилируется и потом его можно быдут
 *              применить к любому объекту
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 * для того чтобы получить само значение:
 *
 * var value = jspObj.value( [ Object object ] );
 *
 * - object     ( необ. ) если объект был задан при инициализации, то просто вернется посчитанное значение.
 *              Если передан новый объект, то к нему применится скомпелированная схема
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 * если известно что значение является массивом, то с jspObj можно просто работать как с массивом, напрмер
 *
 * for ( var j = 0; j < jspObj.length; j++ ) {
 *    alert( jspObj[ j ] );
 * }
 *
 *
 * есть также функция each предназначенная для перебора элемнтов и применения к ним функции в таких случаях
 *
 * jspObj.each( function () {
 *    alert( this );    // this - это текущий элемент массива
 * } );
 *
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * Язык jsPath
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *    obj = {
 *      key1 : 5,
 *      key2 : 'string',
 *      key3 : false,
 *      key5 : {
 *        prop1 : 5,
 *        prop2 : 'str',
 *        prop3 : { prop4 : false }
 *      },
 *      key6 : [ 1, 'str', true, {}, [], function () { return bool2; } ],
 *    }
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 * 1. возвращение свойства объекта.
 *
 * jsPath( 'key1', obj ).value();     // вернет 5
 * jsPath( 'key2', obj ).value();     // вернет 'string'
 * jsPath( 'key3', obj ).value();     // вернет false
 *
 *
 * 2. получение свойства объекта делается через оператор . (точка)
 * Внимание! Для массивов это тоже справедливо
 *
 * jsPath( 'key5.prop1', obj ).value();       // вернет 5
 * jsPath( 'key5.prop2', obj ).value();       // вернет 'str'
 * jsPath( 'key5.prop3', obj ).value();       // вернет объект { prop4 : false }
 * jsPath( 'key5.prop3.prop4', obj ).value(); // вернет false
 * jsPath( 'key6.0', obj ).value();           // вернет 1
 *
 *
 * 3. оператор проверки условия []
 *
 * jsPath( 'key5[prop1]', obj ).value();       // вернет {
 *                                                         prop1 : 5,
 *                                                         prop2 : 'str',
 *                                                         prop3 : { prop4 : false }
 *                                                       }
 * так как у key5 есть свойство prop1
 *
 * jsPath( 'key5[prop4]', obj ).value();        // вернет null
 *
 * jsPath( 'key5[prop1].prop2', obj ).value();  // 'str'
 * jsPath( 'key5[prop4].prop2', obj ).value();  // null
 *
 *
 *
 * 4. поддерживаются операторы сравнения !=  ==  <  >  <=  >=
 *
 * jsPath( 'key5.prop1<6', obj ).value();         // true
 * jsPath( 'key5[prop1<6].prop2', obj ).value();  // 'str'
 * jsPath( 'key5[prop1>6]', obj ).value();        // null
 *
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *    obj = {
 *      key7 : [
 *        {
 *          prop1 : 5,
 *          prop2 : 7
 *        },
 *        {
 *          prop1 : 4,
 *          prop2 : 11
 *        },
 *        {
 *          prop1 : 8,
 *          prop2 : 16
 *        }
 *      ],
 *    }
 *
 *
 *
 * 5. Выборка из массива по условию с помощью []
 *
 * jsPath( 'key7[prop1<6].length', obj ).value();  // 2
 *
 * выбрались только элементы в который prop1 < 6, получился массив из 2 элементов
 *
 *
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 *
 *
 *
 *    obj = {
 *      key10 : {
 *        fun : function ( p1, p2 ) {
 *          return p1+p2;
 *        },
 *        par1 : [
 *          {
 *            val : 3
 *          },
 *          {
 *            prop : false,
 *            val  : 7
 *          }
 *        ],
 *        par2 : 3
 *      }
 *    }
 *
 * 6. Вызов функции при помощи ()
 *
 *  выбираем key10
 *            |
 *            |  выбираем функцию fun у key10, которая складывает 2 параметра
 *            |    |
 *            |    |  область видимости внутри функции - key10, так что спокойно выбираем par1
 *            |    |   |
 *            |    |   |
 *            |    |   |
 * jsPath( 'key10.fun(par1[prop].0.val,par2)', obj ).value();  // 7 + 3 = 10
 *                          |    |  |   |
 *                          |    |  |   |
 *                          |    |  |   |
 *    par1 это массив, делаем    |  |  par2 внутри key10 равен 3
 *  выборку элементов имеющих    |  |
 *              свойство prop    |  выбираем val у этого элемента, он равен 7
 *                               |
 *                              выбираем нулевой
 *                              элемент этого массива
 *                              получаем {
 *                                         prop : false,
 *                                         val  : 7
 *                                       }
 *
 *
 *
 *
 *
 *
 *
 *
 * 7. Для сравнивания или передачи параметра иногда приходится использовать строки. Для этого их необходимо
 * заключать в одинарные кавычки.
 *
 * obj = { fun : function ( par ) { return par; } }
 *
 * jsPath( "fun('str')", obj ).value();  // 'str'
 *
 *
 *
 *
 *
 *
 * 8. Оператор =
 *
 * используется как обычное присваивание.
 *
 * выражение key5[prop1=12].prop3
 * - выберет key5
 * - далее выполнится key5.prop1 = 12, и вернет присваиваемое значение
 * - условие внутри [] посчитается верным
 * - выберется key5.prop3
 *
 *
 *
 *
 * 9. Возможно делать неограниченное число проверок и вызовов функций. Т е выражение такого типа вполне справедливо:
 *
 *    obj = {
 *      key7 : [
 *        {
 *          prop1 : 5,
 *          prop2 : 7
 *        },
 *        {
 *          prop1 : 4,
 *          prop2 : 11,
 *          fun : function () { return function (n) { return n; } }
 *        },
 *        {
 *          prop1 : 8,
 *          prop2 : 16
 *        }
 *      ]
 *    }
 *
 *
 * key7[prop1!=5][prop2<12].0.fun()(5)
 *
 * - выбираем key7, это массив
 * - выбираем те его элементы у которых prop1 не равно 5
 * - из полученных результатов выбираем эелементы с prop2 меньше 12
 * - берем нулевой элемент из полученного массива
 * - находим в нем функцию fun и вызываем, он возвращает другую функцию
 * - вызываем новую функцию с параметром 5, и она его же и возвращает
 *
 *
 *
 *
 * 10. Внутри [] область видимости это элемент около которого стоят скобки.
 *     Внутри () область видимости это элемент у которого была вызвана функция
 *
 *
 *    key5[ тут доступ к свойствам и методам key5 ]
 *    key5.prop1.fun( тут доступ к свойствам и методам prop1 )
 *
 *
 *    чтобы обратиться к корневому эелементу надо использовать . (точка)
 *
 *    key5.prop1[.key5]
 *    key5.prop1.fun(.key5.prop1)
 */

;(function () {

  /*
   jsPath работает в 3 этапа

   1. Выражение парсится и превращается в особую структуру:

   this.struct = [
     {
       String value    : 'название узла,'
       Array  actions  : [          // действия которые надо сеовершить с узлом
         {
           String type  : 'condition' | 'inlineCondition' | 'function',  // пояснение для типов ниже
           Aray   nodes : [],                                            // массив подузлов, структура такая же
                                                                         // как у this.struct
           String sign  : '<' | '<=' | '>' | '>=' | '==' | '!=' | '='    // только для inlineCondition
         },
         ...
       ]
     },
     ...
   ]

   Типы действий:

   'condition' - возникает когда появляются [] для проверки условия, в nodes записывается результат работы
   функции parse для того что находится внутри []

   'inlineCondition' - используется для различного рода сравнений и присваивания, в нодес записывается parse
    от того что идет после знака, сам знак записывается в sign

    'function' - возникает при вызове функции, value у узла это имя функции, nodes это parse для того что
    внутри ()

  */

  function parse(jsp) {
    var nodes = [];                                           // возвращаемые узлы

    var node;                                                 // текущий узел, у которого заполняются свойства
    var bracketsStack = [];                                   // стек скобок для правилього вычисления строк внутри
                                                              // () и []

    function newNode() {                                      // создает новый текущий узел
      node = {
        value : '',
        actions : []
      };
    }

    function addNode() {                                      // добавляет текущий узел к результату
      node.value = node.value.replace(/\s/g, '');
      nodes.push(node);
    }

    newNode();                                                // сразу же создаем новый узел

    var stringMode = false;

    var letter, l = 0;
    while ( letter = jsp[l++] ) {                             // проходим по всему выражению
      var nextLetter = jsp[l];
      var sign = '';
      var condition = '';
      var str, action;

      if ( letter == "'" ) stringMode = !stringMode;
      else if ( stringMode && letter != '\\' ) {
        node.value += letter;
        continue;
      }

      switch (letter) {

        case '.':                                             // при встрече с точкой надо просто добавить новый узел
          addNode();
          newNode();
          break;


        case '[':                                             // встретили условие
          bracketsStack.push('[');
          str = getStrToClosedBracket(jsp, l, bracketsStack); // собираем строку до закрывающейся скобки
          if (str.bracketsConflict) return [];                // если со скобками что-то не так - выходим
          condition = str.value;
          l = str.count;                                      // добавляем к текущему счетчику длину подстроки

          action = {                                          // формируем и добавляем действие
            type : 'condition',
            nodes : parse( condition )
          };

          node.actions.push( action );
          break;


        case ']':                                             // условие закончилось
          var bracket = bracketsStack.pop();
          if (bracket != '[') return [];                      // проверяем скобки
          break;


        case '(':                                             // встретили вызов функции
          bracketsStack.push('(');
          str = getStrToClosedBracket(jsp, l, bracketsStack);
          if (str.bracketsConflict) return [];
          var args = str.commaSplit;
          l = str.count;
          var structArgs = [];
          for (var a = 0; a < args.length; a++) {
            structArgs.push(parse(args[a]));
          }

          action = {
            type : 'function',
            nodes : structArgs
          };

          node.actions.push(action);
          break;


        case ')':                                             // конец вызова функции
          var bracket = bracketsStack.pop();
          if (bracket != '(') return [];                      // сверяем скобки
          break;


        case '!':                                             // ! без просто буква, иначе знак
          if (nextLetter != '=') {
            node.value += letter;
            break;
          }
          sign = letter + '=';
        case '=':                                             // остальные знаки сравнения и присваивания
        case '<':
        case '>':
          if (!sign) {
            if (nextLetter == '=') sign = letter + '=';
            else sign = letter;
          }
                                                              // берем строку до закрывающейся скобки или до конца стр
          str = getStrToClosedBracket(jsp, l + sign.length - 1, bracketsStack);

          if (str.bracketsConflict) return [];
          condition = str.value;
          l = str.count;

          action = {                                          // добавляем действие
            type : 'inlineCondition',
            sign : sign,
            nodes : parse(condition)
          };

          node.actions.push(action);

          break;


        case '\\':
          node.value += nextLetter;
          l++;
          break;

        default : node.value += letter;                       // добавляем обычную букву
      }
    }

    if (node.value) addNode();                                // если текущий узел не пустой добавляем его

    return nodes;
  };


  /*

    функция получения строки до закрывающейся скобки
    String str            - строка из которой надо получить подстроку
    Number start          - номер символа с которого надо начинать набирать строку
    Array  bracketsStack  - массив скобок, берется последняя скобка

  */
  function getStrToClosedBracket( str, start, bracketsStack ) {
    var bracketsCount = 0;                                    // счетчик скобок такого же типа
    var bracketsDeep  = 0;
    var commaPosition = start;
    var letter;
    var bracket = bracketsStack[ bracketsStack.length - 1 ];  // открывающаяся скобка
    var closeBracket = ({                                     // закрывающаяся скобка
      '[' : ']',
      '(' : ')',
      '{' : '}'
    })[ bracket ];

    var result = {                                            // в результате
      value             : '',                                 // сама подстрока
      bracketsConflict  : true,                               // наличие конфликтов со скобками
      count             : start,                               // текущий номер глобального счетчика
      commaSplit        : []
    };

    var stringMode = false;

    getStr : while (letter = str[ result.count++ ]) {

      if ( letter == "'" ) stringMode = !stringMode;
      else if ( stringMode && letter != '\\' ) {
        result.value += letter;
        continue;
      }

      if ( /{|\(|\[/.test(letter) ) bracketsDeep++;
      if ( /}|\)|\]/.test(letter) ) bracketsDeep--;

      var substr;

      switch (letter) {
        case bracket:
          bracketsCount++;
          result.value += letter;
          break;

        case closeBracket:
          if (!bracketsCount) {                               // пришли к нужной закрывающей скобке
            result.bracketsConflict = false;
            break getStr;
          }
          bracketsCount--;
          result.value += letter;
          break;

        case '\\':
          result.value += letter;
          result.value += str[ result.count++ ];
          break;

        case ',':
          if ( !bracketsDeep ) {
            substr = str.substring( commaPosition, result.count-1 );
            if ( substr ) result.commaSplit.push( substr );   // пустые строки добовлять нельзя, чтобы правльно
                                                              // вызывалась функция без параметров
            commaPosition = result.count;
          }

        default : result.value += letter;
      }
    }
                                                              // если стек скобок был пустой то и конфликтов нет
    if (!bracketsStack.length) result.bracketsConflict = false;

    result.count--;                                           // по последней скобке хочет пройти
                                                              // и глобальный парсер тоже
    substr = str.substring( commaPosition, result.count );
    if ( substr ) result.commaSplit.push( substr );
    return result;
  }


  /*
    2. Второй этап это сборка алгоритма для выражения по его структуре. Алгоритм представляет из себя массив функций
    следующего вида:

    this.maked = [
      function ( Mixed obj, Array parents, Array nodesNames ) {},
      ...
    ];

    Mixed obj         - изначально это объект который передали jsPath, далее им становится результат выполнения
                        предыдущей функции в массиве.
    Array parents     - стек родителей, пополняется при вызове функции, вычислении условия или просто точке
    Array nodesNames  - стек имен узлов, поплняется в тех же случаях что и parents
  */

  function make( struct ) {
    var functions = [];

    for (var s = 0; s < struct.length; s++) {
      var node = struct[s];
                                                              // для каждого узла создаем нужные функции
      Array.prototype.push.apply(functions, makeFunctions( node ));
    }

    return functions;
  }


  /*
    функция для создания функций для узла
    принимает Object node
    возвращает Array [ Function, Function, ... ]
   */
  function makeFunctions( node ) {
    var functions = [];


    functions.push( function ( obj, parents, nodesNames ) {   // первая функция для получения самого узла
      var tmpObj = obj;
      if ( node.value == '' ) return parents[0];              // случай обращения к корневому объекту ex : .key8
      if ( obj && obj[ node.value ] !== undefined ) {
        obj = obj[ node.value ];                              // меняем obj
        nodesNames.push(node.value);                          // добавляем nodeName
        parents.push(tmpObj);                                 // добавляем родителя
        return obj;
      }
      return null;
    });


    for ( var a = 0; a < node.actions.length; a++ ) {         // далее составляем функции для действий над узлом

      var action = node.actions[a];
      switch (action.type) {


        case 'condition':                                     // проверка условия []
          (function () {

            var makedForCondition = make( action.nodes );     // собираем условие

            functions.push(function (obj, parents, nodesNames) {

              var result;
              if (obj instanceof Array) {                     // для массива необходимо выбрать все элементы по условию
                                                              // и вернуть массив
                parents.push(obj);                            // добавляем родителя
                result = [];
                var res = false;
                for (var o = 0; o < obj.length; o++) {
                                                              // для каждого объекта в массиве, запускаем выполнение
                                                              // по заранее собранной схеме
                  res = run( makedForCondition, obj[o], parents, nodesNames );
                  if (res !== null) result.push(obj[o]);
                }
                parents.pop();
                return result;

              } else {                                        // одиночный объект надо просто проверить и вернуть его
                                                              // если условие верно
                parents.push(obj);
                result = run(makedForCondition, obj, parents, nodesNames);
                parents.pop();
                return (result !== null) ? obj : null;

              }

            });
          })();

          break;



        case 'inlineCondition':                               // равенства, неравенства, присваивание
          if (!action.nodes.length) return null;

          (function () {
                                                              // делаем проверку аргумента на то является ли он простым
                                                              // значением ( см ниже )
            var simpleValue = checkSimpleValue(action.nodes[0]);

            switch (action.sign) {

              case '=':                                        // присваивание

                if (action.nodes.length == 1 && simpleValue.truth) {
                                                               // для простого выражения
                  functions.push(function(obj, parents, nodesNames) {
                    var parent = parents[ parents.length - 1 ];
                    var nodeName = nodesNames[ nodesNames.length - 1 ];
                    if (parent == null || nodeName == null) return null;
                    parent[ nodeName ] = simpleValue.val;
                    return parent[ nodeName ];
                  });
                } else {
                                                               // для выражения jsPath
                  var makedForCondition = make(action.nodes);
                  // check compiling
                  functions.push(function (obj, parents, nodesNames) {
                    var tmpObj = parents.pop();
                    var result = run(makedForCondition, tmpObj, parents, nodesNames);
                    parents.push(tmpObj);

                    var nodeName = nodesNames[ nodesNames.length - 1 ];
                    tmpObj[ nodeName ] = result;
                    return tmpObj[ nodeName ];
                  });

                }

                break;



              default:                                         // операции сравнения
                if (action.nodes.length == 1 && simpleValue.truth) {

                  functions.push(function (obj) {
                    var result;
                    try {
                      result = eval('obj' + action.sign + 'simpleValue.val') ? true : null;
                    } catch (e) {
                      result = null;
                    }
                    return result;
                  });

                } else {

                  var compiledForCondition = make(action.nodes);
                  // check compiling
                  functions.push(function (obj, parents, nodesNames) {
                    var tmpObj = parents.pop();
                    var result = run(compiledForCondition, tmpObj, parents, nodesNames);
                    parents.push(tmpObj);
                    try {
                      result = eval('result ' + action.sign + 'obj') ? true : null;
                    } catch (e) {
                      result = null;
                    }
                    return result;
                  });

                }
                break;

            }
          })();

          break;


        /*
          action : {
            type : 'function',
            nodes : [
              [ { value: '', nodes : [] }, ... ],             // разделенные запятой аргументы, которые являются
                                                              // массивом узлов
              ...
            ]
          }
         */
        case 'function':
          if ( !action.nodes.length ) {
                                                               // вызов функции без аргументов
            functions.push( function ( obj, parents ) {
              if ( typeof obj != "function" ) return null;
              obj = obj.call( parents[ parents.length - 1 ] );
              return ( obj == undefined ) ? null : obj;
            });

          } else {
                                                              // иначе аргументы надо собрать
            var fArgs = [];

            for ( var n = 0; n < action.nodes.length; n++ ) {
              var argument = action.nodes[ n ];

              if ( argument.length == 1 ) {
                var simpleValue = checkSimpleValue( argument[ 0 ] );
                if ( simpleValue.truth ) fArgs.push( simpleValue.val );
                else fArgs.push( make( argument ) );
              } else fArgs.push( make( argument ) );

            }

                                                                // аргументы собраны, можно вызывать функции
            functions.push( function ( obj, parents, nodesNames ) {
              if ( typeof obj != "function" ) return null;
              var args = [];
              for ( var f = 0; f < fArgs.length; f++ ) {
                var arg = fArgs[ f ];                           // необходимо найти значение аргументов
                if ( arg instanceof Array ) {
                  var tmpParent = parents.pop();
                  args.push( run( arg, tmpParent, parents, nodesNames ) );
                  parents.push( tmpParent );
                }
                else args.push(arg);
              }
                                                                // и передать в функцию
              obj = obj.apply( parents[ parents.length - 1 ], args );
              parents.pop();
              return ( obj == undefined ) ? null : obj;
            });

          }

          break;
      }

    }

    return functions;
  }

  /*
    функция проверки простого значения, принимает узел
    простыми значениями являются : число, чтрока в '', true, false
   */
  function checkSimpleValue(node) {
    var result = {
      truth : false,                                            // правда ли простое
      val   : null                                              // истинное значение
    };

    var val = node.value;
    if (isFinite(val)) {
      result.truth = true;
      result.val = Number(val);
    }
    else if (val == "true") {
      result.truth = true;
      result.val = true;
    }
    else if (val == "false") {
      result.truth = true;
      result.val = false;
    }
    else if (val[0] == "'" && val[ val.length - 1] == "'") {
      result.truth = true;
      result.val = val.substr(1, val.length - 2);
    }

    return result;
  }


  /*
    функция для выполнения собранного jsPath
   */
  function run( maked, obj, parents, nodesNames ) {
    for (var c = 0; c < maked.length; c++) {
      var func = maked[c];
      obj = func.call(this, obj, parents, nodesNames);
    }

    return obj;
  }

  /*
    сам класс jsPath
    String jsp    - запрос на языке jsPath
    Object object - объект над которым елаются трансформации
   */
  function jsPath(jsp, object) {

    if (!jsp || typeof jsp != "string") return false;
    this.jsp     = jsp;
    this.val     = null;
    this.maked   = null;
    this.rootObj = object;

    this.struct = parse(this.jsp);
    this.maked = make(this.struct);
    if ( this.rootObj !== undefined ) {
      this.run();
    }

  }

  /*
    чтобы можно было обращаться как с массивом
   */
  jsPath.prototype = new Array();

  /*
    функция находит результаты
   */
  jsPath.prototype.run = function ( object ) {
    if ( object != undefined ) this.rootObj = object;
    this.val = run.call(this, this.maked, this.rootObj, [ this.rootObj ], []);
    this.length = 0;
    if (this.val instanceof Array) {
      this.push.apply(this, this.val);
    }
    return this;
  };


  jsPath.prototype.value = function ( object ) {
    if ( object != undefined ) {
      this.run( object );
    }

    return this.val;
  };

  /*
    производит трансформации над каждым найденным елементом, если найден массив
   */
  jsPath.prototype.each = function ( fun ) {
    if ( typeof fun != "function" ) return false;

    for ( var j = 0, j_ln = this.length; j < j_ln; j++ ) {
      fun.call( this[j] );
    }
  };

  /*
    при вызове функции возвращается экземпляр класса
    в глобальную область видимости суем эту функцию
   */
  window.jsPath = function ( path, object ) {
    return new jsPath( path, object );
  };
})();