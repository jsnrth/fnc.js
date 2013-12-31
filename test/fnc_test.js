var assert = require("assert");
var fnc = require("../src/fnc.js");

suite("each", function(){
  test("iterates over all array elements", function(){
    var result = [];
    var f = function(e){ result.push(e); }
    fnc.each(f, [1, 2, 3])
    assert.deepEqual([1, 2, 3], result);
  });

  test("iterates over all values in an object", function(){
    var result = [];
    var f = function(e){ result.push(e); }
    fnc.each(f, {one: 1, two: 2, three: 3});
    assert.deepEqual([1, 2, 3], result);
  });

  test("auto-curries if only given a function", function(){
    var result = [];
    var f = fnc.each(function(e){ result.push(e); });
    f([1, 2, 3]);
    assert.deepEqual([1, 2, 3], result);
  });

  test("handles other things", function(){
    var fn = function(n){ throw("should not get called"); }
    fnc.each(fn, "foobar");
    fnc.each(fn, 12345);
    fnc.each(fn, true);
    fnc.each(fn, false);
    fnc.each(fn, null);
    fnc.each(fn, undefined);
  });
});

suite("eachPair", function(){
  test("iterates over object key value pairs", function(){
    var result = [];
    var f = function(k, v){
      result.push([k, v]);
    };
    fnc.eachPair(f, {one: 1, two: 2, three: 3});
    assert.deepEqual([["one", 1], ["two", 2], ["three", 3]], result);
  });

  test("iterates over array index value pairs", function(){
    var result = [];
    var f = function(k, v){
      result.push([k, v]);
    };
    fnc.eachPair(f, [1, 2, 3]);
    assert.deepEqual([[0, 1], [1, 2], [2, 3]], result);
  });

  test("auto-curries if only given a function", function(){
    var result = [];
    var f = fnc.eachPair(function(k, v){ result.push([k, v]); });
    f({one: 1, two: 2, three: 3});
    assert.deepEqual([["one", 1], ["two", 2], ["three", 3]], result);
  });

  test("handles other things", function(){
    var fn = function(n){ throw("should not get called"); }
    fnc.eachPair(fn, "foobar");
    fnc.eachPair(fn, 12345);
    fnc.eachPair(fn, true);
    fnc.eachPair(fn, false);
    fnc.eachPair(fn, null);
    fnc.eachPair(fn, undefined);
  });
});

suite("map", function(){
  test("maps over an array", function(){
    var fn = function(n){ return n * 2 };
    assert.deepEqual([2, 4, 6], fnc.map(fn, [1, 2, 3]));
  });

  test("maps over an object's values", function(){
    var fn = function(n){ return n * 3 };
    assert.deepEqual([3, 6, 9], fnc.map(fn, {one: 1, two: 2, three: 3}));
  });

  test("mapping over other things is null", function(){
    var fn = function(n){ throw("should not get called"); }
    assert(fnc.map(fn, "foobar") === null);
    assert(fnc.map(fn, 12345) === null);
    assert(fnc.map(fn, true) === null);
    assert(fnc.map(fn, false) === null);
    assert(fnc.map(fn, null) === null);
    assert(fnc.map(fn, undefined) === null);
  });
});
