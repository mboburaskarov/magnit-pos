import { Box, Typography } from '@mui/material'
import getImageUrl from '../../utils/getImageUrl'

export default function DrawerInfoBox({ infoData, columnGap = 2, mb = 4, mt = 2 }) {
  return (
    <Box rowGap={2} columnGap={columnGap} width='100%' display='inline-flex' flexWrap='wrap' mb={mb} mt={mt}>
      {infoData?.map((el, ind) => (
        <Box
          key={ind}
          onClick={el.onBoxCLick ? el.onBoxCLick : null}
          borderRadius={3}
          px={2}
          sx={{
            cursor: `${el.onBoxCLick && 'pointer'}`,
            '&:hover': {
              backgroundColor: `${el.onBoxCLick && 'gray.200'}`,
            },
            transitionProperty: `${el.onBoxCLick && 'background-color'}`,
            transitionDuration: `${el.onBoxCLick && '250ms'}`,
            transitionDelay: `${el.onBoxCLick && '0ms'}`,
          }}
          py={1.5}
          bgcolor='gray.100'
          width={el?.fullWidth ? '100%' : `calc(50% - ${(columnGap / 2) * 8}px)`}
          display='flex'
          flexDirection='column'
        >
          <Typography color='gray.400'>{el.title}</Typography>
          <Typography sx={{ '& > a': { color: 'gray.600', fontWeight: 'bold', '&:hover': { color: 'green.500' } } }} lineHeight='22px' fontSize={18}>
            {el.fileLink ? (
              <a target='_blank' rel='noreferrer' href={getImageUrl(el.fileLink)}>
                {el.info}
              </a>
            ) : (
              el.info
            )}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}
