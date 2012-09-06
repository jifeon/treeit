;( function () {

  var name        = 'todo_page.menu';
  var dependences = [
    'ofio.ajax'
  ];

  var module = new function () {

    this.initVars = function () {
      this.mess_to_author = {
        start_link : $('#i_am_smart'),
        content    : $('#mess_to_author')
      }

      this.mess_to_author.send_link = $('#send_message_link');
      this.mess_to_author.text = this.mess_to_author.content.find('textarea');
      this.mess_to_author.type = this.mess_to_author.content.find('select');

      this.message_send_url = null;


      this.donate = {
        start_link  : $('#donate'),
        content     : $('#donate_content')
      }

      this.force_save = {
        link        : $('#force_save'),
        proc        : $('#force_save_proc')
      }
    }

    this.init_menu = function () {
      var self = this;

      this.mess_to_author.start_link.click( function() {
        self.show_send_message_popup();
      });

      this.mess_to_author.send_link.click( function () {
        self.send_message();
      } );

      this.donate.start_link.click( function() {
        self.show_donate_message();
      });

      this.force_save.link.click( function() {
        self.history_save();
      } );

      this.addFunctionToTrigger( 'page.history_save.start', function () {
        self.force_save.link.hide();
        self.force_save.proc.show();
      } );

      this.addFunctionToTrigger( 'page.history_save.complete', function () {
        self.force_save.link.show();
        self.force_save.proc.hide();
      } );
    };


    this.show_send_message_popup = function () {
      this.popups.add_messages( [
        {
          message : this.mess_to_author.content,
          type    : 'info',
          width   : 400
        }
      ], true );
    };


    this.send_message = function () {
      this.ajax( this.message_send_url, {
        'text' : this.mess_to_author.text.val(),
        'type' : this.mess_to_author.type.val()
      });

      this.mess_to_author.text.val('');
      this.popups.add_messages( [ "Спасибо!" ], true );
    };


    this.show_donate_message = function() {
      this.popups.add_messages( [
        {
          message : this.donate.content,
          type    : 'info',
          width   : 340
        }
      ], true );
    };
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();