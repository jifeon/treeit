;( function () {

  var name        = 'todo_page.hotkeys';
  var dependences = [
    'todo_page.state',
    'page.hotkeys'
  ];

  var module = new function () {

    this.initVars = function () {
      var self = this;

      this.caret_position = 0;

      this.hotkeys = [
        {
          elem : document,
          hk : {
            'esc'     : {
              action  : 'esc_key',
              hint    : function() {
                return self.check_state( this.STATE.SHOWN_POPUP_WINDOW ) ? 'закрыть окно' : 'отменить перемещение';
              },
              state   : [ this.STATE.DRAGNDROP_PROCESSING, this.STATE.SHOWN_POPUP_WINDOW ]
            }
          }
        },
        {
          elem : document.body,
          hk : {
            'ctrl+b'  : {
              action  : 'create_list',
              hint    : 'создать список',
              state   : this.STATE.BLANK
            },
            'ctrl+l'  : {
              action  : 'clean_item',
              hint    : 'почистить подзадачи',
              state   : this.STATE.TODO_BLOCK_FOCUSED
            },
            'ctrl+shift+l'  : {
              action  : 'clean_lists',
              hint    : 'почистить все списки',
              state   : this.STATE.BLANK
            },
            'ctrl+d'  : {
              action  : 'done',
              hint    : function () {
                var view = self.get_focused_view();
                if ( !view ) return 'завершить задачу';

                return view.model.is_done() ? 'отменить завершение' : 'завершить задачу';
              },
              state   : this.STATE.TODO_BLOCK_FOCUSED
            },
            'ctrl+m' : {
              action  : 'message_next',
              hint    : 'седующее сообщение',
              state   : this.STATE.SHOWN_POPUP_HAS_MANY_MESSAGES
            },
            'ctrl+shift+m'  : {
              action  : 'message_prev',
              hint    : 'предыдущее сообщение',
              state   : this.STATE.SHOWN_POPUP_HAS_MANY_MESSAGES
            },
            'ctrl+h'  : {
              action  : 'close_popups',
              hint    : 'закрыть попап',
              state   : this.STATE.SHOWN_POPUP
            }
          }
        },
        {
          elem  : document.getElementById('content'),
          hk    : {
            'ctrl+down'  : {
              action  : 'expand_collapse_item',
              hint    : function () {
                var view = self.get_focused_view();
                if ( !view ) return 'свернуть подзадачи';
                return view.is_collapsed() ? 'развернуть подзадачи' : 'свернуть подзадачи';
              },
              state   : [ this.STATE.TODO_EXPANDED_TASK_FOCUSED, self.STATE.TODO_BLOCK_TITLE_FOCUSED ]
            },
            'ctrl+up'  : {
              action  : 'expand_collapse_item',
              state   : [ this.STATE.TODO_EXPANDED_TASK_FOCUSED, self.STATE.TODO_BLOCK_TITLE_FOCUSED ]
            },
            'alt++'  : {
              action  : 'new_item',
              hint    : 'создать подзадачу',
              state   : this.STATE.TODO_BLOCK_FOCUSED
            },
            'alt+-'  : {
              action  : 'remove_item',
              hint    : 'удалить запись',
              state   : this.STATE.TODO_BLOCK_FOCUSED
            },
            'down'    : {
              action  : 'focus_down',
              state   : this.STATE.TODO_BLOCK_FOCUSED
            },
            'up'    : {
              action  : 'focus_up',
              state   : this.STATE.TODO_BLOCK_FOCUSED
            },
            'return' : {
              action  : 'enter_key',
              hint    : 'новая задача',
              state   : this.STATE.TODO_BLOCK_FOCUSED
            },
            'del'   : {                               // перестает работать точка
              action  : 'delete_key',
              state   : this.STATE.TODO_TASK_FOCUSED
            },
            // TODO: вернуть backspace
            'backspace'  : {                          // перестает работать сам бекспэйс
              action  : 'backspace_key',
              state   : this.STATE.TODO_TASK_FOCUSED
            },
            'ctrl+right' : {
              action  : 'next_block',
              hint    : 'следующий блок',
              state   : this.STATE.TODO_BLOCK_FOCUSED
            },
            'ctrl+left' : {
              action  : 'prev_block',
              hint    : 'предыдущий блок',
              state   : this.STATE.TODO_BLOCK_FOCUSED
            },
            'ctrl+shift+down' : {
              action  : 'move_down',
              hint    : 'переместить таск вниз',
              state   : this.STATE.TODO_BLOCK_FOCUSED
            },
            'ctrl+shift+up' : {
              action  : 'move_up',
              hint    : 'переместить таск вверх',
              state   : this.STATE.TODO_BLOCK_FOCUSED
            },
            'tab' : {
              action  : 'move_inside',
              hint    : function () {
                var view = self.get_focused_view();
                if ( !view || view.model.is_first() ) return false;
                return 'переместить вглубь';
              },
              state   : this.STATE.TODO_TASK_FOCUSED
            },
            'shift+tab' : {
              action  : 'move_outside',
              hint    : function () {
                var view = self.get_focused_view();
                if ( !view || view.model.get_level() <= 2 ) return false;
                return 'на родительский уровень';
              },
              state   : this.STATE.TODO_TASK_FOCUSED
            }
          }
        }
      ];


      this.hotkey_actions = new function () {
        this.message_next = function () {
          self.popups.next_message();
          return false;
        };

        this.message_prev = function () {
          self.popups.prev_message();
          return false;
        };

        this.close_popups = function () {
          self.popups.close();
          return false;
        };

        this.create_list = function () {
          self.create_list();
          return false;
        };

        this.clean_lists = function () {
          self.clean_lists();
          return false;
        };

        this.done = function () {
          var view = self.get_focused_view();
          if ( !view ) return false;

          view.before_set_done( !view.model.is_done() );
          return false;
        };

        this.expand_collapse_item = function () {
          var view = self.get_focused_view();
          if ( !view ) return false;

          view.model.set_ex_param( 'collapsed', !view.is_collapsed() );
          return false;
        };

        this.new_item = function () {
          var view = self.get_focused_view();
          if ( !view ) return false;

          var error = view.create_subtask_model();
          return false;
        };

        this.remove_item = function () {
          var view = self.get_focused_view();
          if ( !view ) return false;

          view.model.remove();
          return false;
        };

        this.clean_item = function () {
          var view = self.get_focused_view();
          if ( !view ) return false;

          view.model.clean();
          return false;
        };

        this.focus_up = function () {
          var view = self.get_focused_view();
          if ( !view ) {
            this.caret_position = null;
            return true;
          }

          if (
            view.__className == 'TodoBlock' ||
            view.elements.title.get_lines_count() == 1
          ) {
            view.focus_up();
            this.caret_position = null;
            return false;
          }

          this.caret_position = view.get_caret_pos();
        };

        this.focus_down = function () {
          var view = self.get_focused_view();
          if ( !view ) {
            this.caret_position = null;
            return true;
          }

          if (
            view.__className == 'TodoBlock' ||
            view.elements.title.get_lines_count() == 1
          ) {
            view.focus_down();
            this.caret_position = null;
            return false;
          }

          this.caret_position = view.get_caret_pos();
        };

        this.enter_key = function () {
          var view = self.get_focused_view();
          if ( !view ) return false;

          view.create_sibling();
          return false;
        };

        this.delete_key = function() {
          var view = self.get_focused_view();
          if ( !view || view.get_title().length || view.model.has_subtasks() ) return true;

          self.hotkey_actions.focus_down();

          view.model.remove();
          return false;
        };

        this.backspace_key = function() {
          var view = self.get_focused_view();
          if ( !view || view.get_title().length || view.model.has_subtasks() ) return true;

          self.hotkey_actions.focus_up();

          view.model.remove();
          return false;
        };

        this.move_down = function() {
          var view = self.get_focused_view();
          if ( !view ) return false;

          view.move_down();
          return false;
        }

        this.move_up = function() {
          var view = self.get_focused_view();
          if ( !view ) return false;

          view.move_up();
          return false;
        }

        this.prev_block = function() {
          var block = self.get_focused_block();
          if ( !block ) return false;

          block.focus_prev();
          return false;
        };

        this.next_block = function() {
          var block = self.get_focused_block();
          if ( !block ) return false;

          block.focus_next();
          return false;
        };

        this.move_inside = function() {
          var view = self.get_focused_view();
          if ( !view ) return false;

          view.move_inside();
          return false;
        };

        this.move_outside = function() {
          var view = self.get_focused_view();
          if ( !view ) return false;

          view.move_outside();
          return false;
        };

        this.esc_key = function() {
          if ( self.has_feature( 'dragndrop' ) ) self.feature_dragndrop.stop_drag();

          if ( PopupWindow.current_popup ) PopupWindow.current_popup.hide();
        };
      };
    };


    this.init = function () {
      var self = this;

      this.on( 'keyup', function( hotkey ) {
        switch ( hotkey ) {
          case 'down':
            if ( self.caret_position == null ) return false;

            var view = self.get_focused_view();
            if ( !view ) return false;

            var caret_pos = view.get_caret_pos();
            if (
              self.caret_position == caret_pos ||
              view.elements.title.$ && caret_pos == view.elements.title.$[0].textLength
            ) view.focus_down();
            break;

          case 'up':
            if ( self.caret_position == null ) return false;

            var view = self.get_focused_view();
            if ( !view ) return false;

            var caret_pos = view.get_caret_pos();
            if (
              self.caret_position == caret_pos //||
//              view.elements.title.$ && caret_pos == 0
            ) view.focus_up();
            break;
        }
      } );
    };
  };

  new Ofio.Module ( {
    name        : name,
    module      : module,
    dependences : dependences
  } );

})();