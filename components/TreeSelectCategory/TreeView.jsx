import React, { useState } from 'react'
import ExpandMoreIcon from '../../src/assets/icons/BottomArrowIcon'
import ChevronRightIcon from '../../src/assets/icons/ArrowRight'
// import { RichTreeView as TreeView } from '@mui/x-tree-view/RichTreeView';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeView } from '@mui/lab';
import useDidUpdate from '../../src/hooks/useDidUpdate'
import TreeItem from './TreeItem'
import TreeItemRoles from './TreeItemRoles'

const StyledTreeView = ({
  classes,
  categories,
  selected: selectedProps = [],
  onSelect: onSelectProps = () => {},
  handleCreate,
  disabled,
  searchTerm,
  highlight,
  expandedTrees,
  roles,
}) => {
  const [expanded, setExpanded] = useState([])
  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds)
  }
  useDidUpdate(() => {
    setExpanded(expandedTrees)
  }, [expandedTrees])
  console.log('tree view')

  return (
    <SimpleTreeView
      defaultCollapseIcon={<ExpandMoreIcon className={classes.svg} />}
      defaultExpandIcon={<ChevronRightIcon className={classes.svg} />}
      expanded={expanded}
      id='categories'
      className={classes.list}
      onNodeToggle={handleToggle}
    >
      {roles ? (
        <TreeItemRoles
          items={categories}
          selected={selectedProps}
          onSelect={onSelectProps}
          handleCreate={handleCreate}
          disabled={disabled}
          searchTerm={searchTerm}
          highlight={highlight}
        />
      ) : (
        <TreeItem
          items={categories}
          selected={selectedProps}
          onSelect={onSelectProps}
          handleCreate={handleCreate}
          disabled={disabled}
          searchTerm={searchTerm}
          highlight={highlight}
        />
      )}
    </SimpleTreeView>
  )
}

export default StyledTreeView
