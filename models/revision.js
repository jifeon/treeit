var ActiveRecord = global.autodafe.db.ActiveRecord;
module.exports = Revision.inherits( ActiveRecord );

function Revision( params ) {
  this._init( params );
}

Revision.prototype.get_table_name = function(){
  return 'revisions';
}

Revision.prototype.relations = function () {
  return {
    'user' : this.belongs_to( 'user').by( 'user_id' )
  }
}