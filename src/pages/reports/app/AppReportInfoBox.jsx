import { Box, Typography } from '@mui/material'
import thousandDivider from '../../../../utils/thousandDivider'
import LoadingContainer from '../../../../components/LoadingContainer'
// import DashboardEmptyData from './DashboardEmptyData'

export default function AppReportInfoBox({ data, headerText }) {
  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='flex-start'
      width='100%'
      sx={(theme) => ({ px: 3, py: 2.5, boxShadow: theme.boxShadow['16-8'], borderRadius: 6 })}
    >
      <Box justifyContent='space-between' width='100%' display='inline-flex'>
        <Box pb={2.5} borderBottom='1px solid' borderColor='gray.200' width='100%' mt={1} justifyContent='space-between' display='inline-flex'>
          <Typography fontSize={24}>{headerText}</Typography>
        </Box>
      </Box>
      {data?.length ? (
        <Box width='100%' display='flex' alignItems='center' flexDirection='column' mt={2} maxHeight={'428px'} overflow={'auto'}>
          {data?.map((el, ind) => (
            <Box
              key={ind}
              justifyContent='space-between'
              borderRadius={4}
              px={2}
              py={1.5}
              alignItems='center'
              width='100%'
              backgroundColor={ind % 2 === 0 ? 'background.defaultStrong' : 'background.default'}
              display='inline-flex'
              mt={0}
            >
              <Box alignItems='center' display='inline-flex'>
                <Typography textAlign='center' width={24} fontSize={16} mr={1} color='green.600' variant='h2'>
                  {ind + 1}
                </Typography>
                <Typography whiteSpace='nowrap' ml={2} overflow='hidden' textOverflow='ellipsis' textAlign='left' maxWidth='90%' fontSize={16}>
                  {el._id}
                </Typography>
              </Box>
              <Box ml={1.5}>
                <Typography whiteSpace='nowrap' fontSize={16} color='green.600' variant='h2'>
                  {thousandDivider(el.count)}
                  <Typography ml={0.5} whiteSpace='nowrap' variant='span' fontSize={16} color='gray.500'>
                    шт
                  </Typography>
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box
          border='1px solid'
          borderColor='gray.200'
          borderRadius='0 0 12px 12px'
          flexDirection='column'
          width='100%'
          height='100%'
          display='flex'
          justifyContent='center'
          alignItems='center'
          minHeight={400}
          mt={2.5}
          px={2}
        >
          <Typography textAlign='center' fontSize={24} color='gray' variant='h2'>
            Данные не найдены
          </Typography>
        </Box>
      )}
    </Box>
  )
}
