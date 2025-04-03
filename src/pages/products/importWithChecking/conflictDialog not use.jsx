import { Box, Dialog, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import React, { useRef } from 'react'
import SerchedItem from '../../sales/new-order/SerchedItem'
import { useHotkeys } from 'react-hotkeys-hook'
import { requests } from '../../../../utils/requests'
import { useMutation } from 'react-query'
import errorAudio from '../../../assets/audio/error.mp3'
import successAudio from '../../../assets/audio/normal.mp3'
import overplusAudio from '../../../assets/audio/overplus.mp3'
import { error } from '../../../../utils/toast'
import { useParams } from 'react-router-dom'
import { set } from 'lodash'
const useStyles = makeStyles((theme) => ({
  root: {
    '& .main': {
      maxHeight: '80vh',
      overflowY: 'auto',
    },
    '& .MuiPaper-root ': {
      padding: '20px',
      height: '80vh',

      borderRadius: '20px',
      backgroundColor: '#f0f0f0',
    },
  },
  avatar: {
    width: 30,
    borderRadius: '50%',
  },
  overlay: {
    cursor: 'pointer',
    position: 'fixed',
    backgroundColor: theme.palette.black + '60',
    zIndex: ({ searchTerm }) => (searchTerm ? 101 : 24),
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  quick_search: {
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
  },
  itemPrice: {
    fontWeight: '500',
    lineHeight: '24px',
    fontSize: '16px',
    color: theme.palette.bunker[950],
  },
  searchResult: {
    height: '100vh',
    overflowY: 'auto',
    zIndex: 27,
    '&::-webkit-scrollbar': {
      background: 'transparent',
      width: 6,
    },
    '&::-webkit-scrollbar-thumb': {
      background: theme.palette.gray[300],
      width: 6,
      borderRadius: 2,
    },
  },
  searchImage: {
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    width: '48px',
    minWidth: '48px',
    height: '48px',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  itemName: {
    marginBottom: 4,
    color: theme.palette.orange[500],
    // width: 300,
    fontWeight: '600',
    lineHeight: '24px',
    fontSize: '16px',
    wordWrap: 'break-word',
    '& .highlighter': {
      backgroundColor: theme.palette.orange[150],
      padding: '4px 1px',
      borderRadius: '4px',
      color: theme.palette.orange[500],
    },
  },
  itemBarcode: {
    fontWeight: '500',
    lineHeight: '20px',
    fontSize: '14px',
    color: theme.palette.bunker[500],
  },
  itemQuantity: {
    fontWeight: '500',
    lineHeight: '20px',
    fontSize: '14px',
    color: theme.palette.bunker[500],
  },
  searchItemBox: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    maxHeight: '90px',
    backgroundColor: '#fff',
    padding: '12px 30px 12px 16px',
    borderRadius: 16,
  },
  searchItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    width: '100%',
    minHeight: 72,
    flexDirection: 'column',
    marginTop: 16,
    borderRadius: 16,
    position: 'relative',
    zIndex: 100,
    cursor: 'pointer',
  },
  currentUser: {
    maxWidth: '200px',
    height: '48px',
    padding: '4px 12px 4px 4px !important',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.gray[50],
    borderRadius: '32px !important',
  },
  avatarPlaceholder: {
    position: 'relative',
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 12,
    fontWeight: 600,
    fontSize: 16,
    backgroundColor: theme.palette.orange[500],
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    color: '#fff',
    transition: '0.3s',
    '& img': {
      width: '100%',
    },
  },
  bonus_amount: {
    width: 130,
    margin: 0,
    lineHeight: '19px',
    fontWeight: 600,
    fontFamily: "'Gilroy', sans-serif",
    color: theme.palette.orange[500],
    fontSize: 16,
    transition: 'all .2s',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'left',
  },
  shopname: {
    margin: 0,
    lineHeight: '20px',
    fontWeight: 600,
    fontFamily: "'Gilroy', sans-serif",
    color: theme.palette.bunker[400],
    fontSize: 14,
    transition: 'all .2s',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'left',
  },
  username: {
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: '600',
    lineHeight: '24px',
    fontSize: '16px',
    color: theme.palette.bunker[950],
  },
}))
function ConflictDialog({ open, setOpen, conflictList, setBarcode, refetch, manualNumber }) {
  const searchItemRef = useRef([])
  const { id } = useParams()
  const errorScanAudio = new Audio(errorAudio)
  const successScanAudio = new Audio(successAudio)
  const overplusScanAudio = new Audio(overplusAudio)
  const handleClose = () => {
    setOpen(false)
    if (setDisableSubmit) {
      setDisableSubmit(false)
    }
  }
  const classes = useStyles()
  let a = -1
  const selectDownItems = () => {
    if (a == searchItemRef.current.length - 1) {
      a = 0
    } else {
      a = a + 1
    }

    const nextInput = searchItemRef.current[a]
    if (nextInput) {
      nextInput.focus()
    }
  }
  const selectUpItems = () => {
    if (a == 0) {
      a = searchItemRef.current.length - 1
    } else {
      a = a - 1
    }
    const nextInput = searchItemRef.current[a]

    if (nextInput) {
      nextInput.focus()
    }
  }
  const { mutate: addScanById, isLoading: isAddScanById } = useMutation(requests.sendScannedImportById, {
    onSuccess: ({ data }) => {
      setOpen(false)
      refetch()
      setBarcode('')
      if (get(data, 'data.surplus')) {
        overplusScanAudio.play()
      } else {
        successScanAudio.play()
      }
    },
    onError: (err) => {
      console.log(err)
      setOpen(false)
      errorScanAudio.play()
      error('Ошибка при сканирование!')
    },
  })
  useHotkeys('ArrowDown', (event) => selectDownItems(event), { enableOnFormTags: true })

  useHotkeys('ArrowUp', (event) => selectUpItems(event), { enableOnFormTags: true })

  useHotkeys(
    'Enter',
    (event) => {
      if (document.activeElement.id?.length === 36) {
        addScanById({ id: document.activeElement.id, import_id: id, count: manualNumber })
      }
    },
    {
      enableOnFormTags: true,
      enableOnTags: ['INPUT', 'TEXTAREA'],
    }
  )
  return (
    <Dialog onClose={handleClose} open={open} className={classes.root} disableScrollLock>
      <Typography fontWeight={'700'} fontSize={'25px'} m={'10px 0'} width={'100%'} textAlign={'center'}>
        Выберите продукт
      </Typography>
      <Box className='main'>
        {conflictList?.map((item, index) => (
          <SerchedItem
            isChild={true}
            conflictItem={true}
            discount={0}
            index={0}
            handleAddProduct={(a) => addScanById({ id: a.store_product_id, import_id: a.sale_id, count: manualNumber })}
            setSearchTerm={() => {}}
            item={item}
            itemRef={(el) => (searchItemRef.current[index] = el)}
            product={item?.product}
            searchTerm={''}
            classes={classes}
          />
        ))}
      </Box>
    </Dialog>
  )
}

export default ConflictDialog
