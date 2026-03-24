import thousandDivider from '@utils/thousandDivider';
import { Box, Typography } from '@mui/material';
import Barcode from 'react-barcode';
import { get } from 'lodash';
import dayjs from 'dayjs';


function RippedPaperProductPriceCheck({ data, printContainer }) {
  return (
    <Box
      maxWidth='400px'
      sx={{
        display: 'none',
        width: '355px',
        overflowY: 'scroll',
        maxHeight: '75vh',
      }}
    >
      <Box
        mx={-2}
        mt={'-3px'}
        style={{
          padding: '20px',
        }}
        ref={printContainer}
      >
        <Box
          width={'100%'}
          sx={{
            display: 'flex',
            alignItems: 'start',
            padding: '0 10px 0 0',
            justifyContent: 'start',
            flexDirection: 'column',
            height: '72px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'end',
              justifyContent: 'start',
              width: '100%',
              flexDirection: 'column',
            }}
          >
            <Typography
              sx={{
                width: '100%',
                textAlign: 'center',
                fontSize: '20px',
                fontWeight: '600',
              }}
            >
              {get(data, 'name', '')}
            </Typography>
            <Box height={'10px'} />
            <Typography
              sx={{
                fontSize: '50px',
                fontWeight: '600',
                m: '15px 0 10px',
              }}
            >
              {thousandDivider(get(data, 'price', 0))}
            </Typography>
          </Box>
          <Box display={'flex'} alignItems={'center'}>
            <Barcode fontSize={'20px'} height={'60px'} width={'2px'} value={get(data, 'barcode')} />
            <Typography fontSize={'14px'}>{dayjs().format('DD.MM.YYYY')}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default RippedPaperProductPriceCheck
