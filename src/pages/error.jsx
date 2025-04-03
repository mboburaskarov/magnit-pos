import { Box, Button, Typography } from '@mui/material'
import { useState } from 'react'

export default function ErrorPage({ errorData }) {
  const [isVIsible, setIsVIsible] = useState(false)
  const error = errorData?.error.stack.split(' at ')
  const errorInfo = errorData?.errorInfo.split(' at ')

  return (
    <>
      <Box
        width='100vw'
        height='100vh'
        display='flex'
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
        sx={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
      >
        <Box>
          <Typography variant='h1' color='primary' style={{ fontSize: 48, lineHeight: '56px' }}>
            Something went wrong
          </Typography>
        </Box>
        <Box display='flex' flexDirection='column' alignItems='center'>
          <Typography style={{ marginBottom: 16 }} variant='h5'>
            Sorry something went wrong
          </Typography>
          <Button onClick={() => window.location.replace('/')} primary>
            Reload
          </Button>
        </Box>
      </Box>

      <Box style={{ opacity: 0 }} zIndex={99991} position='fixed' bottom={0}>
        <Button setIsVIsible fullWidth onClick={() => setIsVIsible(!isVIsible)} primary>
          Reload
        </Button>
      </Box>
      {isVIsible && (
        <Box>
          <Box>
            <Box marginTop='10vh' marginLeft='10vw'>
              <Box width={'80vw'} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                <Typography variant='h1' color='primary' style={{ fontSize: 48, lineHeight: '56px' }}>
                  Error message Pharma Cosmos
                </Typography>
                <Button onClick={() => window.location.reload()} primary>
                  Reload
                </Button>
              </Box>
              <br />
              <Typography style={{ fontSize: 25, lineHeight: '26px', color: '#000' }}>{errorData?.error?.message}</Typography>
              <br />
              {error.map((el, ind) => (
                <Typography key={ind} style={{ lineHeight: '22px', color: '#000' }}>
                  {ind !== 0 ? '> at ' + el : el}
                </Typography>
              ))}
              <br />
              <hr style={{ width: '80vw' }} />
              <br />
              <Box style={{ maxHeight: '350px', overflowY: 'scroll' }}>
                {errorInfo.map((el, ind) => (
                  <Typography
                    key={ind}
                    style={{
                      lineHeight: '22px',
                      color: 'rgb(255,255,255, 0.8)',
                    }}
                  >
                    {ind !== 1 && ind !== 0 ? 'at ' + el : el}
                  </Typography>
                ))}
              </Box>
              <br />
            </Box>
          </Box>
        </Box>
      )}
    </>
  )
}
