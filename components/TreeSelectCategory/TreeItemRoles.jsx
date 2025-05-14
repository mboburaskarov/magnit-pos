import React, { useMemo, useRef } from 'react'
// import { TreeItem as MuiTreeItem } from '@mui/lab'
// import MuiTreeItem from '@mui/lab/TreeItem'
import { TreeItem as MuiTreeItem } from '@mui/x-tree-view/TreeItem'

import { Box } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Highlighter from 'react-highlight-words'
import InfoIcon from '../../src/assets/icons/InfoIcon'
import StyledTooltip from '../StyledTooltip'

const TreeItem = ({ items, selected, onSelect, disableMultiParentSelection, disabled = false, handleCreate, searchTerm, highlight }) => {
  const tree = useMemo(() => flattenTree({ items }), [items])
  const marksUncheckedRef = useRef(createMarksUnchecked({ tree, items, selected }))
  const activeParentRef = useRef('')

  const handleChange = ({ event, parents = [], children = [] }) => {
    const {
      target: { value, checked },
    } = event
    console.log('##1')

    let newSelect = selected.slice()
    if (checked) {
      console.log('##2')

      newSelect = [...parents, value].reverse().reduce(
        (prev, curr, index) => {
          const node = curr
          let newSelectSoFar = prev
          console.log('##3')

          if (index === 0) {
            const childNodes = getTreeNodes({ tree, node })
            const childNodesLength = childNodes.length
            if (childNodesLength > 0) {
              console.log('##4', childNodes, node, value)

              newSelectSoFar = [...newSelectSoFar, ...childNodes]
              // newSelectSoFar = [...newSelectSoFar?.filter((select) => !childNodes.includes(select))]

              // marksUncheckedRef.current = marksUncheckedRef?.current?.filter((marksUnchecked) => ![...childNodes, node].includes(marksUnchecked))
              marksUncheckedRef.current = [...marksUncheckedRef?.current, ...childNodes, value]
            }
          } else {
            console.log('##5')

            const childNodes = getTreeNodes({ tree, node })
            const childNodesLength = childNodes.length

            if (childNodesLength > 0) {
              const isEveryChildrenExist = childNodes.every((childNode) => newSelectSoFar.includes(childNode))
              console.log('##6')

              if (isEveryChildrenExist) {
                newSelectSoFar = [...newSelectSoFar.filter((select) => !childNodes.includes(select)), node]
                console.log('##7')

                marksUncheckedRef.current = marksUncheckedRef?.current?.filter((marksUnchecked) => ![...childNodes, node]?.includes(marksUnchecked))
              }
            }
          }
          console.log('##8')

          marksUncheckedRef.current = marksUncheckedRef?.current?.filter((marksUnchecked) => !newSelectSoFar?.includes(marksUnchecked))

          return newSelectSoFar
        },
        [...newSelect, value]
      )
      console.log('##9')
    } else if (!checked && !newSelect.includes(value)) {
      console.log('##10')

      let toExclude = value
      newSelect = parents
        .slice()
        .reverse()
        .reduce(
          (prev, curr, index) => {
            console.log('##11')

            const node = curr
            let newSelectSoFar = prev
            let childNodes

            marksUncheckedRef.current = [...new Set([...marksUncheckedRef.current, toExclude])]

            if (index === 0) {
              console.log('##12')

              childNodes = getTreeNodes({ tree, node, depth: 1 })
              newSelectSoFar = [...newSelectSoFar, ...childNodes.filter((childNode) => childNode !== toExclude)]
            } else {
              console.log('##13')

              childNodes = getTreeNodes({ tree, node, depth: 1 }).filter((childNode) => childNode !== toExclude)

              newSelectSoFar = [
                ...newSelectSoFar.filter((select) => !childNodes.includes(select)),
                ...childNodes.filter((childNode) => !marksUncheckedRef.current.includes(childNode)),
              ]
            }

            toExclude = curr

            return newSelectSoFar
          },

          newSelect.filter((select) => !parents.includes(select))
        )
      console.log('##14')
    } else {
      console.log('##15')
      ;[...parents, value]
        ?.slice()
        ?.reverse()
        ?.forEach((item) => {
          const node = item
          console.log('##16')

          const childNodes = getTreeNodes({ tree, node, depth: 1 })

          if (childNodes.length > 0) {
            console.log('##17')

            marksUncheckedRef.current = [...new Set([...marksUncheckedRef?.current, ...childNodes])]
          } else {
            console.log('##18')

            marksUncheckedRef.current = [...new Set([...marksUncheckedRef?.current, node])]
          }
        })
      const childnodes = children.map((a) => a.id)

      newSelect = newSelect?.filter((select) => !childnodes.includes(select) && select !== value && select != 'e14d59f2-0292-4c9e-a8b4-33c804208393')
    }
    console.log('##19')

    if (disableMultiParentSelection) {
      if (checked) {
        console.log('##20')

        activeParentRef.current = parents.length > 0 ? parents[0] : value
      } else {
        console.log('##21')

        const childNodes = getTreeNodes({
          tree,
          node: parents.length > 0 ? parents[0] : value,
        })

        console.log('##22')

        if (!childNodes.some((childNode) => newSelect.includes(childNode))) {
          console.log('##23')

          activeParentRef.current = ''
        }
      }
    }
    console.log('##24')

    onSelect([
      ...newSelect,
      // ...children?.filter((child) => child?.id !== 'create')?.map((el) => el?.id)
    ])
  }
  const renderTreeItem = ({ nodes, parents = [], level = 0 }) =>
    nodes?.map((node) => {
      const { id: value, name: label, description, children } = node

      // const checked = selected.includes(value)
      const checked = selected.includes(value)
      // const checked = selected.includes(value) || parents.some((parent) => selected.includes(parent))

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
                  display='inline-flex'
                >
                  {label}
                  <Box padding='14px 16px 1px 8px'>
                    <StyledTooltip title={description}>
                      <InfoIcon />
                    </StyledTooltip>
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
              handleChange({ event, parents, children })
            },
          },
          handleCreate,
          parents,
        })

        return (
          <MuiTreeItem itemId={value} key={value} nodeId={value} label={treeItemLabel}>
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
                display='inline-flex'
              >
                {label}
                <Box padding='14px 16px 1px 8px'>
                  <StyledTooltip title={description}>
                    <InfoIcon />
                  </StyledTooltip>
                </Box>
              </Box>
            ),
        },
        checkboxProps: {
          value,
          checked,
          disabled,
          onChange: (event) => {
            handleChange({ event, parents })
          },
        },
        handleCreate,
        parents,
      })

      return <MuiTreeItem itemId={value} key={value} nodeId={value} label={treeItemLabel} />
    }) || null

  return renderTreeItem({ nodes: items })
}

