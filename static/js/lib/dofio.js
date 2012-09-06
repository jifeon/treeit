var _ = new function() {

  var dom_stub = new function() {
    
  }

  var obj = function ( params ) {
    this.ob = params.ob;
  }

  obj.prototype.hide = function () {
    this.ob.style.display = "none";
  }

  obj.prototype.show = function () {
    this.ob.style.display = "";
  }

  this.id = function( id ) {
    return new obj({
      ob : document.getElementById( id ) || dom_stub
    });
  }


}