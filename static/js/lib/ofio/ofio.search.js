( function () {

  var name        = 'ofio.search';
  var dependences = [
    'ofio.id',
    'ofio.event_emitter',
    'ofio.utils'
  ];

  var globalIndex = {
    id : {}
  };
  var groupIndex = {};

  var module = new function () {

    this.initVars = function () {
      if ( !( this.indexBy instanceof Object ) ) this.indexBy    = {};           // заменить в классе
      this.indexGroup = '';
    };


    this.init = function () {
      globalIndex.id[ this.id ] = this;
      this.classIndex.id[ this.id ] = this;

      for ( var jsp in this.indexBy ) {
        var indexOptions = this.indexBy[ jsp ];
        var val = jsPath( jsp, this ).value();

        if ( indexOptions.type == 'number' ) {
          if ( indexOptions.range ) {
            var range = this.utils.toInt( indexOptions.range, 1 );
            if ( range ) val = Math.round( val / range );
          }
        }

        if ( !this.classIndex[ jsp ] )        this.classIndex[ jsp ]        = {};
        if ( !this.classIndex[ jsp ][ val ] ) this.classIndex[ jsp ][ val ] = [];
        this.classIndex[ jsp ][ val ].push( this );

        if ( !this.indexGroup ) continue;
        if ( !groupIndex[ this.indexGroup ] ) groupIndex[ this.indexGroup ] = {};
        var grInd = groupIndex[ this.indexGroup ];
        if ( !grInd[ jsp ] )        grInd[ jsp ]        = {};
        if ( !grInd[ jsp ][ val ] ) grInd[ jsp ][ val ] = [];
        grInd[ jsp ][ val ].push( this );
      }
    };


    this.getById = function ( id ) {
      return this.classIndex.id[ id ] || null;
    };


    this.search = function ( jsp, val, index ) {
      if ( index == "global" ) index = globalIndex;
      else if ( groupIndex[ index ] ) index = groupIndex[ index ];
      else index = this.classIndex;

      var byJsp = index[ jsp ];
      if ( !byJsp ) return [];

      var byVal = byJsp[ val ];
      return byVal ? byVal : [];
    };


    this.similar = function ( jsp, val, index, direct ) {

      if ( index == "global" ) index = globalIndex;
      else if ( groupIndex[ index ] ) index = groupIndex[ index ];
      else index = this.classIndex;

      var byJsp = index[ jsp ];
      if ( !byJsp ) return [];

      var byVal = byJsp[ val ];
      if ( byVal && byVal.length ) return byVal;

      var checker, near = null;

      switch ( direct ) {
        case 'left':
          checker = function ( x ) { return near == null ? x < val : x < val && x > near; };
          break;

        case 'right':
          checker = function ( x ) { return near == null ? x > val : x > val && x < near; };
          break;

        case 'both':
        default:
          checker = function ( x ) { return near == null ? true : Math.abs( near - val ) > Math.abs( x - val ); };
      }


      for ( var v in byJsp ) {
        if ( checker( v ) ) near = v;
      }

      return near == null ? [] : byJsp[ near ];
    };


    this.search_intersection = function ( params, searchType, index ) {
      if ( searchType != 'search' && searchType != 'similar' ) searchType = 'search';

      var result = {};
      var first = true;
      for ( var jsp in params ) {
        var valObj = params[ jsp ];
        var val = valObj.val;
        var elements = this[ searchType ]( jsp, val, index, valObj.direct );
        if ( !elements.length ) return [];

        var result_intersect = {};
        for ( var e = 0, e_ln = elements.length; e < e_ln; e++ ) {
          var element = elements[ e ];

          if ( result[ element.id ] || first ) result_intersect[ element.id ] = result;
        }

        first = false;
        result = result_intersect;
      }

      return result;
    };

  };

  var onInclude = function ( clazz ) {
    this.classIndex = {
      id : {}
    };

    if ( clazz ) {
      clazz.getById = function ( id ) {
        return clazz.prototype.getById( id );
      }
    }
  };

  new Ofio.Module( {
    name        : name,
    module      : module,
    dependences : dependences,
    onInclude   : onInclude
  } );

})();