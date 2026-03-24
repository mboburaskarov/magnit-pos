// make messages drawer
import ArrowRightIcon from '@/assets/icons/ArrowRightIcon'
import CloseIcon from '@/assets/icons/CloseIcon'
import { ArrowRight, ArrowRightAlt } from '@mui/icons-material'
import { Box, Drawer, Skeleton, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function MessagesDrawer({ open, onClose, messagesCount, isLoading }) {
  const navigate = useNavigate()
  return (
    <Drawer
      anchor='right'
      onClose={() => onClose(false)}
      open={open}
      sx={{
        '& .MuiDrawer-paper': {
          width: '400px',
          height: 'calc(100vh - 10px)',
          flexShrink: 0,
          mr: '5px',
          marginTop: '5px',
          borderRadius: '16px',
        },
      }}
    >
      <Box
        sx={{
          //   bgcolor: 'grey.200',
          display: 'flex',
          alignItems: 'center',
          m: '10px',
          justifyContent: 'center',
          padding: '10px',
          borderBottom: '1px solid #ececec',
        }}
      >
        <Typography sx={{ fontSize: '18px', fontWeight: '600', color: 'bunker.950' }}>Уведомления</Typography>
        {/* <CloseIcon color='#000' onClick={() => onClose(false)} /> */}
      </Box>
      {isLoading ? (
        <Box
          sx={{
            margin: '10px',
          }}
        >
          <Skeleton variant='rectangular' width='100%' height='50px' />
        </Box>
      ) : (
        <>
          {messagesCount > 0 ? (
            <Box
              onClick={() => navigate('/sales/create')}
              sx={{
                padding: '10px',
                bgcolor: 'bg.10',
                margin: '10px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'bunker.100',
                  '& svg': {
                    fill: 'bunker.950',
                  },
                },
              }}
            >
              <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>У вас {messagesCount} неполученных онлайн-заказа.</Typography>
              <ArrowRightIcon color='#505050' />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>У вас нет уведомлений.</Typography>
            </Box>
          )}
        </>
      )}
    </Drawer>
  )
}

export default MessagesDrawer
