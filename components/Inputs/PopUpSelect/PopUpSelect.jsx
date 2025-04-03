import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'
import dayjs from 'dayjs'
import 'dayjs/locale/ru' // Russian locale for correct week start
import ArrowDown from '../../../src/assets/icons/ArrowDown'
import ButtonWithPopup from '../../Buttons/ButtonWithPopup'
import SelectBody from './body'

export default function PopUpSelect({ id, name, minHeight = '48px', selectedStore, setselectedStore }) {
  return (
    <Box minWidth={163}>
      <ButtonWithPopup
        id={id || name}
        noArrow
        endIcon={<ArrowDown />}
        noMarginSvg
        sx={{
          height: minHeight,
          border: '1px solid #ECEDF2 !important',
          width: '200px',
          backgroundColor: '#fe5000 !important',
          '&:hover': {
            backgroundColor: '#fb923c !important',
          },
          '& p': {
            color: '#fff !important',
          },
          '& path': {
            fill: '#fff !important',
          },
          minHeight: '56px',
        }}
        placement='bottom-end'
        buttonLabel={
          <Box
            display='inline-flex'
            whiteSpace={'pre'}
            sx={{
              '&  > p': { fontWeight: 600, textAlign: 'left', color: 'dark.500', margin: '0 20px', lineHeight: '25px', fontSize: 16 },
              '& > span': { lineHeight: '19px', color: 'gray.600', fontWeight: 600, ml: 1, mr: '2px !important' },
            }}
          >
            <p>{'Все филиалы'}</p>
          </Box>
        }
        popperContentProps={{
          selectedStore,
          setselectedStore,
        }}
        PopperContent={SelectBody}
      />
    </Box>
  )
}
