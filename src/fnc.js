var isArray = Array.isArray;

var isObject = function(o){
  return o && !isArray(o) && typeof o === "object";
}

var each = function(f, o){
  if(isArray(o)){
    o.forEach(f);
  }
  else if(isObject(o)){
    for(var k in o)
      if(o.hasOwnProperty(k))
        f.call(null, o[k])
  }
  return null;
}

var map = function(f, o){
  if(isArray(o) || isObject(o)){
    var a = [];
    each(function(e){ a.push(f(e)); }, o);
    return a;
  }
  else {
    return null;
  }
};

module.exports = {
	map: map
};
