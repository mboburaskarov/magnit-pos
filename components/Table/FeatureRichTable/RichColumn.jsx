import { Box, ClickAwayListener, Typography } from '@mui/material'
import useDeepCompareEffect from '../../../src/hooks/useDeepCompareEffect'
import ArrowDown from 'icons/ArrowDown'
import HamburgerIcon from 'icons/HamburgerIcon'
import React, { useCallback, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { resetColumnsWidth, resetTableHeader, updateTableColumnProperty } from 'store/actions/tableHeaderActions/tableHeaderActions'
import debounce from 'utils/debounce'
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PinIcon from 'icons/PinIcon'
import colors from 'theme/mui.config'
import { SortableHandle } from 'react-sortable-hoc'
import DragDropMoveIcon from 'icons/DragDropMoveIcon'
import TrashFilledIcon from 'icons/TrashFilledIcon'
import getTextWidth from 'utils/getTextWidth'
import useStyles from './useStyles'
import { Typography } from '@mui/material'

const DragHandle = SortableHandle(({ children }) => <>{children}</>)
export default function RichColumn({
  accessor,
  label,
  canBeSorted = true,
  sortBy,
  setSortBy,
  resizeProps,
  column,
  canBeResized = true,
  canBeDragged = true,
  hasMenu = true,
  rows,
  columns,
}) {
  const [open, setOpen] = useState(false)
  const isResizing = useRef(false)
  const dispatch = useDispatch()
  const columnRef = useRef()
  const [menuOptions, setMenuOptions] = useState([])
  const classes = useStyles({
    isBeingSorted: sortBy?.includes(accessor),
    decending: sortBy?.includes(accessor) && sortBy.startsWith('-'),
    menuOpen: open,
  })
  const changeColumnWidth = useCallback(
    debounce((name, width) => dispatch(updateTableColumnProperty(name, { width })), 500),
    []
  )
  const calculateMaxCellWidth = (columnId, columnLabel) => {
    const cells = rows?.map((row) => row?.values?.[columnId] ?? '')
    const cellsWidth = cells.map((cell) => getTextWidth(cell, `normal normal 600 16px "Inter"`))
    const columnWidth = getTextWidth(columnLabel || '', `normal normal 600 16px "Inter"`)
    const maxCellWidth = Math.max(...cellsWidth, columnWidth)
    const result = Number.isFinite(maxCellWidth) ? maxCellWidth + 52 : 0
    return result
  }
  useDeepCompareEffect(
    () => {
      changeColumnWidth(column.id, column.width)
    },
    [column?.width],
    { initialEffect: false }
  )
  useDeepCompareEffect(() => {
    const updatedMenuOptions = [
      {
        label: 'Закрепить колонку',
        icon: <PinIcon />,
        childrenAsOption: true,
        children: [
          {
            label: 'Закрепить слева',
            selected: column?.sticky === 'left',
            handleClick() {
              dispatch(
                updateTableColumnProperty(
                  column.id,
                  { sticky: 'left', borderRight: true },
                  {
                    shouldChangeStickySequence: true,
                  }
                )
              )
            },
          },
          {
            label: 'Закрепить справа',
            selected: column?.sticky === 'right',
            handleClick() {
              dispatch(
                updateTableColumnProperty(
                  column.id,
                  { sticky: 'right', borderLeft: true },
                  {
                    shouldChangeStickySequence: true,
                  }
                )
              )
            },
          },
          {
            label: 'Не закреплять',
            selected: !['left', 'right'].includes(column?.sticky),
            handleClick() {
              dispatch(
                updateTableColumnProperty(
                  column.id,
                  {
                    sticky: undefined,
                    borderLeft: undefined,
                    borderRight: undefined,
                  },
                  {
                    shouldChangeStickySequence: true,
                  }
                )
              )
            },
          },
        ],
        borderBottom: true,
      },
      {
        label: 'Автоматически задавать размер этой колонки',
        icon: '',
        handleClick() {
          const width = calculateMaxCellWidth(column.id, label) || column.default_width
          dispatch(
            updateTableColumnProperty(column.id, {
              width,
            })
          )
        },
      },
      {
        label: 'Автоматически задавать размер всем колонкам',
        icon: '',
        borderBottom: true,
        handleClick() {
          const columnsWidth = columns.map((el) => ({
            width: calculateMaxCellWidth(el.id, el.HeaderLabel),
            accessor: el.id,
          }))
          dispatch(resetColumnsWidth(columnsWidth))
        },
      },
      ...(column.can_be_grouped
        ? [
            {
              label: `${column.grouped ? 'Разгруппировать' : 'Группировать по'} “${column.HeaderLabel}”`,
              icon: <FontAwesomeIcon icon={faAlignLeft} color={colors.blue[500]} />,
              borderBottom: true,
              handleClick() {
                dispatch(
                  updateTableColumnProperty(column.id, {
                    grouped: !column.grouped,
                  })
                )
              },
            },
          ]
        : []),
      {
        label: 'Сбросить столбцы',
        icon: '',
        children: [],
        handleClick() {
          dispatch(resetTableHeader())
        },
      },
    ]
    setMenuOptions(updatedMenuOptions)
  }, [column?.sticky, column?.grouped, rows?.map((row) => row?.values || ''), columns?.map((col) => col.id)])
  const renderColumnInner = () => (
    <Box display='flex' alignItems='center' flex='1'>
      {canBeDragged && (
        <>
          <span className='drag-drop-icon'>
            <DragDropMoveIcon />
          </span>
          <span className='trash-icon'>
            <TrashFilledIcon />
          </span>
        </>
      )}
      <Box
        onMouseDown={() => {
          isResizing.current = new Date().getTime()
        }}
        onMouseUp={() => {
          const difference = new Date().getTime() - isResizing.current
          if (canBeSorted && difference < 300) {
            if (sortBy === accessor) {
              setSortBy(`-${accessor}`)
            } else if (sortBy === `-${accessor}`) {
              setSortBy('')
            } else {
              setSortBy(accessor)
            }
          }
        }}
        display='flex'
        alignItems='center'
        className={classes.rich_column_inner}
      >
        {column.grouped && <span className={`${classes.rich_column_grouped} grouped_ball`} />}
        <Typography width='min-content'>{label}</Typography>
        {canBeSorted && <ArrowDown className={`${classes.rich_column_arrow} sort_arrow`} />}
      </Box>
      {hasMenu && (
        <HamburgerIcon
          className={`${classes.rich_column_menu} column-ham`}
          style={{
            fill: open ? colors.blue[500] : undefined,
          }}
          onMouseDown={() => {
            isResizing.current = new Date().getTime()
          }}
          onMouseUp={() => {
            const difference = new Date().getTime() - isResizing.current
            if (difference < 300) {
              setOpen((old) => !old)
            }
          }}
        />
      )}
    </Box>
  )
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box className={classes.rich_column_root} ref={columnRef}>
        {canBeDragged ? <DragHandle>{renderColumnInner()}</DragHandle> : renderColumnInner()}

        {canBeResized && <Box {...resizeProps} className={classes.rich_column_resizer} />}
      </Box>
    </ClickAwayListener>
  )
}
