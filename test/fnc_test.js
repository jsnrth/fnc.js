var assert = require("assert");
var F = require("../src/fnc.js");

suite("each", function(){
  test("iterates over all array elements", function(){
    var result = [];
    F.each(function(e){ result.push(e); }, [1, 2, 3])
    assert.deepEqual([1, 2, 3], result);
  });

  test("iterates over all values in an object", function(){
    var result = [];
    F.each(function(e){ result.push(e); }, {one: 1, two: 2, three: 3});
    assert.deepEqual([1, 2, 3], result);
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

suite("eachPair", function(){
  test("iterates over object key value pairs", function(){
    var result = [];
    var fn = function(k, v){ result.push([k, v]); };
    F.eachPair(fn, {one: 1, two: 2, three: 3});
    assert.deepEqual([["one", 1], ["two", 2], ["three", 3]], result);
  });

  test("iterates over array index value pairs", function(){
    var result = [];
    var fn = function(k, v){ result.push([k, v]); };
    F.eachPair(fn, ["a", "b", "c"]);
    assert.deepEqual([[0, "a"], [1, "b"], [2, "c"]], result);
  });

  test("auto-curries if only given a function", function(){
    var result = [];
    var fn = F.eachPair(function(k, v){ result.push([k, v]); });
    fn({one: 1, two: 2, three: 3});
    assert.deepEqual([["one", 1], ["two", 2], ["three", 3]], result);
  });

  test("handles other things", function(){
    var fn = function(n){ throw("should not get called"); }
    F.eachPair(fn, "foobar");
    F.eachPair(fn, 12345);
    F.eachPair(fn, true);
    F.eachPair(fn, false);
    F.eachPair(fn, null);
    F.eachPair(fn, undefined);
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
