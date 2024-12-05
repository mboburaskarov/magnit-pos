import { Drawer } from '@mui/material'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useStyles } from './useStyles'
import SendCode from './SendCode'
import OtpVerification from './OtpVerification'
import SelectType from './SelectType'

function ClientVerification({ isOpen, closeDrawer, clientInfo, handleAddClient, setClientInfo }) {
  const [step, setStep] = useState('type')
  const classes = useStyles({ step })
  const methods = useForm()
  const [verificationData, setVerificationData] = useState(null)

  return (
    <Drawer
      open={isOpen}
      onClose={() => {
        closeDrawer()
        setTimeout(() => {
          setStep('type')
        }, 100)
      }}
      onKeyDown={() => {}}
      anchor='right'
      elevation={1}
      className={classes.drawer}
    >
      <FormProvider {...methods}>
        <form>
          <SelectType
            step={step}
            setStep={setStep}
            clientInfo={clientInfo}
            closeDrawer={closeDrawer}
            handleAddClient={handleAddClient}
            setVerificationData={setVerificationData}
          />
          <SendCode step={step} setStep={setStep} clientInfo={clientInfo} verificationData={verificationData} />
          <OtpVerification
            step={step}
            setStep={setStep}
            clientInfo={clientInfo}
            closeDrawer={closeDrawer}
            verificationData={verificationData}
            setClientInfo={setClientInfo}
          />
        </form>
      </FormProvider>
    </Drawer>
  )
}

export default ClientVerification
