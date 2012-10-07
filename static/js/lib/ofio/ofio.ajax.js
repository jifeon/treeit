;( function () {

  var name        = 'ofio.ajax';
  var dependencies = [
    'ofio.logger',
    'ofio.event_emitter'
  ];

  var module = new function () {

    this.ajax = function ( url, params, callback ) {
      callback = typeof callback == 'function' ? callback : function () {};

      var messages, self = this;
      $.ajax({
        url       : url,
        data      : params,
        type      : 'POST',
        error     : function ( xhr, status, e ) {
          self.log( e );
          self.emit( 'ofio.ajax.error', e );
          callback( new Error('Server error, please reload the page'));
        },

        success   : function ( data ) {
          if ( !data || data.error ) {
            var e = data ? data.error : 'Server error, please reload the page';
            self.emit( 'ofio.ajax.error', e );
            callback( e );
          }
          else {
            self.emit( 'ofio.ajax.success', data.result );
            callback( null, data.result );
          }
        },

        dataType : 'json'
      })
    };
  };


  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependencies
  } );

})();