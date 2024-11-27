/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */
import { memo, useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import StyledDialog from '../Dialogs/StyledDialog'
import CheckboxWithDragDrop from './CheckboxWithDragDrop'
import { useDispatch, useSelector } from 'react-redux'
import StyledEmptyDialog from '../Dialogs/StyledeEmptyDialog'
import CloseIcon from '../../src/assets/icons/CloseIcon'
import EditorIcon from '../../src/assets/icons/EditorIcon'
import { changeColumnSequence, resetTableHeader } from '../../src/redux-toolkit/tableSlices/productsTableColumns'
import ButtonWithWrapper from '../Buttons/ButtonWithWrapper'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme) => ({
  container: {
    maxHeight: 'calc(100vh - 160px)',
    display: 'flex',
    flexDirection: 'column',
  },
  inner: {
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      background: 'transparent',
      width: 16,
    },
  },

  btn: {
    cursor: 'pointer',
    // marginLeft: 10,
    // height: 40,
    // width: 40,

    // borderRadius: '50%',
    // display: 'flex',
    // cursor: 'pointer',
    // alignItems: 'center',
    // justifyContent: 'center',
    // background: theme.palette.grey[100],
    // border: `1px solid ${theme.palette.grey[200]}`,
    // transition: 'all 0.3s ease',
    '&:hover': {
      background: `${theme.palette.bunker[100]} !important`,
      // border: `none`,
      // '& > svg > path': {
      //   fill: `#fff !important`,
      // },
    },
  },
}))

const SELECTION_ID = 'checkboxSelectionField'

function ColumnsFilterButton({ columns, title, applyBtnLabel }) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [data, setData] = useState([])
  const [selection, setSelection] = useState(false)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  useEffect(() => {
    if (columns) {
      const formattedData = columns
        ?.filter((el) => !el.is_temporary && el.colId !== SELECTION_ID)
        ?.map((el) => ({
          ...el,
          label: el.headerName,
          desc: el.desc,
          name: el.colId,
          always_active: el?.always_active ?? el?.always_active,
        }))

      setSelection(columns?.filter((el) => el.colId === SELECTION_ID)?.length > 0)
      setData(formattedData)
    }
  }, [columns])

  const handleApply = () => {
    setOpen(false)

    dispatch(changeColumnSequence(data))
  }

  const resetTableHeaders = () => {
    setOpen(false)

    dispatch(resetTableHeader())
  }

  return (
    <>
      <ButtonWithWrapper onClick={() => setOpen(true)} icon={<EditorIcon />} />

      <StyledEmptyDialog
        open={open}
        onClose={() => setOpen(false)}
        title={title || 'Jadval sozlamalari'}
        buttonId='submit-button'
        customButtons={<CloseIcon onClick={() => setOpen(false)} />}
        customOnSubmit={handleApply}
      >
        <Box p={'24px'} className={classes.container}>
          <Box className={classes.inner}>
            <CheckboxWithDragDrop
              data={data?.filter((item) => {
                if (item?.colId === 'actfion' || item?.colId === 'supply_price_usd') return false
                return true
              })}
              checkAllField
              setData={setData}
            />
            <Box columnGap={2} display='flex' width='100%' mt={'24px'}>
              <Button
                sx={{ bgcolor: '#fff !important', height: 48, border: '1px solid #ECEDF2' }}
                fullWidth
                color='secondary'
                variant='contained'
                // disabled={!formState.isDirty}
                onClick={resetTableHeaders}
              >
                <Typography fontWeight={600} lineHeight={'24px'} fontSize={'16px'}>
                  {t('filter_dialog.reset.label')}
                </Typography>
              </Button>
              <Button sx={{ height: 48 }} onClick={() => handleApply()} fullWidth variant='contained' type='submit'>
                {t('filter_dialog.save.label')}
              </Button>
            </Box>
          </Box>
        </Box>
      </StyledEmptyDialog>
    </>
  )
}

export default memo(ColumnsFilterButton)
