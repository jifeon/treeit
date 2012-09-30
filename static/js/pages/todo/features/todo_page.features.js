;( function () {

  var name        = 'todo_page.features';
  var dependences = [
  ];

  var module = new function () {

    this.initVars = function() {
      this.features   = {};
      this.__features = [];
    }

    this.init_features = function() {
      for ( var feature_name in this.features ) {
        this.__features.push( feature_name.toLowerCase() );
      }

      this.elements.content.addClass( this.__features.join(' ') );
    };

    this.has_feature = function( feature_name ) {
      return this.features[ feature_name.toUpperCase() ];
    };
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();