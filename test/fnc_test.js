var assert = require("assert");
var Fnc = require("../src/fnc.js");

Fnc.extend(global);

suite("extend", function(){
  test("extends an object with all the functions", function(){
    var o = {};
    Fnc.extend(o);
    assert.equal(typeof o.apply, "function");
    assert.equal(typeof o.each, "function");
  });

  test("breaks if a function is already defined", function(){
    var o = {apply: "whatever"};
    assert.throws(function(){ Fnc.extend(o); }, /apply already defined/);
    assert.equal(o.apply, "whatever");
  });
});

suite("apply", function(){
  test("applies argument arrays to a function", function(){
    var fn = function(a, b, c){ return a + b + c; };
    assert.equal(apply(fn, [1, 2, 3]), 6);
  });
});

suite("curry", function(){
  test("doesn't do much with functions that take no args", function(){
    var fn = curry(function(){ return "hello world"; });
    assert.equal(fn(), "hello world");
  });

  test("automatically curries functions", function(){
    var fn = curry(function(a, b, c){ return a + b + c; });
    assert.equal(fn(1)(2)(3), 6);
  });

  test("curries functions with starting args", function(){
    var fn = curry(function(a, b, c){ return a + b + c; }, 5);
    assert.equal(fn(6, 7), 18);
  });
});

suite("each", function(){
  test("iterates over all array elements", function(){
    var result = [];
    each(function(e){ result.push(e); }, [1, 2, 3])
    assert.deepEqual([1, 2, 3], result);
  });

  test("iterates over array index value pairs", function(){
    var result = [];
    var fn = function(v, i){ result.push([i, v]); };
    each(fn, ["a", "b", "c"]);
    assert.deepEqual([[0, "a"], [1, "b"], [2, "c"]], result);
  });

  test("iterates over all values in an object", function(){
    var result = [];
    each(function(e){ result.push(e); }, {one: 1, two: 2, three: 3});
    assert.deepEqual([1, 2, 3], result);
  });

  test("iterates over object key value pairs", function(){
    var result = [];
    var fn = function(v, k){ result.push([k, v]); };
    each(fn, {one: 1, two: 2, three: 3});
    assert.deepEqual([["one", 1], ["two", 2], ["three", 3]], result);
  });

  test("auto-curries if only given a function", function(){
    var result = [];
    var fn = each(function(e){ result.push(e); });
    fn([1, 2, 3]);
    assert.deepEqual([1, 2, 3], result);
  });

  test("handles other things", function(){
    var fn = function(n){ throw("should not get called"); }
    each(fn, "foobar");
    each(fn, 12345);
    each(fn, true);
    each(fn, false);
    each(fn, null);
    each(fn, undefined);
  });
});

suite("map", function(){
  test("maps over an array", function(){
    var fn = function(n){ return n * 2 };
    assert.deepEqual([2, 4, 6], map(fn, [1, 2, 3]));
  });

  test("maps over an object's values", function(){
    var fn = function(n){ return n * 3 };
    assert.deepEqual([3, 6, 9], map(fn, {one: 1, two: 2, three: 3}));
  });

  test("mapping over other things is null", function(){
    var fn = function(n){ throw("should not get called"); }
    assert(map(fn, "foobar") === null);
    assert(map(fn, 12345) === null);
    assert(map(fn, true) === null);
    assert(map(fn, false) === null);
    assert(map(fn, null) === null);
    assert(map(fn, undefined) === null);
  });
});

suite("reduce", function(){
  test("reduces over an array", function(){
    var init = 0;
    var fn = function(accum, n){ return accum + n; };
    assert.equal(init, 0);
    assert.equal(reduce(fn, init, [1, 2, 3, 4, 5]), 15);
  });

  test("reduces over an object values", function(){
    var init = [];
    var fn = function(accum, v, k){ accum.push([k, v]); return accum; };
    var result = reduce(fn, init, {one: 1, two: 2, three: 3});
    assert.deepEqual([], init);
    assert.deepEqual([["one", 1], ["two", 2], ["three", 3]], result);
  });

  test("reduces into an object", function(){
    var init = {};
    var fn = function(accum, v, k){ accum[k + "x2"] = v * 2; return accum; };
    var result = reduce(fn, init, {one: 1, two: 2, three: 3})
    assert.deepEqual(init, {});
    assert.deepEqual({onex2: 2, twox2: 4, threex2: 6}, result);
  });
});

