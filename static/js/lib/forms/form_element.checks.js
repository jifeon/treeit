;( function () {

  var name        = 'form_element.checks';
  var dependences = [
    'form_element',
    'ofio.logger'
  ];

  var email_regexp    = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  var latin_num_punto = /^[a-zA-Z0-9.,!\|?@#$%\^&*()\[\]{}_+-=~:;'"`<>\/\\]*$/;

  var standart_rule_types = new function () {
    this.email = function ( val ) {
      return email_regexp.test( val ) ? null : {
        message : 'Введенный e-mail имеет неправильный вид.',
        type    : 'error'
      };
    };


    this.required = function ( val ) {
      return val ? null : {
        message : "Поле '" + this.name + "' не должно быть пустым",
        type : 'error'
      };
    };


    this.len = function ( val, params ) {
      params = params || {};

      if ( !isNaN( params.min ) && val.length < params.min ) return {
        message : "Поле '" + this.name + "' должно содержать не менее " + params.min + ' символов',
        type    : 'error'
      }

      if ( !isNaN( params.max ) && val.length > params.max ) return {
        message : "Поле '" + this.name + "' должно содержать не более " + params.max + ' символов',
        type    : 'error'
      }

      return null;
    };


    this.latin_num_punto = function ( val ) {
      return latin_num_punto.test( val ) ? null : {
        message : "Поле '" + this.name + "' должно содержать только цифры, латинские буквы и знаки препинания",
        type    : 'error'
      }
    };
  };

  var module = new function () {

    this.initVars = function () {
      this.rules = {};
    };

    this.validate = function () {
      var messages = [],
          message;

      for ( var rule_name in this.rules ) {
        var rule = typeof this.rules[ rule_name ] == "function"
          ? this.rules[ rule_name ]
          : typeof standart_rule_types[ rule_name ] == "function"
            ? standart_rule_types[ rule_name ]
            : function () { return null; };

        if ( message = rule.call( this, this.get_value(), this.rules[ rule_name ] ) ) {
          messages.push( message );
          if ( message.type == 'error' ) break;
        }
      }

      return messages;
    };
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();