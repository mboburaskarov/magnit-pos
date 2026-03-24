import { Box, Button, Typography } from '@mui/material'
import CustomImg from '../../components/CustomImg'

export default function ErrorPageLocal({ errorData }) {
  const error = errorData?.error.stack.split(' at ')
  const errorInfo = errorData?.errorInfo.split(' at ')

  return (
    <Box>
      <Box
        width='100vw'
        height='100vh'
        display='flex'
        alignItems='flex-start'
        justifyContent='flex-start'
        flexDirection='column'
        sx={{
          background: 'rgb(0,0,0, 0.9)',
          position: 'fixed',
          top: '0 !important',
          left: '0 !important',
          zIndex: 9999,
        }}
      >
        <Box marginTop='10vh' marginLeft='10vw'>
          <Box width={'80vw'} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
            <Typography variant='h1' color='primary' style={{ fontSize: 48, lineHeight: '56px' }}>
              Error message &quot;Pharma Cosmos&quot;
            </Typography>
            <Button onClick={() => window.location.reload()} primary>
              Reload
            </Button>
          </Box>
          <br />
          <Typography style={{ fontSize: 25, lineHeight: '26px', color: '#fff' }}>{errorData?.error?.message}</Typography>
          <br />
          {error.map((el, ind) => (
            <Typography key={ind} style={{ lineHeight: '22px', color: '#fff' }}>
              {ind !== 0 ? '> at ' + el : el}
            </Typography>
          ))}
          <br />
          <hr style={{ width: '80vw' }} />
          <br />
          <Box style={{ maxHeight: '350px', overflowY: 'scroll' }}>
            {errorInfo.map((el, ind) => (
              <Typography key={ind} style={{ lineHeight: '22px', color: 'rgb(255,255,255, 0.8)' }}>
                {ind !== 1 && ind !== 0 ? 'at ' + el : el}
              </Typography>
            ))}
          </Box>
          <br />
        </Box>
      </Box>
      <CustomImg
        style={{
          zIndex: '99',
          position: 'fixed',
          objectFit: 'cover',
          top: '0px',
          left: 0,
          width: '100vw',
          height: '100vh',
        }}
        src={'/images/errorBackground.png'}
      />
    </Box>
  )
}