suite("merge", function(){
  test("merges two object", function(){
    var start = {foo: "bar"};
    var merged = merge(start, {baz: "bat"});
    assert.deepEqual(start, {foo: "bar"});
    assert.deepEqual(merged, {foo: "bar", baz: "bat"});
  });

  test("merges multiple objects", function(){
    var start = {foo: "bar"};
    var merged = merge(start, {baz: "bat"}, {qux: "quux"});
    assert.deepEqual(start, {foo: "bar"});
    assert.deepEqual(merged, {foo: "bar", baz: "bat", qux: "quux"});
  });

  test("ignores non-objects", function(){
    var start = {foo: "bar"};
    var merged = merge(start, 1234, "foobar", null, undefined, ["blah"]);
    assert.deepEqual(start, merged);
  });

  test("handles bad starting values", function(){
    var thing = {foo: "bar"};
    assert.deepEqual(merge("foobar", thing), {});
    assert.deepEqual(merge(12345, thing), {});
    assert.deepEqual(merge([1, 2, 3], thing), {});
    assert.deepEqual(merge(true, thing), {});
    assert.deepEqual(merge(false, thing), {});
  });

  test("null and undefined starting values are treated like empty objects", function(){
    var thing = {foo: "bar"};
    assert.deepEqual(merge(null, thing), {foo: "bar"});
    assert.deepEqual(merge(undefined, thing), {foo: "bar"});
  });
});

suite("head", function(){
  test("returns the first element", function(){
    assert.equal(head([2,4,6]), 2);
  });

  test("is null for an empty array", function(){
    assert.strictEqual(head([]), null);
  });

  test("returns null for non-arrays", function(){
    assert.strictEqual(head({foo: "bar"}), null);
    assert.strictEqual(head("foobar"), null);
    assert.strictEqual(head(12345), null);
    assert.strictEqual(head(true), null);
    assert.strictEqual(head(false), null);
    assert.strictEqual(head(null), null);
    assert.strictEqual(head(undefined), null);
  });
});

suite("tail", function(){
  test("returns the tail elements", function(){
    assert.deepEqual(tail([2,4,6]), [4, 6]);
  });

  test("is empty array for an empty array", function(){
    assert.deepEqual(tail([]), []);
  });

  test("returns null for non-arrays", function(){
    assert.strictEqual(tail({foo: "bar"}), null);
    assert.strictEqual(tail("foobar"), null);
    assert.strictEqual(tail(12345), null);
    assert.strictEqual(tail(true), null);
    assert.strictEqual(tail(false), null);
    assert.strictEqual(tail(null), null);
    assert.strictEqual(tail(undefined), null);
  });
});

suite("initial", function(){
  test("returns all but the last element", function(){
    assert.deepEqual(initial([2,4,6]), [2, 4]);
  });

  test("is an empty array for an empty array", function(){
    assert.deepEqual(initial([]), []);
  });

  test("returns null for non-arrays", function(){
    assert.strictEqual(initial({foo: "bar"}), null);
    assert.strictEqual(initial("foobar"), null);
    assert.strictEqual(initial(12345), null);
    assert.strictEqual(initial(true), null);
    assert.strictEqual(initial(false), null);
    assert.strictEqual(initial(null), null);
    assert.strictEqual(initial(undefined), null);
  });
});

suite("last", function(){
  test("returns the last element", function(){
    assert.equal(last([2,4,6]), 6);
  });

  test("is null for an empty array", function(){
    assert.deepEqual(last([]), null);
  });

  test("returns null for non-arrays", function(){
    assert.strictEqual(last({foo: "bar"}), null);
    assert.strictEqual(last("foobar"), null);
    assert.strictEqual(last(12345), null);
    assert.strictEqual(last(true), null);
    assert.strictEqual(last(false), null);
    assert.strictEqual(last(null), null);
    assert.strictEqual(last(undefined), null);
  });
});

suite("flatten", function(){
  test("flattens nested arrays", function(){
    assert.deepEqual(flatten([1, [2, [3, [4]]]]), [1, 2, 3, 4]);
  });
});

suite("conj", function(){
  test("appends elements to an array", function(){
    assert.deepEqual(conj([1,2,3], 4, 5, 6), [1,2,3,4,5,6]);
  });
});

suite("cons", function(){
  test("preappends elements to an array", function(){
    assert.deepEqual(cons(1, [2,3,4]), [1,2,3,4]);
  });
});
