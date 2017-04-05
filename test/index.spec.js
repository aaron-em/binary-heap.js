"use strict";

var chai = require('chai');
var expect = chai.expect;

var Node = require('lib/node.js');

describe('node insertion', function() {
  var tree;

  beforeEach(() => (tree = new Node(0)));
  
  [
    ["should cleanly insert a node",
     function() {
       tree.insert(new Node(1));
       expect(tree.search().map((n) => n.value))
         .to.deep.equal([0, 1]);
     }],

    ["should produce a complete tree on default insertion",
     function() {
       var kids = {
         0: [1, 2],
         1: [3, 4],
         2: [5, 6],
         3: [],
         4: [],
         5: [],
         6: []
       };
       var nodes = [tree, 1, 2, 3, 4, 5, 6]
             .map((n) => (n instanceof Node ? n : new Node(n)));
       nodes.slice(1)
         .forEach((n) => tree.insert(n));
       Object.keys(kids)
         .forEach(function(n) {
           n = parseInt(n);
           var parent = nodes[n];
           var expectedKids = kids[n]
                 .map((n) => nodes[n].value);
           var actualKids = [parent.left, parent.right]
                 .filter((n) => (n !== null))
                 .map((n) => n.value);

           expect(expectedKids)
             .to.deep.equal(actualKids);
         });
     }]
  ].forEach((test) => it.apply(null, test));
});

describe('search', function() {
  var tree;

  beforeEach(function() {
    tree = new Node(0);
    [1, 2, 3, 4, 5, 6]
      .forEach((n) => tree.insert(new Node(n)));
  });

  [
    ['should BFS correctly',
     function() {
       expect(tree.search().map((n) => n.value))
         .to.deep.equal([0, 1, 2, 3, 4, 5, 6]);
     }],

    ['should DFS correctly',
     function() {
       expect(tree.search((n) => n, {strategy: 'depth'}).map((n) => n.value))
         .to.deep.equal([0, 1, 3, 4, 2, 5, 6]);
     }],

    ['should take',
     function() {
       var results = tree
             .search((n) => n, {take: 2})
             .map((n) => n.value);
       expect(results)
         .to.deep.equal([0, 1]);
     }]
  ].forEach((test) => it.apply(null, test));
});
