import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import { get } from 'lodash'
import Highlighter from 'react-highlight-words'
import DeleteIcon from '@icons/DeleteIcon'
import EditIcon from '@icons/EditIcon'
import CustomImg from '@components/CustomImg'

const list = [
  { accessor: 'name', is_active: true },
  { accessor: 'quantity', is_active: true },
  { accessor: 'action', is_active: true },
]

const tableHeadersCategories = ({ searchTerm, setOpenImageGallery, setCreateEdit, t, setConfirmToDelete }) => {
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
              >fdfd
                {row.isExpanded ? (
                  <FontAwesomeIcon style={{ color: '#fe5000', marginRight: 8 }} icon={faChevronDown} />
                ) : (
                  <FontAwesomeIcon style={{ color: '#fe5000', marginRight: 8 }} icon={faChevronRight} />
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
             <Box display={'flex'} alignItems="center" gap={1} >
             <Box sx={{
              borderRadius:'50%',
              // bgcolor:'grey.300',
              width: 32,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
              overflow: 'hidden',
              p: 0.5,
               img: {
                 width:'25px',
                 height: '25px',
                 objectFit: 'cover'
               }
             }}>
             <CustomImg onClick={() => setOpenImageGallery({isOpen:true, data: [row.original.photo]})} src={row.original.photo} />
             </Box>
              <Highlighter
                style={{ paddingLeft: `${row.depth * 2}rem` }}
                highlightClassName='highlighter'
                searchWords={searchTerm ? searchTerm?.split(' ') : []}
                autoEscape
                textToHighlight={row.original.name}
              />
              </Box>
            ) : (
              <Typography style={{ paddingLeft: `${row.depth * 2}rem`, color: '#bdbdbd' }}>{t('table_columns.absent')}</Typography>
            ),
          Header: t('table_columns.name'),
        }

      case 'action':
        return {
          ...item,
          Cell: ({ row }) => (
            <Box display='inline-flex'>
              <>
                <Tooltip title={t('buttons.edit')} placement='top'>
                  <Button
                    sx={{ borderRadius: '15px', width: '50px', height: '50px' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCreateEdit({ type: 'categories', id: row?.original?.id, parentId: get(row, 'original.parent_id') || get(row, 'original.id') })
                    }}
                  >
                    <IconButton
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
                  <Button sx={{ borderRadius: '15px', width: '50px', height: '50px' }} square trash>
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
                  </Button>
                </Tooltip>
              </>
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
