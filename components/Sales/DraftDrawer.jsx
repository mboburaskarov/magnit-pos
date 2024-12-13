import { Box, Button, Drawer, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import React, { useEffect, useMemo, useState } from 'react'
import CloseIcon from '../../src/assets/icons/CloseIcon'
import InputSearch from '../Inputs/InputSearch'
import DraftParentItemsBox from './DraftParentItemsBox'
import DraftChildDrawer from './DraftChildDrawer'
import FilterMenuIcon from '../../src/assets/icons/FilterMenuIcon'
import DraftFilter from './DraftFilter'
import { requests } from '../../utils/requests'
import { useMutation, useQuery } from 'react-query'
import { get } from 'lodash'
import { useSelector } from 'react-redux'
import { error, success } from '../../utils/toast'
import { useQueryParams } from '../../src/hooks/useQueryParams'
import dayjs from 'dayjs'

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
function DraftDrawer({ open, setOpen, cashBoxDetails }) {
  const classes = useStyles()
  const [draftfilter, setDraftFilter] = useState(false)
  const userData = useSelector((state) => state.user)
  const { values } = useQueryParams()
  console.log(values.draft_date)

  const [isOpenChild, setIsOpenChild] = useState(false)
  const draftsListFilter = useMemo(() => {
    return {
      limit: values?.limit || 10,
      offset: values?.offset || 0,
      search: values?.search || null,
      store_id: get(userData, 'store.id'),
      cash_box_id: get(cashBoxDetails, 'data.data.cash_box_id'),
      customer_id: values?.customer_id,
      draft_date: values?.draft_date ? dayjs(values?.draft_date).format('YYYY-MM-DD') : ' ',
    }
  }, [values?.customer_id, values?.draft_date, values?.search])
  const { data: darftList, refetch, isDarftList } = useQuery(['darftList', draftsListFilter], () => requests.getDarftList(draftsListFilter))
  useEffect(() => {
    refetch()
  }, [])
  const theme = useTheme()
  const draftListData = get(darftList, 'data.data.data', [])
  return (
    <Drawer open={open} onClose={() => setOpen(false)} anchor='right' elevation={1} className={classes.drawer}>
      {!isOpenChild ? (
        <Box>
          <Box display={'flex'} justifyContent={'space-between'} className={classes.drawerHeader}>
            <Typography fontSize={24} lineHeight={'48px'} fontWeight={700}>
              Qoralamalar
            </Typography>
            <CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />
          </Box>
          <Box display={'flex'} padding={'24px'}>
            <InputSearch fullWidth uncontrolled placeholder={'Qidirish: ID, mijoz, sotuvchi'} />
            <Box minWidth={113} ml={'16px'}>
              <Button
                sx={{
                  height: '48px',
                  padding: 0,
                  bgcolor: '#fff',
                  border: '1px solid #ECEDF2',
                  color: 'dark.500',
                  fontWeight: '500',
                  fontSize: '16px',
                  lineHeight: '24px',
                  '& span': {
                    mr: '12px',
                  },
                }}
                fullWidth
                startIcon={<FilterMenuIcon />}
                variant='contained'
                color='secondary'
                onClick={() => setDraftFilter((prev) => !prev)}
              >
                <Typography fontWeight={500} fontSize={'16px'} lineHeight={'25px'}>
                  Filter
                </Typography>
              </Button>
            </Box>
          </Box>
          <Box padding={'0 20px'}>
            {draftListData.map((item, index) => {
              return <DraftParentItemsBox key={index} item={item} setIsOpenChild={setIsOpenChild} />
            })}
          </Box>
        </Box>
      ) : (
        <DraftChildDrawer refetchDraftList={refetch} setChildOpen={setIsOpenChild} open={isOpenChild} setOpen={setOpen} />
      )}
      <DraftFilter setRegions={() => {}} open={draftfilter} setOpen={setDraftFilter} />
    </Drawer>
  )
}

export default DraftDrawer
