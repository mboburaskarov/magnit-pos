import React, { memo, useMemo } from 'react'
import { Checkbox, Box, FormControlLabel } from '@mui/material'
import { arrayMove, sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
// import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import DragDropIcon from '../../src/assets/icons/DragDropIcon'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: 48,
    marginTop: 8,
    backgroundColor: theme.palette.bg[10],
    borderRadius: 12,
    justifyContent: 'space-between',
    zIndex: 1400,
    paddingRight: 16,
    borderBottom: `1px solid ${theme.palette.bunker[100]}`,
    paddingLeft: 16,
    '& label': {
      margin: 0,
      '& span': {
        margin: '0 8px 0 0',
      },
    },
    '&:nth-of-type(1)': {
      marginTop: 0,
    },
    '& [type=checkbox]': {
      'accent-color': 'green',
      backgroundColor: '#fff',
      color: '#000',
      border: '0.25rem solid green',
    },

    /* Pseudo element for check styling */

    '& [type=checkbox]::before': {
      content: '',
      'accent-color': 'green',
      backgroundColor: '#fff',
      color: '#000',
    },
    '& [type=checkbox]::after': {
      content: '',
      'accent-color': 'green',
      backgroundColor: '#fff',
      color: '#000',
    },

    /* Checked */

    '& [type=checkbox]:checked': {
      'accent-color': 'green',
      backgroundColor: '#fff',
      color: '#000',
    },

    '& [type=checkbox]:checked::before': {
      'accent-color': 'green',
      backgroundColor: '#fff',
      color: '#000',
    },

    /* Disabled */

    '& [type=checkbox]:disabled': {
      'accent-color': 'green',
      backgroundColor: '#fff',
      color: '#000',
    },
  },
  label: {
    flex: '1 0 90%',
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    cursor: 'pointer',
    fontSize: theme.fontSize.base,
    fontWeight: 600,
    lineHeight: '19px',
    margin: '0 !important',
    color: theme.palette.gray[600],
  },
  dragdrop: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 20,
    height: '100%',
    cursor: 'n-resize',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 16,
    paddingLeft: 16,
    '& h3': {
      fontWeight: 600,
    },
  },
}))

function CheckboxWithDragDrop({ data, checkAllField, setData, dragHandle = true, customId }) {
  const classes = useStyles()
  const onSortEnd = (props) => {
    const { oldIndex, newIndex } = props
    const newList = arrayMove(data, oldIndex, newIndex)

    setData(newList)
    return newList
  }
  const handleChange = (propName, checked) => {
    const changedData = data?.map((el) => {
      if (el.name === propName) {
        el.hide = !checked
      }
      return el
    })

    setData(changedData)
  }

  const DragHandle = sortableHandle(() => (
    <div className={classes.dragdrop}>
      <DragDropIcon />
    </div>
  ))
  const SortableContainer = useMemo(() => sortableContainer(({ children }) => <Box>{children}</Box>), [classes])
  const SortableItem = useMemo(
    () =>
      sortableElement(({ data, handleChange }) => (
        <div className={classes.root}>
          <FormControlLabel
            control={<Checkbox name={data?.name} />}
            onChange={(e) => {
              handleChange(data?.name, e.target.checked)
            }}
            id={data?.name}
            disabled={data?.always_active}
            checked={!data?.hide}
            name={data?.name}
            label={data?.label?.ru || data?.label}
          />
          {dragHandle && <DragHandle />}
        </div>
      )),
    [classes]
  )

  return (
    <Box width={'100%'}>
      <SortableContainer onSortEnd={onSortEnd} useDragHandle>
        {data?.map(
          (item, index) =>
            item?.colId !== 'checkboxSelectionField' && (
              <SortableItem key={`item-${item?.colId}`} index={index} data={item} handleChange={handleChange} classes={classes} />
            )
        )}
      </SortableContainer>
    </Box>
  )
}

export default memo(CheckboxWithDragDrop)
