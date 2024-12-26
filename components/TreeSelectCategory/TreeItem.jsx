import { memo, useCallback, useMemo } from 'react'
import MuiTreeItem from '@mui/lab/TreeItem'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Highlighter from 'react-highlight-words'
import { Box } from '@mui/material'
import PencilIcon from '../../src/assets/icons/EditIcon'
import { get } from 'lodash'

const TreeItem = ({ items, selected, onSelect, disabled = false, handleCreate, searchTerm, highlight }) => {
  const tree = useMemo(() => flattenTree(items), [items])

  const handleChange = useCallback(
    ({ event }) => {
      const {
        target: { value, checked },
      } = event

      let newSelect = selected.slice()
      const foundRow = tree.find((el) => el.id === value)
      const childIds = getChildIds(foundRow)

      if (checked) {
        newSelect = [...selected, ...(childIds || [])]?.filter((v, i, a) => a.indexOf(v) === i)
      } else if (!checked && childIds?.some((elem) => newSelect?.includes(elem))) {
        const excludeAll = childIds?.every((elem) => selected?.includes(elem))
        if (excludeAll) {
          newSelect = [...newSelect?.filter((select) => !childIds?.includes(select))]
        } else {
          newSelect = [...selected, ...(childIds || [])]?.filter((v, i, a) => a.indexOf(v) === i)
        }
      } else {
        newSelect = [...newSelect?.filter((select) => !childIds?.includes(select))]
      }
      onSelect([...newSelect])
    },
    [selected, tree, onSelect]
  )

  const renderTreeItem = useCallback(
    ({ nodes, parents = [], level = 0 }) =>
      nodes?.map((node) => {
        const { id: value, name: label, children } = node

        const firstParentId = getParentIds(value, items)[0]

        const foundRow = tree.find((el) => el.id === value)
        const childIds = getChildIds(foundRow)

        const checked = selected.includes(value) || childIds?.every((elem) => selected?.includes(elem))

        if (children && children.length > 0) {
          const indeterminate = isIndeterminate({ tree, selected, node: value })
          const treeItemLabel = createTreeItemLabel({
            formControlLabelProps: {
              label:
                searchTerm && highlight ? (
                  <Highlighter highlightClassName='highlighter' searchWords={searchTerm?.split(' ')} autoEscape textToHighlight={label} />
                ) : (
                  <Box
                    sx={(theme) => ({
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      color: theme.palette.gray[600],
                    })}
                  >
                    {label}
                    <Box
                      onClick={(e) => {
                        if (disabled) return
                        e.stopPropagation()
                        e.preventDefault()
                        handleCreate({ id: value, parentId: firstParentId })
                      }}
                      mt={1}
                    >
                      <PencilIcon />
                    </Box>
                  </Box>
                ),
            },
            checkboxProps: {
              value,
              checked,
              disabled,
              indeterminate,
              onChange: (event) => {
                handleChange({ event })
              },
            },
            handleCreate,
            parents,
          })

          return (
            <MuiTreeItem key={value} nodeId={value} label={treeItemLabel}>
              {renderTreeItem({
                nodes: children,
                parents: [value],
                level: level + 1,
              })}
            </MuiTreeItem>
          )
        }

        const treeItemLabel = createTreeItemLabel({
          formControlLabelProps: {
            label:
              searchTerm && highlight ? (
                <Highlighter highlightClassName='highlighter' searchWords={searchTerm?.split(' ')} autoEscape textToHighlight={label} />
              ) : (
                <Box
                  sx={(theme) => ({
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    color: theme.palette.gray[600],
                  })}
                >
                  {label}
                  <Box
                    onClick={(e) => {
                      if (disabled) return
                      e.stopPropagation()
                      e.preventDefault()
                      handleCreate({ id: value, parentId: firstParentId })
                    }}
                    mt={1}
                  >
                    <PencilIcon />
                  </Box>
                </Box>
              ),
          },
          checkboxProps: {
            value,
            checked,
            disabled,
            onChange: (event) => {
              handleChange({ event })
            },
          },
          handleCreate,
          parents,
        })

        return <MuiTreeItem key={value} nodeId={value} label={treeItemLabel} />
      }) || null,
    [tree, selected, items, searchTerm, highlight, disabled, handleCreate, handleChange]
  )

  return renderTreeItem({ nodes: items })
}

export default memo(TreeItem)

function flattenTree(items) {
  const flat = (array) => {
    let result = []
    array.forEach(function (a) {
      result.push(a)
      if (Array.isArray(a.subRows)) {
        result = result.concat(flat(a.subRows))
      }
    })
    return result
  }
  return flat(items)
}

const getChildIds = (row) => {
  if (!row) return
  const result = []
  const traverse = (el) => {
    if (el.subRows?.length === 0) {
      result.push(el.id)
    } else {
      el.subRows?.forEach(traverse)
    }
  }
  traverse(row)
  return result
}

function createTreeItemLabel({ formControlLabelProps = {}, checkboxProps = {} }) {
  return (
    <FormControlLabel
      onClick={(event) => event.stopPropagation()}
      sx={{ width: '100%', '.MuiFormControlLabel-label': { width: '100%' } }}
      control={<Checkbox color='primary' {...checkboxProps} />}
      {...formControlLabelProps}
    />
  )
}

function isIndeterminate({ tree, node: value, selected }) {
  const foundRow = tree.find((el) => el.id === value)
  return !getChildIds(foundRow)?.every((elem) => selected?.includes(elem)) && getChildIds(foundRow)?.some((elem) => selected?.includes(elem))
}

const getParentIds = (target, children, parents = []) => {
  for (let node of children) {
    if (node.id === target) {
      return parents.concat(node.id)
    }
    const found = getParentIds(target, get(node, 'subRows', []), parents.concat(node.id))
    if (found) {
      return found
    }
  }
  return undefined
}
