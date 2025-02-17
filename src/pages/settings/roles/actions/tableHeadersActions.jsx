import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import Highlighter from 'react-highlight-words'
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { get } from 'lodash'
import DeleteIcon from '../../../../assets/icons/DeleteIcon'
import EditIcon from '../../../../assets/icons/EditIcon'

const list = [
  { accessor: 'name', is_active: true },
  { accessor: 'quantity', is_active: true },
  { accessor: 'action', is_active: true },
]

const tableHeadersActions = (searchTerm, setCategoryDrawer, setCreateEdit, status, type, setOpenConfirm, t, setConfirmToDelete) => {
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
                    variant=''
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
                      sx={{ borderRadius: '15px', width: '50px', height: '50px' }}
                      // variant=''
                      onClick={(e) => {
                        e.stopPropagation()
                        setCreateEdit({ type, id: row?.original?.id, parentId: get(row, 'original.parent_id') || get(row, 'original.id') })
                      }}
                    >
                      <IconButton
                        // onClick={() => navigate(`/products/edit/${data.id}`)}
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: 'transparent',
                          borderRadius: 3,
                          p: '8px',
                          '&:hover': {
                            backgroundColor: 'transparent',
                          },
                        }}
                      >
                        <EditIcon color='#fff' />
                      </IconButton>
                    </Button>
                  </Tooltip>
                  <Box width={16} />
                  <Tooltip title={t('buttons.delete')} placement='top'>
                    <Button
                      sx={{ borderRadius: '15px', width: '50px', height: '50px' }}
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
                    >
                      <IconButton
                        backgroundColor='#fe5000'
                        onClick={() => setConfirmToDelete(row?.original?.id)}
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: 'transparent',
                          borderRadius: 3,
                          p: '8px',
                          '&:hover': {
                            backgroundColor: 'transparent',
                          },
                        }}
                      >
                        <DeleteIcon color='#fff' />
                      </IconButton>
                      {/* <Delete /> */}
                    </Button>
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
export default tableHeadersActions
