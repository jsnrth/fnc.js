var isArray = Array.isArray;

var isObject = function(o){
  return o && !isArray(o) && typeof o === "object";
};

var each = function(f, o){
  if(isArray(o)){
    o.forEach(f);
  }
  else if(isArray(o) || isObject(o)){
    var fn = function(k){ f.apply(null, [o[k], k]); };
    return each(fn, Object.keys(o));
  }
  else if(typeof o === "undefined"){
    return function(o2){
      return each(f, o2);
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

var reduce = function(fn, init, o){
  var accum = init;
  each(function(v, k){
    accum = fn(accum, v, k);
  }, o);
  return accum;
};

module.exports = {
  each: each,
  map: map,
  reduce: reduce
};
