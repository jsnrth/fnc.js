var isArray = Array.isArray;

var isObject = function(o){
  return o && !isArray(o) && typeof o === "object";
};

var clone = function(o){
  if(isArray(o)){
    return Array.prototype.slice.call(o);
  }
  else if(isObject(o)){
    var c = {};
    each(function(v, k){ c[k] = v; }, o);
    return c;
  }
  else {
    return o;
  }
}

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
  var accum = clone(init);
  each(function(v, k){
    accum = fn(accum, v, k);
  }, o);
  return accum;
};

var merge = function(o){
  if(o === null || o === undefined) o = {};
  if(isObject(o)){
    var merges = Array.prototype.slice.call(arguments, 1);
    return reduce(function(accum, m){
      if(isObject(m)){
        each(function(v, k){
          accum[k] = v;
        }, m);
      }
      return accum;
    }, o, merges);
  }
  else {
    return {};
  }
};

var head = function(a){
  if(isArray(a)) {
    var h = a[0];
    return typeof h === "undefined" ? null : h;
  }
  else {
    return null;
  }
};

var tail = function(a){
  if(isArray(a)) {
    return Array.prototype.slice.call(a, 1);
  }
  else {
    return null;
  }
};

var initial = function(a){
  if(isArray(a)) {
    return Array.prototype.slice.call(a, 0, a.length - 1);
  }
  else {
    return null;
  }
};

var last = function(a){
  if(isArray(a)) {
    var l = a[a.length - 1];
    return typeof l === "undefined" ? null : l;
  }
  else {
    return null;
  }
};

module.exports = {
  each: each,
  map: map,
  reduce: reduce,
  merge: merge,
  head: head,
  tail: tail,
  initial: initial,
  last: last
};
