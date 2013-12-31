var assert = require("assert");
var F = require("../src/fnc.js");

suite("apply", function(){
  test("applies argument arrays to a function", function(){
    var fn = function(a, b, c){ return a + b + c; };
    assert.equal(F.apply(fn, [1, 2, 3]), 6);
  });
});

suite("curry", function(){
  test("doesn't do much with functions that take no args", function(){
    var fn = F.curry(function(){ return "hello world"; });
    assert.equal(fn(), "hello world");
  });

  test("automatically curries functions", function(){
    var fn = F.curry(function(a, b, c){ return a + b + c; });
    assert.equal(fn(1)(2)(3), 6);
  });

  test("curries functions with starting args", function(){
    var fn = F.curry(function(a, b, c){ return a + b + c; }, 5);
    assert.equal(fn(6, 7), 18);
  });
});

suite("each", function(){
  test("iterates over all array elements", function(){
    var result = [];
    F.each(function(e){ result.push(e); }, [1, 2, 3])
    assert.deepEqual([1, 2, 3], result);
  });

  test("iterates over array index value pairs", function(){
    var result = [];
    var fn = function(v, i){ result.push([i, v]); };
    F.each(fn, ["a", "b", "c"]);
    assert.deepEqual([[0, "a"], [1, "b"], [2, "c"]], result);
  });

  test("iterates over all values in an object", function(){
    var result = [];
    F.each(function(e){ result.push(e); }, {one: 1, two: 2, three: 3});
    assert.deepEqual([1, 2, 3], result);
  });

  test("iterates over object key value pairs", function(){
    var result = [];
    var fn = function(v, k){ result.push([k, v]); };
    F.each(fn, {one: 1, two: 2, three: 3});
    assert.deepEqual([["one", 1], ["two", 2], ["three", 3]], result);
  });

  test("auto-curries if only given a function", function(){
    var result = [];
    var fn = F.each(function(e){ result.push(e); });
    fn([1, 2, 3]);
    assert.deepEqual([1, 2, 3], result);
  });

  test("handles other things", function(){
    var fn = function(n){ throw("should not get called"); }
    F.each(fn, "foobar");
    F.each(fn, 12345);
    F.each(fn, true);
    F.each(fn, false);
    F.each(fn, null);
    F.each(fn, undefined);
  });
});

suite("map", function(){
  test("maps over an array", function(){
    var fn = function(n){ return n * 2 };
    assert.deepEqual([2, 4, 6], F.map(fn, [1, 2, 3]));
  });

  test("maps over an object's values", function(){
    var fn = function(n){ return n * 3 };
    assert.deepEqual([3, 6, 9], F.map(fn, {one: 1, two: 2, three: 3}));
  });

  test("mapping over other things is null", function(){
    var fn = function(n){ throw("should not get called"); }
    assert(F.map(fn, "foobar") === null);
    assert(F.map(fn, 12345) === null);
    assert(F.map(fn, true) === null);
    assert(F.map(fn, false) === null);
    assert(F.map(fn, null) === null);
    assert(F.map(fn, undefined) === null);
  });
});

suite("reduce", function(){
  test("reduces over an array", function(){
    var init = 0;
    var fn = function(accum, n){ return accum + n; };
    assert.equal(init, 0);
    assert.equal(F.reduce(fn, init, [1, 2, 3, 4, 5]), 15);
  });

  test("reduces over an object values", function(){
    var init = [];
    var fn = function(accum, v, k){ accum.push([k, v]); return accum; };
    var result = F.reduce(fn, init, {one: 1, two: 2, three: 3});
    assert.deepEqual([], init);
    assert.deepEqual([["one", 1], ["two", 2], ["three", 3]], result);
  });

  test("reduces into an object", function(){
    var init = {};
    var fn = function(accum, v, k){ accum[k + "x2"] = v * 2; return accum; };
    var result = F.reduce(fn, init, {one: 1, two: 2, three: 3})
    assert.deepEqual(init, {});
    assert.deepEqual({onex2: 2, twox2: 4, threex2: 6}, result);
  });
});

