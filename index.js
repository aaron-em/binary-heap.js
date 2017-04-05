"use strict";

var Node = require('lib/node');

var nodes = [0, 1, 3, 3, 5, 5, 7, 7, 9, 9]
      .sort((m, n) => (Math.random() < 0.5))
      .map((i) => new Node(i));

var tree = nodes[0];
nodes.slice(1)
  .forEach((n) => tree.insert(n));

var res;
var node;
while ((res = tree.search((n) => (n.parent && n.parent.value > n.value),
                          {take: 1}))) {
  if (res.length === 0) break;
  node = res[0];
  node.swapWith(node.parent);
};

var removee = tree.search((n) => n.childCount() === 1, {take: 1})[0];
removee.detach();

console.log('digraph {');
nodes
  .forEach(function(node) {
    console.log('"' + node.identity + '" [label="' + node.value + '"]');
  });
console.log(tree.toString());
console.log(removee.toString());
console.log('}');
