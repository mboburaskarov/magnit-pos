import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography, Button } from '@mui/material'
import InputSimple from '../../Inputs/InputSearch'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import InputSwitchNew from '../../Inputs/InputSwitch'
import InputPhone from '../../Inputs/PhoneNumber'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import GreenCard from '../../../src/assets/icons/GrowIcon'
import StyledCardDialog from '../../Dialogs/StyledeEmptyDialog'
import StyledDialog from '../../Dialogs/StyledeEmptyDialog'
import palette from '../../../src/assets/theme/mui.config'
import { makeStyles } from '@mui/styles'
import InputDatePicker from '../../Inputs/InputDatePicker'
import TextField from '../../Inputs/TextField'

const useStyles = makeStyles((theme) => ({
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.gray[100],
    padding: 16,
    borderRadius: 24,
    marginTop: 16,
  },
  required: {
    '&::after': {
      content: '" *"',
      color: theme.palette.red[500],
    },
  },
  label: {
    marginRight: 255,
  },
}))

export default function MainDetails({ quickCreateClientName, clientData }) {
  const classes = useStyles()
  const { control, errors, setValue, register, watch } = useFormContext()
  const { t } = useTranslation()
  // const cards = watch('cards')
  useEffect(() => {
    // register('dial_code')
    setValue('dial_code', '+998')
  }, [])
  const [cardCode, setCardCode] = useState('')
  const [cardName, setCardName] = useState('')
  const [openCardDialogProgress, setOpenCardDialogProgress] = useState(false)
  const [openCardDialogSuccess, setOpenCardDialogSuccess] = useState(false)
  const [openCardDialogError, setOpenCardDialogError] = useState(false)
  const [open, setOpen] = useState(false)

  const onEnterPress = () => {
    if (openCardDialogProgress) {
      if (cardCode) {
        setOpenCardDialogProgress(false)
        setOpenCardDialogSuccess(true)
        setTimeout(() => {
          setOpenCardDialogSuccess(false)
          setOpen(true)
        }, 1000)
      } else {
        setOpenCardDialogProgress(false)
        setOpenCardDialogError(true)
        setCardCode('')
        setTimeout(() => {
          setOpenCardDialogError(false)
        }, 1000)
      }
    }
  }

  return (
    <Box mt={'24px'}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Typography mb='4px'>{t('client_name')}</Typography>

          <TextField
            id='client-name'
            name='first_name'
            // label={'menu.clients.new.name'}
            control={control}
            fullWidth
            error={errors?.first_name}
            placeholder={t('client_name.placeholder')}
            required
            defaultValue={quickCreateClientName || clientData?.name || ''}
            asteriks
          />
        </Grid>
        <Grid item xs={6}>
          <Typography mb='4px'>{t('client_last_name')}</Typography>

          <TextField
            id='last-name'
            name='last_name'
            // label={t('menu.clients.new.last_name')}
            control={control}
            // required
            fullWidth
            error={errors?.last_name}
            placeholder={t('client_last_name.placeholder')}
            // defaultValue={clientData ? clientData.last_name : ''}
            asteriks
          />
        </Grid>
      </Grid>
      <Box mb={4} />
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Typography mb='4px'>{t('birthdate')}</Typography>
          <InputDatePicker
            // withTime
            noMarginTop
            // defaultValue={new Date()}
            name='date_of_birth'
            // minDate={new Date()}
            // minTime={new Date()}
            // minT
            error={errors?.date_of_birth}
            // required
            id='birth-Date'
            showYearDropdown
            // label='Дата закрытия'
            placeholder='kk/oo/yyyy'
          />
        </Grid>
        <Grid item xs={6}>
          <Typography mb='4px'>{t('gender')}</Typography>

          <InputSwitchNew
            id='client-gender'
            noMarginTop
            name='gender'
            // label={t('menu.clients.new.gender')}
            control={control}
            defaultValue='male'
            error={errors?.gender}
            options={[
              {
                title: t('gender_male'),
                value: 'male',
              },
              {
                title: t('gender_female'),
                value: 'female',
              },
            ]}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box mt={'25px'}>
            <Typography mb={'4px'} className={classes.required}>
              {t('phone_number')}
            </Typography>
          </Box>
          <InputPhone
            login={false}
            id='phone'
            disabled
            name='phone'
            // placeholder={t('phone_number.placeholder')}
            control={control}
            // defaultValue={clientData ? [clientData.phone][0] : ''}
            fullWidth
            boxStyle={{ marginBottom: '0', marginTop: 'auto' }}
            required
            setCountry={({ dial_code }) => setValue('dial_code', dial_code)}
            error={errors?.phone}
          />
        </Grid>
        <Grid item xs={6}>
          <Box mt={'24px'}>
            <Typography className={classes.required} mb='4px'>
              {t('tags')}
            </Typography>
          </Box>
          <TextField
            id='tags'
            name='tags'
            // label={t('menu.clients.new.last_name')}
            control={control}
            fullWidth
            // required
            error={errors?.tags}
            placeholder={t('tags.placeholder')}
            defaultValue={clientData ? clientData.last_name : ''}
            asteriks
          />
        </Grid>
        {/* <Grid item xs={6}>
          <Box mt={4} mb={2}>
            <Typography mb='4px'>{t('menu.clients.cards.card')}</Typography>
          </Box>
          {cards && cards[0] ? (
            <Box className={classes.card}>
              <Box display='flex' alignItems='center'>
                <GreenCard style={{ width: '38px', height: '24px', marginRight: 24 }} />
                <Typography mb='4px'>{cards[0].name}</Typography>
              </Box>
              <FontAwesomeIcon icon={faTimesCircle} onClick={() => setValue('cards', [])} color={palette.red[500]} />
            </Box>
          ) : (
            <Box>
              <Button
                id='add-client-card'
                secondary
                fullWidth
                onClick={() => {
                  setOpenCardDialogProgress(true)
                }}
              >
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: 8 }} />
                {t('buttons.add_card')}
              </Button>
            </Box>
          )}
          <StyledCardDialog
            open={openCardDialogProgress}
            onClose={() => {
              setOpenCardDialogProgress(false)
              setCardCode('')
            }}
            cardCode={cardCode}
            setCardCode={setCardCode}
            onEnterPress={onEnterPress}
          />
          <StyledCardDialog
            open={openCardDialogSuccess}
            onClose={() => {
              setOpenCardDialogSuccess(false)
              setCardCode('')
            }}
            type='success'
          />
          <StyledCardDialog
            open={openCardDialogError}
            onClose={() => {
              setOpenCardDialogError(false)
              setCardCode('')
            }}
            type='error'
          />
          <StyledDialog
            open={open}
            onClose={(e) => {
              e.preventDefault()
              setOpen(false)
              setCardCode('')
            }}
            title={t('buttons.add_card')}
            buttonLabel={t('buttons.add')}
            // disabled={!cardName}
            customOnSubmit={() => {
              setCardCode('')
              setCardName('')
              setValue('cards', [{ code: cardCode, name: cardName }])
              setOpen(false)
            }}
          >
            <Box py={4} px={7}>
              <Box display='flex' my={2}>
                <InputSimple
                  id='card_name'
                  name='card_name'
                  label={t('menu.clients.new.card_name')}
                  fullWidth
                  placeholder={t('placeholders.enter_title')}
                  uncontrolled
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </Box>
            </Box>
          </StyledDialog>
        </Grid> */}
      </Grid>
    </Box>
  )
}
