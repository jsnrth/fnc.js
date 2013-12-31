var map = function(f, o){
  if(o && Array.isArray(o)){
    var newO = [];
    o.forEach(function(e){
      newO.push(f(e));
    });
    return newO;
  }
  else if(o && typeof o === "object") {
    var arr = [];
    for(var k in o)
      if(o.hasOwnProperty(k))
        arr.push(o[k]);
    return map(f, arr);
  }
  else {
    return null;
  }
};

module.exports = {
	map: map
};
