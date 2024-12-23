/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */
import { memo, useEffect, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import StyledDialog from '../Dialogs/StyledDialog'
import CheckboxWithDragDrop from './CheckboxWithDragDrop'
import { useDispatch, useSelector } from 'react-redux'
import StyledEmptyDialog from '../Dialogs/StyledeEmptyDialog'
import CloseIcon from '../../src/assets/icons/CloseIcon'
import EditorIcon from '../../src/assets/icons/EditorIcon'
import ButtonWithWrapper from '../Buttons/ButtonWithWrapper'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme) => ({
  container: {
    maxHeight: 'calc(100vh - 160px)',
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
  },
  inner: {
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      background: 'transparent',
      width: 16,
    },
    paddingTop: '24px',
    paddingBottom: '100px',
  },

  btn: {
    cursor: 'pointer',

    '&:hover': {
      background: `${theme.palette.bunker[100]} !important`,
    },
  },
}))

const SELECTION_ID = 'checkboxSelectionField'

function ColumnsFilterButtonForAll({ columns, title, changeColumnSequence, resetTableHeader }) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [data, setData] = useState([])
  const [selection, setSelection] = useState(false)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  useEffect(() => {
    if (columns) {
      const formattedData = columns
        ?.filter((el) => !el?.is_temporary && el?.colId !== SELECTION_ID)
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
  const theme = useTheme()
  return (
    <>
      <ButtonWithWrapper onClick={() => setOpen(true)} icon={<EditorIcon color={theme.palette.black} />} />

      <StyledEmptyDialog
        open={open}
        onClose={() => setOpen(false)}
        title={title || 'Jadval sozlamalari'}
        buttonId='submit-button'
        customButtons={<CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />}
        customOnSubmit={handleApply}
      >
        <Box p={'24px'} pt={'0'} className={classes.container}>
          <Box className={classes.inner}>
            <CheckboxWithDragDrop
              data={data?.filter((item) => {
                if (item?.colId === 'actfion' || item?.colId === 'supply_price_usd') return false
                return true
              })}
              checkAllField
              setData={setData}
            />
            <Box
              columnGap={2}
              display='flex'
              bottom={'24px'}
              left={'24px'}
              pt={'24px'}
              right={'24px'}
              bgcolor={theme.palette.background}
              position={'absolute'}
              mt={'24px'}
            >
              <Button
                sx={{ bgcolor: `${theme.palette.background.gray} !important`, height: 48, border: '1px solid #ECEDF2' }}
                fullWidth
                color='secondary'
                variant='contained'
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

export default memo(ColumnsFilterButtonForAll)
