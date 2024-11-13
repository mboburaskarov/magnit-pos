import CardDrawer from '../../../components/Drawers/CardDrawer'

export default function TrackingDrawer({ isOpen, onClose }) {
  return (
    <CardDrawer fullWidth center isOpen={!!isOpen} closeDrawer={onClose} withoutActions>
      <iframe
        src={isOpen}
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
          borderRadius: '20px',
        }}
        allowFullScreen
      />
    </CardDrawer>
  )
}
