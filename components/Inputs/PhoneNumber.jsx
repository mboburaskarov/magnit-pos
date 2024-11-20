import { useState } from 'react'
import { useIMask } from 'react-imask'
import { Box, ClickAwayListener, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import TextField from './TextField'
import Drawer from '../Drawers/Drawer'
import { countries } from '../../src/assets/data/countries'
import Label from '../Label'

const PhoneNumber = ({ name, required, country = countries[0], setCountry, setValue, label, fullWidth, uncontrolled }) => {
  const [open, setOpen] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)
  const { ref, setUnmaskedValue, value } = useIMask({
    mask: country?.mask,
    lazy: true,
    placeholderChar: 'x',
  })
  return (
    <>
      <Box position='relative'>
        {label && (
          <Label mb={1.5} required={required}>
            {label}
          </Label>
        )}
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <Box position='relative'>
            <Box
              position='absolute'
              top={0}
              left={0}
              zIndex={1}
              height={64}
              display='flex'
              alignItems='center'
              justifyContent='center'
              textAlign='center'
              fontFamily='LeagueSpartan'
              fontWeight={500}
              fontSize={16}
              lineHeight='26px'
              color='dark.500'
              onClick={() => setOpen(!open)}
              sx={(theme) => ({
                width: 120,
                height: 56,
                cursor: 'pointer',
                borderRight: `2px solid ${theme.palette.grey[200]}`,
                borderRadius: '16px 0 0 16px',
                fontSize: 16,
                fontWeight: 400,
                svg: {
                  ml: 1,
                  color: 'grey.300',
                  fontSize: 16,
                },
                '&:hover': {
                  // bgcolor: 'grey.200',
                },
              })}
            >
              <Typography mt={'7px'}>{`${country.flag} ${country.dial_code}`}</Typography>
              <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
            </Box>
            <Box
              display={open ? 'block' : 'none'}
              position='absolute'
              top={72}
              left={0}
              right={0}
              zIndex={4}
              width='100%'
              height={350}
              bgcolor='common.white'
              boxShadow='0 0 64px rgba(0, 0, 0, 0.08)'
              py={1.5}
              borderRadius={4}
              sx={{ overflowY: 'auto' }}
            >
              {countries.map((item, i) => (
                <Box
                  key={i}
                  display='flex'
                  alignItems='center'
                  width='100%'
                  py={2}
                  px={3}
                  color='dark.500'
                  fontFamily='LeagueSpartan'
                  fontWeight={600}
                  fontSize={16}
                  lineHeight='20px'
                  onClick={() => {
                    setCountry(item)
                    setOpen(false)
                  }}
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' } }}
                >
                  {item.name}
                </Box>
              ))}
            </Box>
          </Box>
        </ClickAwayListener>
        <TextField
          fullWidth={fullWidth}
          required={required}
          inputRef={ref}
          name={name}
          value={value}
          type='tel'
          setValue={(e) => {
            setUnmaskedValue(e)
            setValue(e)
          }}
          uncontrolled={uncontrolled}
          placeholder={country?.mask}
        />
      </Box>
      <Drawer
        open={openDrawer}
        setOpen={setOpenDrawer}
        title={`t('placeholders.phone-code')`}
        content={countries.map((item, i) => (
          <Box
            key={i}
            onClick={() => {
              setCountry(item)
              setOpenDrawer(false)
            }}
          >
            {item.name}
          </Box>
        ))}
      />
    </>
  )
}
export default PhoneNumber
