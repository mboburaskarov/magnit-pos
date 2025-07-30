import { Close } from '@mui/icons-material'
import { Box } from '@mui/material'
import Label from '../../../../components/Label'

function DmedPrescriptionsList({ data, setDmedPrescriptionsList }) {
  return (
    <Box mb={'24px'}>
      {data?.length > 0 ? (
        <Box sx={{ border: '1px solid #fe5000', position: 'relative', padding: '20px', borderRadius: '20px' }}>
          <Box sx={{ display: 'flex', mb: '4px', justifyContent: 'space-between' }}>
            <Label mb='0'>{'DMED'}</Label>
            <Box
              sx={{
                position: 'absolute',
                right: '10px',
                top: '10px',
                backgroundColor: 'grey.200',
                width: '25px',
                height: '25px',
                display: 'flex',
                borderRadius: '20px',
                alignItems: 'center',
              }}
              onClick={() => setDmedPrescriptionsList([])}
            >
              <Close sx={{ fontSize: '14px' }} />
            </Box>
          </Box>
          <Box sx={{ maxHeight: '150px', display: 'flex', overflowY: 'auto', flexDirection: 'column' }}>
            {data?.map((item) => (
              <Box sx={{ bgcolor: 'bg.10', m: '5px 0', borderRadius: '10px', padding: '3px 10px' }}>{item}</Box>
            ))}
          </Box>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  )
}

export default DmedPrescriptionsList