export default TreeItem

function flattenTree({ items, parent = 'root', depth = 0 }) {
  return items?.reduce((prev, curr) => {
    Object.assign(prev, { [parent]: [...(prev[parent] || []), curr.id] })

    if (curr.children && curr.children.length > 0) {
      return {
        ...prev,
        ...flattenTree({
          items: curr.children,
          depth: depth + 1,
          parent: curr.id,
        }),
      }
    }

    return prev
  }, {})
}

function createMarksUnchecked({ tree, items }) {
  return items?.reduce((prev, { id: node }) => [...prev, node, ...getTreeNodes({ tree, node })], [])
}

function createTreeItemLabel({ formControlLabelProps = {}, checkboxProps = {} }) {
  return (
    <FormControlLabel
      onClick={(event) => {
        event.stopPropagation()
      }}
      control={<Checkbox color='primary' {...checkboxProps} />}
      {...formControlLabelProps}
    />
  )
}

function getTreeNodes({ tree, node = 'root', depth, currentDepth = 1 }) {
  const branches = tree[node]

  if (!branches) {
    return []
  }

  return branches.reduce((prev, curr) => {
    let newPrev = [...prev, curr]

    if (tree[curr] && (typeof depth === 'undefined' || depth > currentDepth)) {
      newPrev = [
        ...newPrev,
        ...getTreeNodes({
          tree,
          node: curr,
          depth,
          currentDepth: currentDepth + 1,
        }),
      ]
    }

    return newPrev
  }, [])
}

function isIndeterminate({ tree, node: value, selected }) {
  return getTreeNodes({ tree, node: value }).some((node) => selected.includes(node))
}
