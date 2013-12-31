var slice = function(a){
  return Array.prototype.slice.apply(a, Array.prototype.slice.call(arguments, 1));
};

var isArray = Array.isArray;

var isObject = function(o){
  return o && !isArray(o) && typeof o === "object";
};

var clone = function(o){
  if(isArray(o)){
    return slice(o);
  }
  else if(isObject(o)){
    var c = {};
    each(function(v, k){ c[k] = v; }, o);
    return c;
  }
  else {
    return o;
  }
};

var apply = function(f, args){
  return f.apply(null, args);
};

var curry = function(f){
  var initial = slice(arguments, 1);
  return function(){
    var args = initial.concat(slice(arguments));
    if(args.length < f.length){
      args.unshift(f);
      return apply(curry, args);
    }
    else {
      return apply(f, args);
    }
  }
};

var withArrayOrNull = curry(function(f, a){
  if(isArray(a))
    return apply(f, slice(arguments, 1));
  else
    return null;
});

var each = curry(function(f, o){
  if(isArray(o)){
    o.forEach(f);
  }
  else if(isArray(o) || isObject(o)){
    var fn = function(k){ apply(f, [o[k], k]); };
    return each(fn, Object.keys(o));
  }
});

var map = curry(function(f, o){
  if(isArray(o) || isObject(o)){
    var a = [];
    each(function(e){ a.push(f(e)); }, o);
    return a;
  }
  else {
    return null;
  }
});

var reduce = curry(function(fn, init, o){
  var accum = clone(init);
  each(function(v, k){
    accum = fn(accum, v, k);
  }, o);
  return accum;
});

var merge = function(o){
  if(o === null || o === undefined) o = {};
  if(isObject(o)){
    var merges = slice(arguments, 1);
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

var head = withArrayOrNull(function(a){
  var h = a[0];
  return typeof h === "undefined" ? null : h;
});

var tail = withArrayOrNull(function(a){
  return slice(a, 1);
});

var initial = withArrayOrNull(function(a){
  return slice(a, 0, a.length - 1);
});

var last = withArrayOrNull(function(a){
  var l = a[a.length - 1];
  return typeof l === "undefined" ? null : l;
});

var flatten = withArrayOrNull(function(a){
  return reduce(function(accum, e){
    if(isArray(e))
      return accum.concat(flatten(e));
    else
      return accum.concat(e);
  }, [], a);
});

var conj = withArrayOrNull(function(a){
  var things = slice(arguments, 1);
  return a.concat(things);
});

var cons = function(e, a){
  if(!isArray(a)) return null;
  return flatten(conj([e], a));
};

var filter = function(fn, a){
  return reduce(function(accum, e){
    if(fn(e))
      return conj(accum, e);
    else
      return accum;
  }, [], a);
};

var remove = function(fn, a){
  var nfn = function(){ return !apply(fn, slice(arguments)); };
  return filter(nfn, a);
};

var some = function(fn, a){
  if(a.length == 0) return false;
  for(var i = 0; i < a.length; i++)
    if(fn(a[i]))
      return true;
  return false;
};

var every = function(fn, a){
  if(a.length == 0) return false;
  for(var i = 0; i < a.length; i++)
    if(!fn(a[i]))
      return false;
  return true;
};

var find = function(fn, a){
  for(var i = 0; i < a.length; i++)
    if(fn(a[i]))
      return a[i];
  return null;
};

var functions = {
  apply: apply,
  curry: curry,
  each: each,
  map: map,
  reduce: reduce,
  merge: merge,
  head: head,
  tail: tail,
  initial: initial,
  last: last,
  flatten: flatten,
  conj: conj,
  cons: cons,
  filter: filter,
  remove: remove,
  some: some,
  every: every,
  find: find
};

var extend = function(o){
  each(function(_, name){
    if(typeof o[name] !== "undefined")
      throw(new Error("Fnc: cannot pollute, " + name + " already defined"));
  }, functions);

  each(function(fn, name){
    o[name] = fn;
  }, functions);
};

module.exports.functions = functions;
module.exports.extend = extend;