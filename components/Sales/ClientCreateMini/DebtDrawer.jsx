import { Box, Drawer, Typography, Grid, Button as MuiButton, Button } from '@mui/material'
import CloseIcon from '../../../src/assets/icons/CloseIcon'
import colors from '../../../src/assets/theme/mui.config'
import { numberToPrice } from '../../../utils/numberToPrice'
import InputSimple from '../../Inputs/InputSearch'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ClientSearchBar from 'components/Sales/ClientSearchBar'
import UserFilledIcon from '../../../src/assets/icons/UserFilledIcon'
import InputDatePicker from 'components/Input/InputDatePicker'
import { v4 as uuidv4 } from 'uuid'
import { requests } from 'services/requests'
import { useQuery } from 'react-query'
import { useDispatch } from 'react-redux'
import { error, success } from '../../../utils/toast'
import PriceFormattedInput from 'components/Input/PriceFormattedInput'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import useWebsocketMutation from 'hooks/useWebsocketMutation'
import { addToOrderPayment, removeFromOrderPayment } from 'store/actions/cartActions/cartActions'
import thousandDivider from '../../../utils/thousandDivider'
import { useTranslation } from 'react-i18next'
import currency from '../../../utils/currency'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  drawer: {
    '& .MuiDrawer-paper': {
      width: '60%',
      padding: '64px 64px 0 64px',
      borderRadius: '64px 0 0 64px',
      backgroundColor: theme.palette.background.default,
    },
  },
  actions: {
    display: 'flex',
    padding: '32px 0',
    position: 'sticky',
    bottom: 0,
    backgroundColor: theme.palette.background.default,
  },
  infoItem: {
    background: theme.palette.gray[100],
    borderRadius: 16,
    padding: '8px 16px',
    width: '100%',
    height: '100%',
  },
  percentageBox: {
    background: theme.palette.gray[200],
    borderRadius: 12,
    maxHeight: 48,
    width: 64,
  },
  clientInfo: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: theme.palette.gray[100],
    minHeight: 56,
    borderRadius: 16,
    padding: '0 16px',
  },
  noClient: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    border: `1px dashed ${theme.palette.gray[300]}`,
    borderRadius: 16,
    color: theme.palette.gray[400],
    fontWeight: 600,
  },
}))

