import Highlighter from 'react-highlight-words'
import { Box, Button, Tooltip, Typography } from '@mui/material'
// import Button from 'components/Buttons/Button'
// import Tooltip from 'components/Tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const list = [
  { accessor: 'name', is_active: true },
  { accessor: 'quantity', is_active: true },
  { accessor: 'action', is_active: true },
]

const tableHeadersCategories = (searchTerm, setCategoryDrawer, setCreateEdit, status, type, setOpenConfirm, t) => {
  return list?.map((item) => {
    switch (item.accessor) {
      case 'name':
        return {
          ...item,
          width: 1000,
          Cell: ({ row }) =>
            row.canExpand ? (
              <span
                style={{
                  paddingLeft: `${row.depth * 2}rem`,
                  display: 'inline-flex',
                }}
              >
                {row.isExpanded ? (
                  <FontAwesomeIcon style={{ color: '#4993DD', marginRight: 8 }} icon={faChevronDown} />
                ) : (
                  <FontAwesomeIcon style={{ color: '#4993DD', marginRight: 8 }} icon={faChevronRight} />
                )}
                {row.original.name !== '' ? (
                  <Highlighter
                    highlightClassName='highlighter'
                    searchWords={searchTerm ? searchTerm?.split(' ') : []}
                    autoEscape
                    textToHighlight={row.original.name}
                  />
                ) : (
                  <Typography style={{ color: '#bdbdbd' }}>{t('table_columns.absent')}</Typography>
                )}
              </span>
            ) : row.original.name !== '' ? (
              <Highlighter
                style={{ paddingLeft: `${row.depth * 2}rem` }}
                highlightClassName='highlighter'
                searchWords={searchTerm ? searchTerm?.split(' ') : []}
                autoEscape
                textToHighlight={row.original.name}
              />
            ) : (
              <Typography style={{ paddingLeft: `${row.depth * 2}rem`, color: '#bdbdbd' }}>{t('table_columns.absent')}</Typography>
            ),
          Header: t('table_columns.name'),
        }

      case 'quantity':
        return {
          ...item,
          Cell: ({ row }) => (
            <Box
              onClick={() =>
                row?.original?.product_count &&
                setCategoryDrawer({
                  id: row?.original?.id,
                  name: row.original.name,
                  isSub: row.original.parent_id !== '',
                })
              }
              color={!!row?.original?.product_count ? '#4993DD' : '#BDBDBD'}
            >
              {row?.original?.product_count}
            </Box>
          ),
          Header: t('table_columns.amount'),
          minWidth: 150,
        }
      case 'action':
        return {
          ...item,
          Cell: ({ row }) => (
            <Box display='inline-flex'>
              {status === 'deleted' ? (
                <Tooltip title={t('buttons.restore')} placement='top'>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenConfirm({
                        type,
                        id: row.original.id,
                        isDelete: false,
                      })
                    }}
                    recover
                    square
                  />
                </Tooltip>
              ) : (
                <>
                  <Tooltip title={t('buttons.edit')} placement='top'>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        setCreateEdit({ type, id: row?.original?.id })
                      }}
                      square
                      edit
                    />
                  </Tooltip>
                  <Box width={16} />
                  <Tooltip title={t('buttons.delete')} placement='top'>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenConfirm({
                          type,
                          id: row.original.id,
                          isDelete: true,
                        })
                      }}
                      square
                      trash
                    />
                  </Tooltip>
                </>
              )}
            </Box>
          ),
          Header: t('table_columns.action'),
        }

      default:
        return item
    }
  })
}
export default tableHeadersCategories
