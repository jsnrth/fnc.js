var assert = require("assert");
var fnc = require("../src/fnc.js");

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
