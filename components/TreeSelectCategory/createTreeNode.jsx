// export default class Node {
//   node;
//   checked;
//   branches;

//   constructor(node) {
//     this.node = node;
//     this.branches = [];
//     this.checked = false;
//   }
// }

export default function createTreeNode({
  node = null,
  parent = null,
  branches = [],
}) {
  return {
    node,
    parent,
    branches,
    checked: false,
  }
}
