"use strict";

var Node = require('lib/node');

var nodes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      .map((i) => new Node(i));

var tree = nodes[0];
nodes.slice(1)
  .forEach((n) => tree.insert(n));

console.log('digraph {');
console.log(tree.toString());
console.log('}');
