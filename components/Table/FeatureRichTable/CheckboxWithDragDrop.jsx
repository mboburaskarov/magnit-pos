import { useMemo } from 'react'
import { Checkbox, Box, FormControlLabel } from '@mui/material'
import DragDropIcon from '../../../src/assets/icons/DragDropIcon'
import { arrayMove, SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: 48,
    marginTop: 8,
    backgroundColor: theme.palette.gray[100],
    borderRadius: 16,
    justifyContent: 'space-between',
    zIndex: 1400,
    paddingRight: 16,
    paddingLeft: 16,
    '&:nth-of-type(1)': {
      marginTop: 0,
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
    color: theme.palette.gray[600],
  },
  dragdrop: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 85,
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

export default function CheckboxWithDragDrop({ data, checkAllField, setData, selectAllId }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const onSortEnd = (props) => {
    const { oldIndex, newIndex } = props
    const newList = arrayMove(data, oldIndex, newIndex)
    setData(newList)
    return newList
  }
  const handleChange = (propName, checked) => {
    const changedData = data.map((el) => {
      if (el.name === propName) {
        el.is_active = checked
      }
      return el
    })
    setData(changedData)
  }
  const handleAllCheckedChange = (e) => {
    const isChecked = e.target.checked
    const changedData = data.map((el) => el && { ...el, is_active: isChecked })
    setData(changedData)
  }
  const DragHandle = SortableHandle(() => (
    <div className={classes.dragdrop}>
      <DragDropIcon />
    </div>
  ))
  const SortableContainerBox = useMemo(() => SortableContainer(({ children }) => <Box>{children}</Box>), [])
  const SortableItem = useMemo(
    () =>
      SortableElement(({ data, handleChange }) => (
        <div className={classes.root}>
          <FormControlLabel
            control={<Checkbox name={data.name} />}
            onChange={(e) => {
              handleChange(data.name, e.target.checked)
            }}
            id={data.name}
            disabled={data?.always_active}
            checked={data?.is_active}
            name={data.name}
            label={data.label?.ru || data.label}
          />
          <DragHandle />
        </div>
      )),
    []
  )
  return (
    <>
      {checkAllField && (
        <Box className={classes.header}>
          <FormControlLabel
            control={<Checkbox name='toggle_all' id={selectAllId ? selectAllId : 'toggle_all'} />}
            onChange={handleAllCheckedChange}
            checked={data?.filter((el) => el.id !== 'selection')?.every((el) => el?.is_active)}
            label={t('menu.products.import.nav.select_all')}
          />
        </Box>
      )}
      <SortableContainerBox onSortEnd={onSortEnd} useDragHandle>
        {data?.map(
          (item, index) =>
            item.id !== 'selection' && <SortableItem key={`item-${item.id}`} index={index} data={item} handleChange={handleChange} classes={classes} />
        )}
      </SortableContainerBox>
    </>
  )
}
