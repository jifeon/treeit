module.exports = Patch.inherits( global.autodafe.Component );

function Patch( params ){
  this._init( params );
}

Patch.prototype._init = function( params ){
  Patch.parent._init.call( this, params );
  this.CLIENT = 0;
  this.SERVER = 1;
  this.create     = params.create || {};
  this.update     = params.update || {};
  this.remove     = params.remove || [];
  this.index_type = params.index_type == undefined ?  this.SERVER : params.index_type;
}

//Patch.prototype.get_created = function() {
//  return this.create;
//}
//
//Patch.prototype.get_updated = function() {
//  return this.update;
//}
//
//Patch.prototype.get_removed = function() {
//  return this.remove;
//}

Patch.prototype.index_type_is = function( index_type ) {
  return index_type == this.index_type;
}

Patch.prototype.to_array = function() {
  return {
    create : Object.values( this.create ),
    update : Object.values( this.update ),
    remove : this.remove
  }
}

Patch.prototype.set_client_index = function() {
  this.index_type = this.CLIENT;
}

Patch.prototype._patch = function( patch ) {
  for( var serv_id in patch.create )
    this.create[ serv_id ] = patch.create[ serv_id ];

  for( var serv_id in patch.update )
    if( this.create[ serv_id ] ) this.create[ serv_id ] = patch.update[ serv_id ];
      else this.update[ serv_id ] = patch.update[ serv_id ];

  var self = this;

  patch.remove.forEach( function( serv_id ){
    delete self.create[ serv_id ];
    delete self.update[ serv_id ];
  })

  this.remove = this.remove.concat( patch.remove );

}

Patch.prototype.copy_from = function( patch ) {
  this.create = patch.create;
  this.update = patch.update;
  this.remove = patch.remove;
  this.index_type = patch.index_type_is( this.CLIENT ) ? this.CLIENT : this.SERVER;
}

Patch.prototype.diff = function( patch ) {
  var update = this.update;
  var remove = this.remove;

  if ( this.index_type_is( this.CLIENT ) && patch.index_type_is( this.SERVER ) ) {

    for ( var client_id in this.update ) {
      var serv_id = update[ client_id ].serv_id;
      if ( serv_id )
        if( patch.remove.indexOf( serv_id ) != -1 ) delete update[ serv_id ];
    }

    patch.remove.forEach( function( serv_id ){
      remove.splice( remove.indexOf( serv_id ) ,1 ) ;
    })
  } else
      if( this.index_type_is( this.SERVER ) && patch.index_type_is( this.CLIENT ) ){
        patch.set_server_index( false );
        for( var serv_id in patch.create )
          update[ serv_id ] = patch.create[ serv_id ];

        for( var serv_id in patch.update )
          delete update[ serv_id ];

      patch.remove.forEach( function( serv_id ){
        remove.splice( remove.indexOf( serv_id),1 ) ;
        delete update[ serv_id ];
      })
  }
  return new Patch( {
    create    : this.create,
    update    : update,
    remove    : remove,
    index_type : this.index_type,
    name      : 'patch',
    app       : this.app
  });
}

Patch.prototype.get_task_by_attribute = function( array, attr, value ){
  var tasks = this[ array ];
  for( var task in tasks )
    if( tasks[ task ][ attr ] == value ) return tasks[ task ];
}
