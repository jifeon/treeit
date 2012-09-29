var ActiveRecord = global.autodafe.db.ActiveRecord;

module.exports = Task.inherits( ActiveRecord );

function Task( params ) {
  this._init( params );
}


Task.prototype._init = function( params ){
  Task.parent._init.call(this, params);

  this._.client_parent_id.get = function( descripter ){
    return descripter.target.parent_id ? descripter.target.parent_id : "'life'";
  }
  this._.escape_text.get = function( text ){
  }

//  this._.client_ex_params.get = function( descripter ){
//    var r = descripter.target.ex_params ?
//      descripter.target.ex_params.replace( '&quot;', '/&quot;' ) : '{}';
//    return r;
//  }

}
//Task.prototype.get_ex_params = function(){
//  return this.ex_params ?
//    this.ex_params.replace( '/[^A-z0-9:"{}.]/', '' ) : '{}';
//}

Task.prototype.get_table_name = function(){
  return 'task';
}

Task.prototype.relations = function () {
  return {
    'subtask' : this.has_many( 'task' ).by( 'parent_id' ),
    'user'    : this.belongs_to( 'user').by( 'user_id' )
  }
};

Task.prototype.attributes = function(){
  return {
  text      : 'safe',
  user_id   : 'safe required',
  prev_id   : 'safe',
  next_id   : 'safe',
  parent_id : 'safe'
  }
}

Task.prototype.beforeSave = function() {
//    $is_json = json_decode( $this->ex_params );
//    if ( !$is_json ) $this->ex_params = '{}';
//    else {
//      $this->ex_params = preg_replace( '/[^A-z0-9:"{}.]/', '', $this->ex_params );
//    }
//    $this->date = new CDbExpression( 'NOW()' );
//    return true;
}



//Task.prototype.recursively_remove = function( id ) {
//  var listener = new global.autodafe.lib.Listener({}),
//      trash = [],
//      emitter = new Emitter,
//      self = this;
//  emitter
//  .on( 'not_end', function( ar ){
//    trash = trash.concat( ar );
//    //listener.stack <<= self.find_all( ' `parent_id` IN ('+ ar.join(',') + ')') ;
//    listener.stack <<= self.find_all_by_attributes({
//      parent_id : ar
//    }) ;
//    listener.success( function( tasks ){
//      if( tasks.length > 0 ){
//        var ar = [];
//        tasks.forEach( function( task ) { ar.push( task.id ) } )
//        emitter.emit( 'not_end', ar );
//      } else emitter.emit( 'end' )
//    })
//  })
//  .on( 'end', function(){
//      listener.stack <<= self.remove_all_by_attributes( {
//        id : trash
//      } );
//      listener.success( function(){
//        emitter.emit( 'success' );
//      })
//    })
//  emitter.emit( 'not_end', [ id ] );
//  return emitter;
//};