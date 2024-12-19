import { Drawer } from '@mui/material'
import { makeStyles } from '@mui/styles'
import dayjs from 'dayjs'
import { get } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { useQueryParams } from '../../../hooks/useQueryParams'
import { requests } from '../../../../utils/requests'
import SaleChildDrawer from './saleChildDrawer'

const useStyles = makeStyles((theme) => ({
  drawer: {
    '& .MuiDrawer-paper': {
      width: '660px',
      borderRadius: '24px 0 0 24px',
      backgroundColor: theme.palette.background.default,
    },
  },
  drawerHeader: {
    height: '80px',
    padding: '16px 24px',
    borderBottom: `1px solid ${theme.palette.bunker[100]}`,
  },
}))
function SaleDrawer({ open, setOpen, cashBoxDetails }) {
  const { t } = useTranslation()
  const classes = useStyles()
  const [draftfilter, setDraftFilter] = useState(false)
  const userData = useSelector((state) => state.user)
  const { values } = useQueryParams()

  const draftsListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.offset || 0,
      search: values?.search || null,
      store_id: get(userData, 'store.id'),
      cash_box_id: get(cashBoxDetails, 'data.data.cash_box_id'),
      customer_id: values?.customer_id,
      draft_date: values?.draft_date ? dayjs(values?.draft_date).format('YYYY-MM-DD') : '',
    }
  }, [values?.customer_id, values?.draft_date, values?.search])
  const { data: darftList, refetch, isDarftList } = useQuery(['darftList', draftsListFilter], () => requests.getDarftList(draftsListFilter))
  useEffect(() => {
    refetch()
  }, [open])
  return (
    <Drawer open={open} onClose={() => setOpen(false)} anchor='right' elevation={1} className={classes.drawer}>
      <SaleChildDrawer refetchDraftList={refetch} open={open} setOpen={setOpen} />
    </Drawer>
  )
}

export default SaleDrawer
