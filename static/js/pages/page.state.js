;( function () {

  var name        = 'page.state';
  var dependences = [
    'ofio.utils',
    'ofio.event_emitter'
  ];

  var module = new function () {

    this.initVars = function () {
      this.state  = 0;
      this.STATE  = {};
    };


    this.init = function () {

    };


    this.add_state = function ( state ) {
      this.state = this.state | this.utils.toInt( state );
      this.emit( 'add_state', state );
    };


    this.remove_state = function ( state ) {
      this.state = this.state & ~this.utils.toInt( state );
      this.emit( 'remove_state', state );
    };


    this.check_state = function ( state ) {
      if ( !( state instanceof Array ) ) state = [ state ];
      var check = false;
      for ( var s = 0, s_ln = state.length; s < s_ln; s++ ) {
        check = check || ( this.state == ( this.state | this.utils.toInt( state[ s ] ) ) );
        if ( check ) return true;
      }
      return false;
    };
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();