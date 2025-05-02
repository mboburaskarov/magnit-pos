import { Box, Typography } from '@mui/material'
import CustomImg from '../../../components/CustomImg'
import getImageUrl from '../../../utils/getImageUrl'
import thousandDivider from '../../../utils/thousandDivider'
import CalendarIcon from '../../assets/icons/CalendarIcon'
import DashboardEmptyData from './DashboardEmptyData'

export default function DashboardTopCategories({ data, sortBy }) {
  const matches = true
  const formattedData = data?.slice(1, 6)

  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='flex-start'
      width='25%'
      sx={(theme) => ({ px: 3, py: 2.5, border: 0.5, borderColor: '#A4A5AB33', borderRadius: 6 })}
    >
      <Box justifyContent='space-between' width='100%' display='inline-flex'>
        <Typography fontSize={16} mt={0.5}>
          Топ категории
        </Typography>
        <CalendarIcon />
      </Box>
      {data?.length ? (
        <>
          <Box display='flex' alignItems='center' flexDirection='column' mt={2.5}>
            <Box position='relative' alignItems='center' display='inline-flex' mt={2}>
              <Typography
                sx={{ borderRadius: '50%', px: 1.2, bgcolor: 'green.600', left: '-8px', top: '-8px' }}
                zIndex={1}
                position='absolute'
                mr={1}
                fontSize={12}
                color='common.white'
                variant='h2'
                lineHeight='25px'
              >
                1
              </Typography>
              <CustomImg style={{ borderRadius: '16px' }} width={56} height={56} src={getImageUrl(data?.[0]?.icon)} alt='image of order' />
              <Box ml={1.5}>
                <Typography overflow='hidden' textOverflow='ellipsis' textAlign='left' lineHeight='16px' fontSize={14}>
                  {data?.[0]?.name}
                </Typography>
                <Typography fontSize={18} mt={-0.3} color='green.600' variant='h2'>
                  {thousandDivider(sortBy === 'SUM' ? data?.[0]?.totalAmount : data?.[0]?.count)} {sortBy === 'SUM' ? 'сум' : 'шт'}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box width='100%' display='flex' alignItems='center' flexDirection='column' mt={3}>
            {formattedData?.map((el, ind) => (
              <Box
                key={ind}
                justifyContent='space-between'
                borderRadius={4}
                px={1.5}
                py={1}
                alignItems='center'
                bgcolor={ind % 2 === 0 ? 'orange.100' : 'background.default'}
                width='100%'
                display='inline-flex'
                mt={2}
              >
                {matches ? (
                  <Box width='100%' alignItems='center' display='inline-flex'>
                    <Typography fontSize={14} mr={1} color='green.600' variant='h2'>
                      {ind + 2}
                    </Typography>
                    <CustomImg style={{ borderRadius: '12px' }} width={40} height={40} src={getImageUrl(el.icon)} alt='image of order' />
                    <Box width='100%' ml={1}>
                      <Typography overflow='hidden' textOverflow='ellipsis' textAlign='left' maxWidth='90%' fontSize={14}>
                        {el.name}
                      </Typography>
                      <Typography lineHeight='16px' fontSize={14} color='green.600' variant='h2'>
                        {thousandDivider(sortBy === 'SUM' ? el.totalAmount : el.count)} {sortBy === 'SUM' ? 'сум' : 'шт'}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Box alignItems='center' display='inline-flex'>
                      <Typography fontSize={14} mr={1} color='green.600' variant='h2'>
                        {ind + 2}
                      </Typography>
                      <CustomImg style={{ borderRadius: '12px' }} width={40} height={40} src={getImageUrl(el.icon)} alt='image of order' />
                      <Typography whiteSpace='nowrap' ml={1} overflow='hidden' textOverflow='ellipsis' textAlign='left' maxWidth='90%' fontSize={14}>
                        {el.name}
                      </Typography>
                    </Box>
                    <Box ml={1.5}>
                      <Typography whiteSpace='nowrap' fontSize={14} color='green.600' variant='h2'>
                        {thousandDivider(sortBy === 'SUM' ? el.totalAmount : el.count)} {sortBy === 'SUM' ? 'сум' : 'шт'}
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            ))}
          </Box>
        </>
      ) : (
        <DashboardEmptyData />
      )}
    </Box>
  )
}
