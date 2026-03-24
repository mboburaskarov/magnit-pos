import React, { useEffect, useState } from 'react'
import { Box, Drawer, Typography, Grid } from '@mui/material'
import RamadanIcon from '@/assets/icons/RamadanIcon'
import { getAllDistrictsData, getCurrentEvent } from '@utils/ramadanTime'
import CloseIcon from '@/assets/icons/CloseIcon'

const Countdown = ({ targetTime, isNextDay }) => {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!targetTime) return

      const now = new Date()
      const [h, m] = targetTime.split(':').map(Number)

      const targetDate = new Date()
      targetDate.setHours(h, m, 0, 0)

      if (isNextDay) {
        targetDate.setDate(targetDate.getDate() + 1)
      } else {
        // If target is today but time already passed (shouldn't happen if logic is correct), handle it
        if (targetDate < now) {
          // this case is handled by getCurrentEvent returning next event
        }
      }

      const diff = targetDate - now
      if (diff <= 0) {
        setTimeLeft('00:00:00')
        return
      }

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`)
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetTime, isNextDay])

  return <Typography sx={{ fontSize: '32px', fontWeight: 'bold', color: '#1a6d33ff', mt: 1 }}>{timeLeft}</Typography>
}

const RamadanDrawer = ({ open, onClose }) => {
  const [currentEvent, setCurrentEvent] = useState(null)
  const districtsData = getAllDistrictsData()

  useEffect(() => {
    const updateEvent = () => {
      setCurrentEvent(getCurrentEvent(0)) // Default to Tashkent for the main timer
    }

    if (open) {
      updateEvent()
      const interval = setInterval(updateEvent, 1000)
      return () => clearInterval(interval)
    }
  }, [open])

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={() => onClose(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: '450px',
          height: '98vh',
          marginTop: '1vh',
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '20px',
          marginRight: '10px',
        },
      }}
    >
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={1}>
        <Typography variant='h6' fontWeight='bold'>
          Ramazon taqvimi
        </Typography>
        <Box onClick={() => onClose(false)} sx={{ cursor: 'pointer' }}>
          <CloseIcon color='#1a6d33ff' />
        </Box>
      </Box>

      {/* Top Card */}
      <Box
        sx={{
          backgroundColor: '#f9f9fa',
          borderRadius: '20px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.1, svg: { width: '150px', height: '150px' } }}>
          <RamadanIcon color='#1a6d33ff' />
        </Box>

        <Box
          sx={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#1a6d33ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            zIndex: 1,
            svg: { width: '40px', height: '40px' },
          }}
        >
          <RamadanIcon color='#fff' />
        </Box>

        <Typography sx={{ fontSize: '16px', color: 'gray.600', fontWeight: '500', zIndex: 1 }}>{currentEvent?.label || 'Yuklanmoqda...'}</Typography>

        <Typography sx={{ fontSize: '40px', fontWeight: 'bold', color: '#2C3E50', lineHeight: 1, my: 1, zIndex: 1 }}>{currentEvent?.time}</Typography>

        <Typography sx={{ fontSize: '14px', color: 'gray.500', mb: 0, zIndex: 1 }}>Qolgan vaqt</Typography>

        <Countdown targetTime={currentEvent?.targetTime} isNextDay={currentEvent?.isNextDay} />
      </Box>

      {/* Regions List */}
      <Typography variant='h6' fontWeight='bold' mb={2}>
        Toshkent viloyati tumanlari
      </Typography>

      <Box sx={{ overflowY: 'auto', flex: 1 }}>
        <Grid container spacing={1}>
          {districtsData.map((district) => (
            <Grid item xs={12} key={district.id}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: '5px 20px 5px 10px',
                  borderRadius: '12px',
                  backgroundColor: '#f5f5f5',
                }}
              >
                <Typography fontWeight='600' fontSize='15px'>
                  {district.name}
                </Typography>
                <Box textAlign='right'>
                  <Typography fontSize='12px' color='gray.600'>
                    Saharlik: <span style={{ fontWeight: 'bold', color: '#333' }}>{district.times?.saharlik || '--:--'}</span>
                  </Typography>
                  <Typography fontSize='12px' color='gray.600'>
                    Iftorlik: <span style={{ fontWeight: 'bold', color: '#333' }}>{district.times?.iftorlik || '--:--'}</span>
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Typography sx={{ textAlign: 'center', fontSize: '18px', mt: 2, color: 'bunker.500', display: 'block' }}>
        Vaqtlar Toshkent vaqtiga nisbatan hisoblangan (4 daqiqa ehtiyotini olishni maslahat beramiz!)
      </Typography>
    </Drawer>
  )
}

export default RamadanDrawer
