import React, { useState } from 'react'
import { Box } from '@mui/material'
import StyledDialog from '../../Dialogs/StyledeEmptyDialog'
import promiseCallback from '../../../utils/promiseCallback'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import event from '../../../utils/event'
import SettingIcon from '../../../src/assets/icons/ArrowDown'
import CheckboxWithDragDrop from './CheckboxWithDragDrop'
import useDeepCompareEffect from '../../../src/hooks/useDeepCompareEffect'
import { makeStyles } from '@mui/styles'

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
  btn_cont: {
    position: 'absolute',
    top: '50%',
    right: 0,
    padding: 0,
    transform: 'translateY(-50%)',
    '& th': {
      padding: 0,
    },
  },
  btn: {
    marginLeft: 10,
    height: 40,
    width: 40,
    borderRadius: '50%',
    display: 'flex',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.palette.gray[100],
    border: `1px solid ${theme.palette.gray[200]}`,
  },
}))

function ColumnsFilterButton({ columns, updaterAction, title, applyBtnLabel }) {
  const dispatch = useDispatch()
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const [data, setData] = useState(
    columns
      ?.filter((el) => !el?.is_temporary)
      ?.map((el) => ({
        ...el,
        label: el.Header,
        desc: el.desc,
        name: el.accessor,
      }))
  )

  useDeepCompareEffect(() => {
    if (columns) {
      columns.forEach((el) => {
        if (el.id !== 'selection') {
          el.toggleHidden(!el?.is_active)
        }
      })
      setData(
        columns
          ?.filter((el) => !el?.is_temporary)
          ?.map((el) => ({
            ...el,
            label: el.Header,
            desc: el.desc,
            name: el.accessor,
          }))
      )
    }
  }, [columns])

  const handleApply = () => {
    setOpen(false)
    const withoutCheckBoxColumn =
      data
        ?.filter((el) => el?.id !== 'selection' && el?.id.length <= 35)
        ?.map((el, index) => ({
          Header: el.Header,
          accessor: el.id,
          is_active: el.is_active,
          sequence_number: index,
          comparable: el.comparable,
          always_active: el.always_active,
          is_main: true,
          width: el.width,
        })) || []
    promiseCallback(() => {
      if (updaterAction) {
        dispatch(updaterAction(withoutCheckBoxColumn))
        event('change_position_of_table')
      }
    })
      .then(() => {
        data.forEach((el) => {
          if (el.id !== 'selection') {
            el.toggleHidden(!el?.is_active)
          }
        })
      })
      .catch((err) => console.log(err))
  }

  return (
    <>
      <button id='table-settings-button' className={classes.btn} type='button' onClick={() => setOpen(!open)}>
        <SettingIcon />
      </button>
      <StyledDialog
        open={open}
        onClose={() => setOpen(false)}
        title={t(title || 'table_columns.table_fields')}
        customOnSubmit={handleApply}
        buttonLabel={t(applyBtnLabel || 'menu.products.import.nav.apply')}
        buttonId='submit-button'
      >
        <Box py={4} px={7} className={classes.container}>
          <Box className={classes.inner}>
            <CheckboxWithDragDrop data={data} checkAllField setData={setData} />
          </Box>
        </Box>
      </StyledDialog>
    </>
  )
}

export default ColumnsFilterButton
