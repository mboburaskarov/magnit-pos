import React, { useState } from 'react'
import { Box, Grid, Typography, Button } from '@mui/material'
import InputSimple from '../../Inputs/InputSearch'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import InputSwitchNew from '../../Inputs/InputSwitch'
import InputPhone from '../../Inputs/InputSearch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import GreenCard from '../../../src/assets/icons/GrowIcon'
import StyledCardDialog from '../../Dialogs/StyledeEmptyDialog'
import StyledDialog from '../../Dialogs/StyledeEmptyDialog'
import palette from '../../../src/assets/theme/mui.config'
import { makeStyles } from '@mui/styles'

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

export default function MainDetails({ clientData, quickCreateClientName }) {
  const classes = useStyles()
  const { control, errors, setValue, watch } = useFormContext()
  const { t } = useTranslation()
  const cards = watch('cards')
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
    <Box mt={4}>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <InputSimple
            id='client-name'
            name='name'
            label={t('menu.clients.new.name')}
            control={control}
            fullWidth
            error={errors?.name}
            placeholder={t('menu.clients.new.enter_name')}
            required
            defaultValue={quickCreateClientName || clientData.name || ''}
            asteriks
          />
        </Grid>
        <Grid item xs={4}>
          <InputSimple
            id='last_name'
            name='last_name'
            label={t('menu.clients.new.last_name')}
            control={control}
            fullWidth
            error={errors?.last_name}
            placeholder={t('menu.clients.new.enter_last_name')}
            defaultValue={clientData ? clientData.last_name : ''}
            asteriks
          />
        </Grid>
        <Grid item xs={4}>
          <InputSimple
            id='middle_name'
            name='middle_name'
            label={t('menu.clients.new.middle_name')}
            control={control}
            fullWidth
            error={errors?.middle_name}
            placeholder={t('menu.clients.new.enter_middle_name')}
            defaultValue={clientData ? clientData.middle_name : ''}
            asteriks
          />
        </Grid>
      </Grid>
      <Box mb={4} />
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Typography>{t('menu.clients.new.date_of_birth')}</Typography>
          <Box display='flex'>
            <InputSimple
              id='day'
              name='day'
              placeholder={t('menu.clients.new.dd')}
              fullWidth
              control={control}
              boxStyle={{ flex: '0 0 25%', mr: 1, mt: 2 }}
              type='number'
              error={errors?.day}
              defaultValue={clientData ? clientData.day : ''}
              max={31}
              onInput={(e) => {
                e.target.value = e.target.value.toString().slice(0, 2)
              }}
            />
            <InputSimple
              id='month'
              name='month'
              placeholder={t('menu.clients.new.mm')}
              fullWidth
              control={control}
              boxStyle={{ flex: '0 0 25%', mr: 1, mt: 2 }}
              type='number'
              error={errors?.month}
              defaultValue={clientData ? clientData.month : ''}
              max={12}
              onInput={(e) => {
                e.target.value = e.target.value.toString().slice(0, 2)
              }}
            />
            <InputSimple
              id='year'
              name='year'
              placeholder={t('menu.clients.new.yyyy')}
              fullWidth
              control={control}
              boxStyle={{ flex: '0 0 50%', mt: 2 }}
              type='number'
              error={errors?.year}
              defaultValue={clientData ? clientData.year : ''}
              max={new Date().getFullYear()}
              onInput={(e) => {
                e.target.value = e.target.value.toString().slice(0, 4)
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <InputSwitchNew
            id='client-gender'
            name='clientGender'
            label={t('menu.clients.new.gender')}
            control={control}
            defaultValue='male'
            options={[
              {
                title: t('menu.clients.new.male'),
                value: 'male',
              },
              {
                title: t('menu.clients.new.female'),
                value: 'female',
              },
            ]}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box mt={4} mb={2}>
            <Typography className={classes.required}>{t('menu.clients.new.phone')}</Typography>
          </Box>
          <InputPhone
            id='phone'
            name='phone'
            placeholder={t('menu.settings.shops.shop_create.phone_placeholder')}
            control={control}
            defaultValue={clientData ? [clientData.phone][0] : ''}
            fullWidth
            boxStyle={{ marginBottom: '0', marginTop: 'auto' }}
            required
            error={errors?.phone}
          />
        </Grid>
        <Grid item xs={6}>
          <Box mt={4} mb={2}>
            <Typography>{t('menu.clients.cards.card')}</Typography>
          </Box>
          {cards && cards[0] ? (
            <Box className={classes.card}>
              <Box display='flex' alignItems='center'>
                <GreenCard style={{ width: '38px', height: '24px', marginRight: 24 }} />
                <Typography>{cards[0].name}</Typography>
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
        </Grid>
      </Grid>
    </Box>
  )
}
