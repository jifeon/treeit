var Patch   = require('../components/patch');
var DBPatch = require('../components/patch');

module.exports = RevisionPatch.inherits( Patch );

function RevisionPatch( params ){
  this._init( params );
}

RevisionPatch.prototype._init = function( params ){

  RevisionPatch.parent._init.call( this, params );
  if( params && params.revisions )
    params.revisions.forEach( function( revision ){
      var revision_patch = new DBPatch( {
        actions : revision.actions,
        app     : params.app,
        name    : 'dbpatch'
      } );
      this._patch( revision_patch );
    } )
}
