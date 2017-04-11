"use strict";

var Node = function Node(value) {
  var _id = Math.random().toString(36).slice(2);
  Object.defineProperty(this, 'identity', {
    get: function() {
      return _id;
    },
    set: function() {
      throw new Error('May not set identity on a Node');
    }
  });
  
  this.value = (typeof value !== 'undefined' ? value : null);
  this.parent = null;
  this.left = null;
  this.right = null;
};

Node.prototype.toString = function() {
  return (this.left
       ? '"' + this.identity + '" -> "' + this.left.identity + '"\n' + this.left.toString() : '')
    + (this.right
       ? '"' + this.identity + '" -> "' + this.right.identity + '"\n' + this.right.toString() : '');
};

Node.prototype.isFull = function() {
  return (this.left && this.right);
};

Node.prototype.isEmpty = function() {
  return (!this.left && !this.right);
};

Node.prototype.childCount = function() {
  return 0
    + (this.left ? 1 : 0)
    + (this.right ? 1 : 0);
};

Node.prototype.openEdge = function() {
  return (this.left
          ? (this.right ? false : 'right')
          : 'left');
};

Node.prototype.equals = function(other) {
  return this.identity === other.identity;
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
    if (seen[here.identity]) continue;
    seen[here.identity] = true;
    
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
    if (seen[here.identity]) continue;
    seen[here.identity] = true;
    
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
  var here = child;

  if (!receivingEdge)
    throw new Error('Can\'t find an edge to insert on - this should never happen');
  
  receivingNode[receivingEdge] = child;
  child.parent = receivingNode;

  while (here.parent && (here.value < here.parent.value)) {
    here.swapWith(here.parent);
    here = here.parent;
  };
};

Node.prototype.removeChild = function(child) {
  var edge = (this.left.equals(child)
              ? 'left'
              : (this.right.equals(child)
                 ? 'right'
                 : false));
  
  if (edge === false)
    throw new Error('removeChild called with non-child argument');

  switch (child.childCount()) {
  case 2:
    throw new Error('No idea how to delete a node with two children yet');
    break;
    
  case 1:
    this.value = child.value;
    /* fall through */

  case 0:
    this[edge] = null;
    child.parent = null;
    break;
  };

  return child;
};

Node.prototype.detach = function() {
  if (!this.parent)
    throw new Error('Probably shouldn\'t detach root node');
  console.warn('detaching', this);
  return this.parent.removeChild(this);
};

Node.prototype.swapWith = function(other) {
  var a = this.value;
  var b = other.value;

  this.value = b;
  other.value = a;
};

module.exports = Node;
