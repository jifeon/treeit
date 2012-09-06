;( function () {

  var name        = 'ofio.ajax';
  var dependences = [
    'ofio.logger',
    'ofio.triggers'
  ];



  var module = new function () {

    this.ajax = function ( url, params, callback ) {
      callback = typeof callback == 'function' ? callback : function () {};

      var messages, self = this;
      $.ajax({
        url       : url,
        data      : params,
        type      : 'POST',
        error     : function ( xhr, status ) {
          var err_msg;

          switch ( status ) {
            case 'timeout':
              err_msg = 'Timeout';
              break;

            case 'notmodified':
              err_msg = 'Not modified';
              break;

            case 'parsererror':
              err_msg = 'Parser error';
              break;

            case 'error':
            default:
              err_msg = 'Unknown error';
              break;
          }

          messages = {
            errors : [
              {
                type     : 'server',
                content  : err_msg
              }
            ]
          };

          self.runTrigger( 'ofio.ajax.error', [ messages ] );
          callback( null, messages );
        },

        success   : function ( data ) {
          if ( !data || data.yii != 'ok' ) {
            messages = {
              errors : [{
                type    : 'server',
                content : 'Unknown data type in request'
              }]
            };

            self.runTrigger( 'ofio.ajax.error', [ messages ] );
            callback( null, messages );
          }
          else {
            self.runTrigger( 'ofio.ajax.success', [ data.messages ] );
            callback( data.data, data.messages );
          }
        },

        dataType : 'json'
      })
    };

    this.sjax = function ( url, params ) {
      var self = this;

      var data = $.ajax({
        url       : url,
        async     : false,
        data      : params,
        error     : function () {
          var messages = {
            errors : [{
              type     : 'server',
              content  : 'Unknown error'
            }]
          };

          self.runTrigger( 'ofio.ajax.error', [ messages ] );
        }
      }).responseText;

      var unknown_data = false;

      try {
        eval( "data = " + data );
      } catch ( e ) {
        unknown_data = true;
      }

      if ( unknown_data || !data || data.yii != 'ok' ) {
        var messages = {
          errors : [
            {
              type     : 'server',
              content  : 'Unknown data type in request'
            }
          ]
        };

        self.runTrigger( 'ofio.ajax.error', [ messages ] );
        return null;
      }

      self.runTrigger( 'ofio.ajax.success', [ data.messages ] );
      return data.data;
    }
  };


  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();