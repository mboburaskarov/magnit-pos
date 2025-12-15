import { Box, LinearProgress, Typography } from '@mui/material'
import SuccessIcon from '@icons/SuccessIcon'
import { useEffect, useState } from 'react'
import ErrorIcon from '@icons/ErrorIcon'

export default function SaleProgressSteps({
  isFinishSaleWithoutAppPaymentType,
  isSendToEPOS,
  isSendEPOSresponseToBackend,
  isSaleResponseError,
  isEposError,
  isSaleError,
}) {
  const [showModal, setShowModal] = useState(false)

  const allDone = !isFinishSaleWithoutAppPaymentType && !isSendToEPOS && !isSendEPOSresponseToBackend

  useEffect(() => {
    if (isFinishSaleWithoutAppPaymentType || isSendToEPOS || isSendEPOSresponseToBackend) {
      setShowModal(true)
    }

    if (allDone) {
      const t = setTimeout(() => setShowModal(false), 1000)
      return () => clearTimeout(t)
    }
  }, [isFinishSaleWithoutAppPaymentType, isSendToEPOS, isSendEPOSresponseToBackend, allDone])

  // Qaysi step active ekanini aniqlash
  let currentStep = null

  if (isFinishSaleWithoutAppPaymentType) {
    currentStep = {
      label: 'Товар проверяется',
      progress: 15,
      startProgress: 0,
      endProgress: 30,
    }
  } else if (isSendToEPOS) {
    currentStep = {
      label: 'Отправляется в EPOS',
      progress: 45,
      startProgress: 30,
      endProgress: 60,
    }
  } else if (isSendEPOSresponseToBackend) {
    currentStep = {
      label: 'Продажа завершается',
      progress: 80,
      startProgress: 60,
      endProgress: 100,
    }
  } else if (allDone) {
    currentStep = {
      label: 'Завершено',
      progress: 100,
      startProgress: 100,
      endProgress: 100,
    }
  }

  if (!showModal || !currentStep) return null

  const isCompleted = currentStep.progress === 100

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        maxWidth: 480,
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        zIndex: 9999,
      }}
    >
      {isCompleted ? (
        <Box
          sx={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '30px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Box
            sx={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: isEposError || isSaleError || isSaleResponseError ? '#FF4639' : '#28B95E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isEposError || isSaleError || isSaleResponseError ? (
              <ErrorIcon sx={{ color: '#fff', fontSize: 40 }} />
            ) : (
              <SuccessIcon sx={{ color: '#fff', fontSize: 40 }} />
            )}
          </Box>

          <Typography
            sx={{
              fontSize: '16px',
              textAlign: 'center',
              fontWeight: 600,
              color: '#1a1a1a',
              marginTop: '8px',
            }}
          >
            {isEposError || isSaleError || isSaleResponseError ? 'Произошла ошибка. Попробуйте снова.' : 'Чек печатается'}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <Typography
            sx={{
              fontSize: '48px',
              fontWeight: 700,
              textAlign: 'center',
              lineHeight: '64px',
              color: '#1a1a1a',
              marginBottom: '12px',
            }}
          >
            {currentStep.progress}%
          </Typography>

          <Box sx={{ position: 'relative', marginBottom: '16px' }}>
            <Box
              sx={{
                height: 12,
                borderRadius: '100px',
                backgroundColor: '#f0f0f0',
                overflow: 'hidden',
                position: 'relative',
                background: `repeating-linear-gradient(
                  45deg,
                  #f0f0f0,
                  #f0f0f0 10px,
                  #e8e8e8 10px,
                  #e8e8e8 20px
                )`,
              }}
            >
              <LinearProgress
                variant='determinate'
                value={(currentStep.progress / 100) * 100}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: '100%',
                  borderRadius: '100px',
                  backgroundColor: 'transparent',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#ff6b35',
                    borderRadius: '100px',
                  },
                }}
              />
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: '20px',
              fontWeight: 600,
              color: '#111217',
              lineHeight: '32px',
              marginBottom: '8px',
              textAlign: 'center',
            }}
          >
            {currentStep.label}
          </Typography>

          <Typography
            sx={{
              fontSize: '14px',
              color: '#677190',
              fontWeight: '500',
              lineHeight: '20px',
              textAlign: 'center',
            }}
          >
            Не обновляйте страницу, пока процесс не завершится, иначе он не будет сохранён!
          </Typography>
        </Box>
      )}
    </Box>
  )
}
