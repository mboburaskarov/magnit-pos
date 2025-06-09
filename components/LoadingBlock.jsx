import { Box, CircularProgress } from '@mui/material'

export default function LoadingBlock(props) {
  return (
    <Box width='100%' bgcolor={'#15111230'} height='100%' display='flex' alignItems='center' justifyContent='center' p={props?.mini && 2} {...props}>
      <CircularProgress size={props.mini && 22} />
    </Box>
  )
}
