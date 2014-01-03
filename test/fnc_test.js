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

  test("does deep merging", function(){
    var init = {one: {two: {three: 3}}};
    var expected = {one: {two: {three: 3, baz: "bat"}, foo: "bar"}};
    assert.deepEqual(merge(init, {one: {foo: "bar", two: {baz: "bat"}}}), expected);
  });

  test("deep merges several objects", function(){
    var init = {one: {two: {three: 3}}};
    var expected = {one: {two: {three: 3, baz: "bat"}, foo: "bar"}};
    var merge1 = {one: {foo: "bar"}};
    var merge2 = {one: {two: {baz: "bat"}}};
    assert.deepEqual(merge(init, merge1, merge2), expected);
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

suite("filter", function(){
  test("filters based on predicate function", function(){
    var isEven = function(e){ return e % 2 === 0; };
    assert.deepEqual(filter(isEven, [1, 2, 3, 4, 5]), [2, 4]);
  });
});

suite("remove", function(){
  test("removes elements based on predicate function", function(){
    var isEven = function(e){ return e % 2 === 0; };
    assert.deepEqual(remove(isEven, [1, 2, 3, 4, 5]), [1, 3, 5]);
  });
});

suite("some", function(){
  test("true when at least one element succeeds predicate", function(){
    var isEven = function(e){ return e % 2 === 0; };
    assert( some(isEven, [1, 2]));
    assert(!some(isEven, [1, 3, 5]));
  });

  test("fails for empty arrays", function(){
    var isTrue = function(){ return true; };
    assert(!some(isTrue, []));
  });
});

suite("every", function(){
  test("true when all elements succeed predicate", function(){
    var isEven = function(e){ return e % 2 === 0; };
    assert( every(isEven, [2, 4, 6]));
    assert(!every(isEven, [1, 2, 3]));
  });

  test("fails for empty arrays", function(){
    var isTrue = function(){ return true; };
    assert(!every(isTrue, []));
  });
});

suite("find", function(){
  test("returns the first element that matches the predicate", function(){
    var isB = function(e){ return (/b/).test(e); };
    assert.equal(find(isB, ["a", "b1", "c", "b2"]), "b1");
  });

  test("null when element can't be found", function(){
    var isFalse = function(){ return false; };
    assert.strictEqual(find(isFalse, [1, 2, 3]), null);
  });
});

suite("compose", function(){
  test("threads something through several functions", function(){
    var plus3 = function(n){ return n + 3; };
    var times2 = function(n){ return n * 2; };
    var minus1 = function(n){ return n - 1; };
    var fn = compose(plus3, times2, minus1);
    assert.equal(fn(3), 11);
  });

  test("threads other data too", function(){
    var removeBar = function(o){ delete o["bar"]; return o; };
    var addBat = function(o){ o["bat"] = "789"; return o; };
    var fn = compose(removeBar, addBat);
    assert.deepEqual(fn({foo: "123", bar: "456"}), {foo: "123", bat: "789"});
  });

  test("threads arrays as arguments", function(){
    var changeA = function(a, b, c){ return [a + 2, b, c]; };
    var changeB = function(a, b, c){ return [a, b - 4, c]; };
    var changeC = function(a, b, c){ return [a, b, c * 3]; };
    var fn1 = compose(changeA, changeB, changeC);
    var fn2 = compose(fn1, function(a, b, c){ return a + b + c; });
    assert.deepEqual(fn1(1, 2, 3), [3, -2, 9]);
    assert.deepEqual(fn2(1, 2, 3), 10);
  });
});

suite("assoc", function(){
  test("adds a key/value to a hash", function(){
    assert.deepEqual(assoc({}, "foo", "bar"), {foo: "bar"});
  });

  test("changes a key/value in a hash without modifying the original", function(){
    var h = {foo: "bar"};
    var h2 = assoc(h, "foo", "baz");
    assert.deepEqual(h2, {foo: "baz"});
    assert.deepEqual(h, {foo: "bar"});
  });
});

suite("assocIn", function(){
  test("adds nested keys/values to a hash", function(){
    assert.deepEqual(assocIn({}, ["one", "two"], 222), {one: {two: 222}});
  });

  test("modifies nested keys/values in a hash without modifying the original", function(){
    var h = {one: {two: {three: "1+2"}}};
    var h2 = assocIn({}, ["one", "two", "three"], "2+1");
    assert.deepEqual(h,  {one: {two: {three: "1+2"}}});
    assert.deepEqual(h2, {one: {two: {three: "2+1"}}});
  });

  test("creates nested hash", function(){
    assert.deepEqual(assocIn({}, ["one", "two", "three"], 3), {one: {two: {three: 3}}});
  });
});
