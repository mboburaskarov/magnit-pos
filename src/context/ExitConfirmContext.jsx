import { createContext, useContext } from 'react'

import ExitConfirmModal from '../../components/Dialogs/ExitConfirmModal'
import useExitConfirm from '../hooks/useExitConfirm'

const ExitConfirmContext = createContext(null)

export const useExitConfirmContext = () => {
  const context = useContext(ExitConfirmContext)
  if (!context) {
    throw new Error('useExitConfirmContext must be used within an ExitConfirmProvider')
  }
  return context
}

// Mounts the app-wide exit guard once at the app root; call requestExit() from useExitConfirmContext() to reuse its modal elsewhere.
export default function ExitConfirmProvider({ children }) {
  const { isExitModalOpen, confirmExit, cancelExit, requestExit } = useExitConfirm({ enabled: true })

  return (
    <ExitConfirmContext.Provider value={{ requestExit }}>
      {children}
      <ExitConfirmModal open={isExitModalOpen} onConfirm={confirmExit} onCancel={cancelExit} />
    </ExitConfirmContext.Provider>
  )
}
