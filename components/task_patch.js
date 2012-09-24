var Patch = require('../components/patch');
module.exports = TasksPatch.inherits( Patch );

function TasksPatch( params ){
  this._init( params );
}

TasksPatch.prototype._init = function( params ){
  TasksPatch.parent._init.call( this, params );
  for( var task in params.tasks )
    this.create[ task ] = {
      serv_id         : params.tasks[ task ].id,
      text            : params.tasks[ task ].text,
      done            : params.tasks[ task ].done,
      prev_serv_id    : params.tasks[ task ].prev_id,
      next_serv_id    : params.tasks[ task ].next_id,
      parent_serv_id  : params.tasks[ task ].parent_id,
      ex_params       : params.tasks[ task ].ex_params
    }
}