suite("merge", function(){
  test("merges two object", function(){
    var start = {foo: "bar"};
    var merged = F.merge(start, {baz: "bat"});
    assert.deepEqual(start, {foo: "bar"});
    assert.deepEqual(merged, {foo: "bar", baz: "bat"});
  });

  test("merges multiple objects", function(){
    var start = {foo: "bar"};
    var merged = F.merge(start, {baz: "bat"}, {qux: "quux"});
    assert.deepEqual(start, {foo: "bar"});
    assert.deepEqual(merged, {foo: "bar", baz: "bat", qux: "quux"});
  });

  test("ignores non-objects", function(){
    var start = {foo: "bar"};
    var merged = F.merge(start, 1234, "foobar", null, undefined, ["blah"]);
    assert.deepEqual(start, merged);
  });

  test("handles bad starting values", function(){
    var thing = {foo: "bar"};
    assert.deepEqual(F.merge("foobar", thing), {});
    assert.deepEqual(F.merge(12345, thing), {});
    assert.deepEqual(F.merge([1, 2, 3], thing), {});
    assert.deepEqual(F.merge(true, thing), {});
    assert.deepEqual(F.merge(false, thing), {});
  });

  test("null and undefined starting values are treated like empty objects", function(){
    var thing = {foo: "bar"};
    assert.deepEqual(F.merge(null, thing), {foo: "bar"});
    assert.deepEqual(F.merge(undefined, thing), {foo: "bar"});
  });
});

suite("head", function(){
  test("returns the first element", function(){
    assert.equal(F.head([2,4,6]), 2);
  });

  test("is null for an empty array", function(){
    assert.strictEqual(F.head([]), null);
  });

  test("returns null for non-arrays", function(){
    assert.strictEqual(F.head({foo: "bar"}), null);
    assert.strictEqual(F.head("foobar"), null);
    assert.strictEqual(F.head(12345), null);
    assert.strictEqual(F.head(true), null);
    assert.strictEqual(F.head(false), null);
    assert.strictEqual(F.head(null), null);
    assert.strictEqual(F.head(undefined), null);
  });
});

suite("tail", function(){
  test("returns the tail elements", function(){
    assert.deepEqual(F.tail([2,4,6]), [4, 6]);
  });

  test("is empty array for an empty array", function(){
    assert.deepEqual(F.tail([]), []);
  });

  test("returns null for non-arrays", function(){
    assert.strictEqual(F.tail({foo: "bar"}), null);
    assert.strictEqual(F.tail("foobar"), null);
    assert.strictEqual(F.tail(12345), null);
    assert.strictEqual(F.tail(true), null);
    assert.strictEqual(F.tail(false), null);
    assert.strictEqual(F.tail(null), null);
    assert.strictEqual(F.tail(undefined), null);
  });
});

suite("initial", function(){
  test("returns all but the last element", function(){
    assert.deepEqual(F.initial([2,4,6]), [2, 4]);
  });

  test("is an empty array for an empty array", function(){
    assert.deepEqual(F.initial([]), []);
  });

  test("returns null for non-arrays", function(){
    assert.strictEqual(F.initial({foo: "bar"}), null);
    assert.strictEqual(F.initial("foobar"), null);
    assert.strictEqual(F.initial(12345), null);
    assert.strictEqual(F.initial(true), null);
    assert.strictEqual(F.initial(false), null);
    assert.strictEqual(F.initial(null), null);
    assert.strictEqual(F.initial(undefined), null);
  });
});

suite("last", function(){
  test("returns the last element", function(){
    assert.equal(F.last([2,4,6]), 6);
  });

  test("is null for an empty array", function(){
    assert.deepEqual(F.last([]), null);
  });

  test("returns null for non-arrays", function(){
    assert.strictEqual(F.last({foo: "bar"}), null);
    assert.strictEqual(F.last("foobar"), null);
    assert.strictEqual(F.last(12345), null);
    assert.strictEqual(F.last(true), null);
    assert.strictEqual(F.last(false), null);
    assert.strictEqual(F.last(null), null);
    assert.strictEqual(F.last(undefined), null);
  });
});