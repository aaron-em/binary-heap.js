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
  return (this.left !== null && this.right !== null);
};

Node.prototype.openEdge = function() {
  return (this.left
          ? (this.right ? false : 'right')
          : 'left');
};

Node.prototype.BFS = function(predicate) {
  if (predicate(this)) return this;
  if (this.left && predicate(this.left)) return this.left;
  if (this.right && predicate(this.right)) return this.right;
  return (this.left ? this.left.BFS(predicate) :
          (this.right ? this.right.BFS(predicate) : false));
};

Node.prototype.DFS = function(predicate) {
  if (predicate(this)) return this;
  if (this.left) return (this.left.DFS(predicate) || this.left);
  if (this.right) return (this.right.DFS(predicate) || this.right);
  return false;
};

Node.prototype.addChild = function(child) {
  var receivingNode = this.BFS((n) => (! n.isFull()));
  var receivingEdge = receivingNode.openEdge();

  if (!receivingEdge)
    throw new Error('Pool\'s closed');
  
  receivingNode[receivingEdge] = child;
  child.parent = receivingNode;
};

var tree = new Node(0);
tree.addChild(new Node(1));
tree.addChild(new Node(2));

tree.addChild(new Node(3));
tree.addChild(new Node(4));

tree.addChild(new Node(5));
tree.addChild(new Node(6));

tree.addChild(new Node(7));
tree.addChild(new Node(8));
tree.addChild(new Node(9));
tree.addChild(new Node(10));


console.log('digraph {');
console.log(tree.toString());
console.log('}');
