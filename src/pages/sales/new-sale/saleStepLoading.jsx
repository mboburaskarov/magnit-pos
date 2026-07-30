import { Box, LinearProgress, Typography } from '@mui/material'
import SuccessIcon from '@icons/SuccessIcon'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ErrorIcon from '@icons/ErrorIcon'

export default function SaleProgressSteps({ isFinishSaleWithoutAppPaymentType, isGelOldEposCheck, setHasError, isSendToEPOS, isSendEPOSresponseToBackend, hasError }) {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(null)

  const allDone = !isFinishSaleWithoutAppPaymentType && !isSendToEPOS && !isGelOldEposCheck && !isSendEPOSresponseToBackend

  useEffect(() => {
    // Agar xato bo'lsa yoki jarayon davom etsa modal ko'rsatiladi
    if (hasError || isFinishSaleWithoutAppPaymentType || isSendToEPOS || isGelOldEposCheck || isSendEPOSresponseToBackend) {
      setShowModal(true)
    }

    // Agar hamma jarayon tugagan bo'lsa va xato bo'lmasa, 1 sekunddan keyin modalni yopish
    if (allDone && !hasError) {
      const timer = setTimeout(() => {
        setCurrentStep(null)
        setHasError(false)
        setShowModal(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isFinishSaleWithoutAppPaymentType, isSendToEPOS, isGelOldEposCheck, isSendEPOSresponseToBackend, allDone, hasError])

  useEffect(() => {
    // Xato holatini birinchi tekshirish
    if (hasError) {
      setCurrentStep({
        label: t('pos.step_error'),
        progress: 100,
        startProgress: 100,
        endProgress: 100,
      })
      const timer = setTimeout(() => {
        setCurrentStep(null)
        setHasError(false)
        setShowModal(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
    // Keyingi steplarni ketma-ket tekshirish
    else if (isFinishSaleWithoutAppPaymentType) {
      setCurrentStep({
        label: t('pos.step_checking_product'),
        progress: 15,
        startProgress: 0,
        endProgress: 30,
      })
    } else if (isSendToEPOS || isGelOldEposCheck) {
      setCurrentStep({
        label: t('pos.step_sending_to_epos'),
        progress: 45,
        startProgress: 30,
        endProgress: 60,
      })
    } else if (isSendEPOSresponseToBackend) {
      setCurrentStep({
        label: t('pos.step_finishing_sale'),
        progress: 80,
        startProgress: 60,
        endProgress: 100,
      })
    } else if (allDone) {
      setCurrentStep({
        label: t('switch.title.completed'),
        progress: 100,
        startProgress: 100,
        endProgress: 100,
      })
    }
  }, [isFinishSaleWithoutAppPaymentType, isSendToEPOS, isSendEPOSresponseToBackend, allDone, hasError])

  // Agar modal ko'rsatilmasa yoki current step bo'lmasa hech narsa render qilmaymiz
  if (!showModal || !currentStep) return null

  const isCompleted = currentStep.progress === 100

  return (
    <>
      {/* Modal backdrop with blur */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(17, 18, 23, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 9000,
        }}
      />

      {/* Modal content */}
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 440,
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '2px solid #d5d7e2',
          boxShadow: 'none',
          zIndex: 9100,
          overflow: 'hidden',
        }}
      >
        {isCompleted ? (
          <Box
            sx={{
              padding: '32px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <Box
              sx={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: hasError ? '#e23a32' : '#1e9e52',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {hasError ? <ErrorIcon sx={{ color: '#fff', fontSize: 36 }} /> : <SuccessIcon sx={{ color: '#fff', fontSize: 36 }} />}
            </Box>

            <Typography
              sx={{
                fontSize: '18px',
                textAlign: 'center',
                fontWeight: 700,
                color: '#111217',
                marginTop: '8px',
              }}
            >
              {hasError ? t('pos.step_error_desc') : t('pos.step_printing_receipt')}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              padding: '32px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '56px',
                fontWeight: 800,
                textAlign: 'center',
                lineHeight: '1',
                color: '#111217',
                marginBottom: '20px',
              }}
            >
              {currentStep.progress}%
            </Typography>

            <Box sx={{ width: '100%', position: 'relative', marginBottom: '24px' }}>
              <Box
                sx={{
                  height: 12,
                  borderRadius: '100px',
                  backgroundColor: '#f1f2f5',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <LinearProgress
                  variant='determinate'
                  value={currentStep.progress}
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
                      backgroundColor: '#111217',
                      borderRadius: '100px',
                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                  }}
                />
              </Box>
            </Box>

            <Typography
              sx={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#111217',
                lineHeight: '28px',
                marginBottom: '8px',
                textAlign: 'center',
              }}
            >
              {currentStep.label}
            </Typography>

            <Typography
              sx={{
                fontSize: '14px',
                color: '#6f6f6f',
                fontWeight: '600',
                lineHeight: '20px',
                textAlign: 'center',
              }}
            >
              {t('pos.step_no_refresh_warning')}
            </Typography>
          </Box>
        )}
      </Box>
    </>
  )
}
