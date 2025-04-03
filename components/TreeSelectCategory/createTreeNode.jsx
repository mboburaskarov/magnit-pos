export default function createTreeNode({ node = null, parent = null, branches = [] }) {
  return {
    node,
    parent,
    branches,
    checked: false,
  }
}
