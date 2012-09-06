/**
 * jsPath должен выполнять следующие тесты со следующими результатами
 *
 */

function test() {

  var tests = {
    "key1"                                  : number,    // на число
    "key2"                                  : string,    // на строку
    "key3"                                  : bool1,     // на true
    "key4"                                  : bool2,     // false
    "key5[prop1]"                           : 'obj',     // наличие свойства
    "key5[prop1==5]"                        : 'obj',     // наличие своства равного числовому значению
    "key5[prop1==6]"                        : null,
    "key5[prop6==true]"                     : 'obj',
    "key5[prop6==false]"                    : null,
    "key5[prop7==true]"                     : null,
    "key5[prop7==false]"                    : 'obj',
    "key5[prop5=='str']"                    : 'obj',     // наличие своства равного строковому значению
    "key5[prop5=='str2']"                   : null,
    "key5[prop1<=5]"                        : 'obj',     // <=
    "key5[prop1<=6]"                        : 'obj',
    "key5[prop1<='str']"                    : null,
    "key5[prop1>=5]"                        : 'obj',     // >=
    "key5[prop1>=6]"                        : null,
    "key5[prop1<5]"                         : null,      // <
    "key5[prop1<6]"                         : 'obj',
    "key5[prop1>5]"                         : null,      // >
    "key5[prop1>6]"                         : null,
    "key5[prop1!=6]"                        : 'obj',     // !=
    "key5[prop1!=5]"                        : null,
    "key5[prop1==prop2]"                    : 'obj',     // равенство свойств
    "key5[prop1==prop3]"                    : null,
    "key5[prop1==prop4]"                    : null,      // равенство несуществующему свойству
    "key5[prop4==prop1]"                    : null,
    "key5[prop4==prop4]"                    : 'obj',
    "key5[prop1].prop5"                     : 'str',
    "key5[prop4].prop5"                     : null,
    "key5.prop1<6"                          : true,
    "key5.prop5=='str'"                     : true,
    "key5.prop5!='str'"                     : null,
    "key5.prop1"                            : 5,
    "key5.prop5"                            : "str",
    "key6.0"                                : 1,
    "key6.3"                                : 'obj',
    "key6.4"                                : 'array',
    "key6.5"                                : 'fun',
    "key6.5()"                              : bool2,
    "key7()"                                : 'number',
    "key8('str')"                           : 'str',
    "key8(5)"                               : 5,
    "key8(true)"                            : true,
    "key8(false)"                           : false,
    "key9(2,3)"                             : 5,
    "key9(2,'a')"                           : '2a',
    "key10.fun(par1[prop],par2)"            : 10,
    "key11.fun()[par1]"                     : 'obj',
    "key11.fun()[par2]"                     : null,
    "key5[prop1][prop2]"                    : 'obj',
    "key5[prop1][prop4][prop2]"             : null,
    "key12[fun()==5]"                       : 'obj',
    "key12[fun()==6]"                       : null,
    "key13[prop==.key2]"                    : 'array',
    "key14.fun()()"                         : string,
    "key15 = 7"                             : 7,
    "key15"                                 : 7,
    "key15 = nothing.f"                     : null,
    ".key15"                                : null,
    "key16[prop=3]"                         : 'obj',
    "key16.prop"                            : 3,
    "key17.fun(par='str')"                  : 'str',
    "key17.par"                             : 'str',
    "key18.fun()[key1=10]"                  : 'obj',
    "key8(.key1)"                           : 10,
    "key19[prop1<6].length"                 : 2,
    "key20[prop1!=5][prop2<12].0.fun()(5)"  : 5,
    "key8('.key8')"                         : '.key8',
    "key8('.key8(\\'123\\')')"                : '.key8(\'123\')',
    "key5['prop1']"                         : null,
    "key5.'prop1'"                          : null,
    "key8('\\'str')"                        : "'str",
    "key8('\\\\')"                          : "\\",
    "key8('\(')"                            : '(',
    "key8(.key8(4,2),5)"                    : 4,
    "key22[prop=15]"                        : 'array',
    "key9(.key22.0.prop,.key22.1.prop)"     : 30,
    "key23[prop1=9].prop2"                  : 7,
    "key8(.key23.prop1)"                    : 9,
    "key24()"                               : 0,
    "key25.fun()"                           : 2,
    "key25.fun(5)"                          : 2
  };

  var complete = 0;
  var error = 0;
  var testsCount = 0;

  console.log('tests');
  console.dir(tests);

  console.log('test obj');
  console.dir(jsPathTest);

  console.info('Start tests');
  var debug = true;
  for (var jsp in tests) {
    console.log('----------------', jsp, '-------------------');
    testsCount++;

    try {
//      if ( jsp == "key24()" ) debugger;
      var success = false;

      var result = jsPath(jsp, jsPathTest).value();
      var needRes = tests[jsp];
      switch (needRes) {
        case 'obj':
          success = (result instanceof Object) && !( result instanceof Array );

          break;

        case 'array':
          success = result instanceof Array;
          break;

        case 'fun':
          success = typeof result == "function";
          break;

        case 'number':
          success = typeof result == "number";
          break;

        default:
          if (needRes == result) success = true;

      }

      if (success) {
        console.info('test complete, result: ');
        console.log(result);
//        console.dir(result);
        complete++;
      } else throw 'res';
    } catch (e) {
      switch (e) {
        case 'res':
          console.error('result: ' + result + ' wanted result: ' + needRes);
          console.dir(result);
          break;

        default :
          console.error('Crash on test: ' + jsp + ' with message: ' + e.message);
          break;
      }

      if (debug)
        try {
          debug = false;
          debugger;
          jsPath(jsp, jsPathTest).value();
        } catch (e) {
        }
      error++;
      //			break;

    }

  }
  console.info('All tests: ', testsCount);
  console.info('Complete tests: ', complete);
  console.info('Error tests: ', error);
  console.info('Percent of success: ', Math.round(10000 * complete / testsCount) / 100, '%');
}
;

