"use strict";

var Node = function Node(value) {
  this.value = (typeof value !== 'undefined' ? value : null);
  this.parent = null;
  this.left = null;
  this.right = null;
};

Node.prototype.toString = function() {
  return (this.left
       ? this.value + ' -> ' + this.left.value + '\n' + this.left.toString() : '')
    + (this.right
       ? this.value + ' -> ' + this.right.value + '\n' + this.right.toString() : '');
};

Node.prototype.isFull = function() {
  return (this.left && this.right);
};

Node.prototype.openEdge = function() {
  return (this.left
          ? (this.right ? false : 'right')
          : 'left');
};

Node.prototype.search = function(predicate, options) {
  predicate = predicate || ((n) => n);
  options = options || {};
  if (typeof options !== 'object')
    throw new Error('Bogus `options\' argument (must be object)');
  options.strategy = options.strategy || 'breadth';
  options.take = options.take || null;
  return this[options.strategy === 'breadth' ? 'BFS' : 'DFS'](predicate, options.take);
};

Node.prototype.BFS = function(predicate, take) {
  var results = [];
  var seen = {};
  var queue = [this];
  var here;

  while (queue.length) {
    here = queue.shift();
    if (seen[here.value]) continue;
    seen[here.value] = true;
    
    if (predicate(here)) {
      results.push(here);
      if (results.length === take)
        return results.slice(0, take);
    };
    
    ['left', 'right']
      .forEach(function(edge) {
        var child = here[edge];
        if (child) {
          queue.push(child);
        };
      });
  };
  
  return results;
};

Node.prototype.DFS = function(predicate, take) {
  var results = [];
  var seen = {};
  var queue = [this];
  var here;

  while (queue.length) {
    here = queue.pop();
    if (seen[here.value]) continue;
    seen[here.value] = true;
    
    if (predicate(here)) {
      results.push(here);
      if (results.length === take)
        return results.slice(0, take);
    };
    
    ['right', 'left']
      .forEach(function(edge) {
        var child = here[edge];
        if (child) {
          queue.push(child);
        };
      });
  };
  
  return results;
};

Node.prototype.insert = function(child) {
  var receivingNode = this.search((n) => (! n.isFull()), {take: 1})[0];
  var receivingEdge = receivingNode.openEdge();

  if (!receivingEdge)
    throw new Error('Pool\'s closed');
  
  receivingNode[receivingEdge] = child;
  child.parent = receivingNode;
};

module.exports = Node;
