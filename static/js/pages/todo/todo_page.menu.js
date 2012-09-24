;( function () {

  var name        = 'todo_page.menu';
  var dependences = [
    'ofio.ajax'
  ];

  var module = new function () {

    this.initVars = function () {
      this.force_save = {
        link        : $('#force_save'),
        proc        : $('#force_save_proc')
      }

      this.settings_link  = $('#settings_link');
      this.help_link      = $('#help');
    }

    this.init = function () {
      var self = this;

      this.force_save.link.click( function() {
        self.Class.history_save();
      } );

      this.Class.on( 'history_save.start', function () {
        self.force_save.link.hide();
        self.force_save.proc.show();
      } );

      this.Class.on( 'history_save.complete', function () {
        self.force_save.link.show();
        self.force_save.proc.hide();
      } );

      this.settings_link.click( function() {
        self.Class.settings.show();
      } );

      var help_popup = new PopupWindow({
        $ : $('#help_popup')
      });

      this.help_link.click( function() {
        help_popup.show();
      } );
    };
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences,
    namespace   : 'menu'
  } );

})();