export default function EditDrawer({
  orderPayments,
  open,
  setOpen,
  clientInfo,
  setClientInfo,
  setOpenClientCreateMini,
  setOpenClientCard,
  setQuickCreateClientName,
  clientInputRef,
  createdClientId,
  setCreatedClientId,
  overallAmount,
  editDebt,
  setEditDebt,
}) {
  const cls = useStyles()
  const params = useParams()
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { data: customerDebts, isLoading: customerDebtsIsLoading } = useQuery(
    ['customer-debt', clientInfo?.id],
    () => requests.debt.getCustomerDebts(clientInfo.id),
    {
      enabled: !!clientInfo?.id,
    }
  )

  const { mutate: createMutate, isLoading: createIsLoading } = useWebsocketMutation(requests.debt.create, {
    onWebsocketSuccess: ({ data }) => {
      success('toast.success.success')
      dispatch(
        addToOrderPayment({
          company_payment_type_id: 'debt',
          id: uuidv4(),
          paid_amount: Number(Number(editDebt.amount).toFixed(6)),
          returned_amount: 0,
          name: t('menu.sales.all.debt'),
        })
      )
      setOpen(false)
      setEditDebt({
        ...editDebt,
        id: data,
        active: false,
      })
    },
    onWebsocketError: () => {
      error('toast.error.error')
    },
  })

  const { mutate: updateMutate, isLoading: updateIsLoading } = useWebsocketMutation(requests.debt.update, {
    onWebsocketSuccess: () => {
      success('toast.success.success')
      dispatch(
        addToOrderPayment({
          company_payment_type_id: 'debt',
          id: uuidv4(),
          paid_amount: Number(Number(editDebt.amount).toFixed(6)),
          returned_amount: 0,
          name: t('menu.sales.all.debt'),
        })
      )
      setOpen(false)
    },
    onWebsocketError: () => {
      error('toast.error.error')
    },
  })

  const info = [
    {
      title: t('menu.clients.debts.active_debt'),
      inner: <Typography>{numberToPrice(customerDebts?.data?.total_active_debt_amount)}</Typography>,
    },
    {
      title: t('menu.clients.debts.last_debt'),
      inner: <Typography>{numberToPrice(customerDebts?.data?.last_debt_amount)}</Typography>,
    },
    {
      title: t('menu.clients.debts.last_redemption'),
      inner: <Typography>{customerDebts?.data?.last_repayment_date ? dayjs(customerDebts?.data?.last_repayment_date).format('DD.MM.YYYY') : ''}</Typography>,
    },
  ]

  const onSubmit = () => {
    const requestBody = {
      amount: Number(Number(editDebt.amount).toFixed(6)),
      comment: editDebt.comment,
      order_id: editDebt.active ? editDebt.id : params?.id,
      repayment_date: dayjs(editDebt?.date).format('YYYY-MM-DD'),
    }
    if (editDebt.active) {
      dispatch(removeFromOrderPayment(orderPayments.filter((item) => item.company_payment_type_id === 'debt')[0]))
      updateMutate({ id: editDebt?.id, data: requestBody })
    } else {
      createMutate(requestBody)
    }
  }

  return (
    <Drawer open={open} onClose={() => setOpen(false)} anchor='right' elevation={1} className={cls.drawer}>
      <Box width='100%' display='flex' alignItems='center' justifyContent='space-between' mb={4}>
        <Typography variant='h1'>{editDebt.active ? t('menu.clients.debts.change_debt') : t('menu.clients.debts.new_debt')}</Typography>
        <Box id='close-product-card' onClick={() => setOpen(false)}>
          <CloseIcon />
        </Box>
      </Box>
      <Box height='100%'>
        <Grid container spacing={1}>
          {!customerDebtsIsLoading && clientInfo ? (
            info.map((item) => (
              <Grid item xs={4} key={item.title}>
                <Box className={cls.infoItem}>
                  <Typography color='textSecondary' style={{ marginBottom: 4 }}>
                    {item.title}
                  </Typography>
                  {item.inner}
                </Box>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box className={cls.noClient}>{t('menu.clients.debts.choose_client')}</Box>
            </Grid>
          )}
          <Grid item xs={6}>
            <Box>
              <Box display='flex' alignItems='center' justifyContent='space-between' mt={4} mb={2}>
                <Box display='flex' alignItems='center' justifyContent='space-between'>
                  <Typography>{t('menu.clients.filter.customer')}</Typography>
                </Box>
                <MuiButton id='client-create-button' style={{ color: colors.blue[500], height: 0 }} onClick={() => setOpenClientCreateMini(true)}>
                  {t('buttons.create')}
                </MuiButton>
              </Box>
              {clientInfo ? (
                <Box className={cls.clientInfo}>
                  <Box display='flex' alignItems='center' justifyContent='space-between' onClick={() => setOpenClientCard(true)}>
                    <UserFilledIcon />
                    <Box ml={2}>
                      <Typography style={{ cursor: 'pointer' }}>{`${clientInfo.first_name} ${clientInfo.last_name}`}</Typography>
                      <Typography color='textSecondary'>
                        {t('table_columns.balance')}:{numberToPrice(clientInfo?.balance || 0)}
                      </Typography>
                    </Box>
                  </Box>
                  <MuiButton style={{ color: colors.gray[400] }} onClick={() => setClientInfo()}>
                    <FontAwesomeIcon icon={faTimesCircle} />
                  </MuiButton>
                </Box>
              ) : (
                <ClientSearchBar
                  setQuickCreateClientName={setQuickCreateClientName}
                  setOpenClientCreateMini={setOpenClientCreateMini}
                  clientInputRef={clientInputRef}
                  createdClientId={createdClientId}
                  handleAddClient={setClientInfo}
                  noMarginBottom
                />
              )}
            </Box>
          </Grid>
        </Grid>

        <Box mt={4}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <InputSimple
                placeholder={t('placeholders.enter_debt_price')}
                uncontrolled
                required
                fullWidth
                type='text'
                adornmentClassName={cls.percentageBox}
                adornment={currency()}
                adornmentPosition='end'
                label={t('menu.clients.filter.price')}
                value={editDebt.amount}
                InputProps={{
                  inputComponent: PriceFormattedInput,
                }}
                onChange={(e) => {
                  const max = overallAmount + (orderPayments.filter((item) => item?.company_payment_type_id === 'debt')[0]?.paid_amount || 0)

                  if (Number(e.target.value) <= max) {
                    setEditDebt({
                      ...editDebt,
                      amount: e.target.value,
                    })
                  } else {
                    setEditDebt({
                      ...editDebt,
                      amount: max,
                    })
                    error(
                      t('toast.error.error_max_price', {
                        max: thousandDivider(max),
                      })
                    )
                  }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <InputDatePicker
                label={t('menu.clients.filter.date')}
                placeholder={t('placeholders.select_date')}
                minWidth='auto'
                uncontrolled
                required
                value={editDebt.date}
                onChange={(e) => setEditDebt({ ...editDebt, date: e })}
                minDate={new Date()}
              />
            </Grid>
            <Grid item xs={12}>
              <InputSimple
                placeholder={t('placeholders.enter_comment')}
                uncontrolled
                fullWidth
                height='auto'
                label={t('menu.clients.debts.details.comment')}
                multiline
                value={editDebt.comment}
                onChange={(e) => setEditDebt({ ...editDebt, comment: e.target.value })}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Box className={cls.actions}>
        <Button secondary variant='contained' type='button' fullWidth onClick={() => setOpen(false)}>
          {t('buttons.cancel')}
        </Button>
        <Button
          variant='contained'
          fullWidth
          disabled={!(!!editDebt.amount && !!editDebt.date && !!clientInfo)}
          style={{ marginLeft: 16 }}
          isLoading={createIsLoading || updateIsLoading}
          onClick={onSubmit}
        >
          {editDebt.active ? t('buttons.change') : t('buttons.grant_debt')}
        </Button>
      </Box>
    </Drawer>
  )
}
