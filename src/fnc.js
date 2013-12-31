var isArray = Array.isArray;

var isObject = function(o){
  return o && !isArray(o) && typeof o === "object";
};

var each = function(f, o){
  if(isArray(o)){
    o.forEach(f);
  }
  else if(isArray(o) || isObject(o)){
    var fn = function(k){ f.apply(null, [o[k]]); };
    return each(fn, Object.keys(o));
  }
  else if(typeof o === "undefined"){
    return function(o2){
      return each(f, o2);
    }
  }
};

var eachPair = function(f, o){
  if(isArray(o)){
    return each(function(v, k){ return f(k, v); }, o);
  }
  else if(isObject(o)){
    var fn = function(k){ f.apply(null, [k, o[k]]); };
    return each(fn, Object.keys(o));
  }
  else if(typeof o === "undefined"){
    return function(o2){
      return eachPair(f, o2);
    }
  }
};

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
  each: each,
  eachPair: eachPair,
	map: map
};