var number = 5;
var string = 'str';
var bool1 = true;
var bool2 = false;

var jsPathTest = {
  key1 : number,
  key2 : string,
  key3 : bool1,
  key4 : bool2,
  key5 : {
    prop1 : 5,
    prop2 : 5,
    prop3 : 6,
    //prop4 не существует
    prop5 : 'str',
    prop6 : true,
    prop7 : false
  },
  key6 : [ 1, 'str', true, {}, [], function () {
    return bool2;
  } ],
  key7 : function () {
    return number;
  },
  key8 : function (par) {
    return par;
  },
  key9 : function (par1, par2) {
    return par1 + par2;
  },
  key10 : {
    fun : function (p1, p2) {
      if (!( p1 instanceof Array )) return false;
      if (!p1.length) return false;
      return p1[0].val + p2;
    },
    par1 : [
      {
        val : 3
      },
      {
        prop : false,
        val  : 7
      }
    ],
    par2 : 3
  },
  key11 : {
    fun : function () {
      return {
        par1 : 5
      };
    }
  },
  key12 : {
    fun : function () {
      return 5;
    }
  },
  key13 : [
    {
      prop : string
    },
    {
      prop : 'arfgargerg'
    }
  ],
  key14 : {
    fun : function () {
      return function () {
        return string;
      };
    }
  },
  key15 : null,
  key16 : {
    prop : null
  },
  key17 : {
    fun : function (par) {
      return par;
    },
    par : null
  },
  key18 : {
    fun : function () {
      return jsPathTest;
    }
  },
  key19 : [
    {
      prop1 : 5,
      prop2 : 7
    },
    {
      prop1 : 8,
      prop2 : 16
    },
    {
      prop1 : 4,
      prop2 : 11
    }
  ],
  key20 : [
    {
      prop1 : 5,
      prop2 : 7
    },
    {
      prop1 : 4,
      prop2 : 11,
      fun : function () { return function (n) { return n; }; }
    },
    {
      prop1 : 8,
      prop2 : 16
    }
  ],
  key21 : [ 5, 6 ],
  key22 : [
    {
      prop : 5
    },
    {
      prop : 6
    }
  ],
  key23 : {
    prop1 : 6,
    prop2 : 7
  },
  key24 : function () {
    return arguments.length;
  },
  key25 :{
    puk : 2,
    fun : function () {
      return this.puk;
    }
  }
};