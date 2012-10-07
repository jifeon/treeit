module.exports = Site.inherits( require('./base') );

function Site( params ) {
  this._init( params );
}


Site.prototype._init = function( params ){
  Site.parent._init.call( this, params );

  this.views_folder = 'html/site';

  this.behavior_for( 'not_valid', this.validation_error );
}


Site.prototype.validation_error = function( response, request, errors ){
  response.merge_params({ errors : {
    reg : errors
  }});

  this.action( 'index', response, request);
}


//Site.prototype.global_view_params = function( response, request ){
//
//  var ui = this.app.users.get_by_client( request.client );
//
//  return {
//    user : ui && ui.model
//  }
//};

Site.prototype.connect_client = function ( client ){
  return this.app.users.login_by_cookie( client );
};


Site.prototype.index = function ( response, request ) {
  if( request.user.is_authorized() ) response.send({
    user :   this.models.user.With( 'tasks' ).find_by_pk( request.user.model.id )
  });

  else response.view_name( "auth" ).send();
};