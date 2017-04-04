"use strict";

var Node = function Node(value) {
  this.value = value || null;
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

Node.prototype.insert = function(child) {
  var edge = (this.left === null
              ? 'left'
              : (this.right === null
                 ? 'right'
                 : false));

  if (edge === false) {
    return (this.left.insert(child) || this.right.insert(child));
  } else {
    child.parent = this;
    this[edge] = child;
    return true;
  };
};

Node.prototype.extract = function() {
  // ...
};

Node.prototype.swapWith = function(node) {
};

var N = Node;

var a = new N(2);
var b = new N(3);
var c = new N(4);
var d = new N(5);

[b, c, d].forEach((n) => a.insert(n));
a.insert(new N(1));

console.log('digraph {\n');
console.log(a.toString());
console.log('}\n');
