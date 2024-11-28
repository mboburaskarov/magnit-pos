import { Box, Typography } from '@mui/material'
import StyledDialog from '../../../components/Dialogs/StyledDialog'
import Label from '../../../components/Label'
import { useQuery } from 'react-query'
import { requests } from '../../../utils/requests'
import getImageUrl from '../../../utils/getImageUrl'
import RightArrowSmallIcon from '../../assets/icons/RightArrowSmallIcon'

export default function ProductChangesDialog({ setChangesData, changesData }) {
  const { data: hashtags } = useQuery('hashtags', () => requests.getAllHashtags({ limit: 1000, offset: 0 }))
  const { data: categories } = useQuery('categories', () => requests.getAllCategories({ limit: 1000, offset: 0 }))

  return (
    <StyledDialog titleStyles={{ marginLeft: -32 }} onClose={() => setChangesData(null)} title='Изменения' open={changesData}>
      <Box py={4} px={6}>
        {changesData?.map((el, ind) => {
          return (
            <Box mb={2.5} key={ind}>
              <Label textTransform='capitalize' color='gray.600'>
                {el.keyName.toLowerCase()}
              </Label>
              <Box alignItems='center' mt={1} columnGap={1} width='100%' display='inline-flex'>
                <Typography sx={{ wordBreak: 'break-all' }} fontSize={18} fontWeight={600} py={1.5} px={2} borderRadius={2} bgcolor='gray.100' width='100%'>
                  {el.keyName === 'files' ? (
                    <Box>
                      {el.oldValue?.map((img, ind) => (
                        <img height={40} width={40} style={{ objectFit: 'cover' }} key={ind} src={getImageUrl(img)} alt='' />
                      ))}
                    </Box>
                  ) : (
                    String(
                      el.keyName === 'hashtag'
                        ? el.oldValue.map((el) => {
                            const name = hashtags?.data?.find((hashtag) => hashtag._id === el)?.nameRu
                            return name
                          })
                        : el.keyName === 'categories' || el.keyName === 'ancestorsOfCategories'
                        ? el.oldValue.map((el) => {
                            const name = categories?.data?.find((hashtag) => hashtag._id === el)?.nameRu
                            return name
                          })
                        : el.oldValue
                    )
                  )}
                </Typography>
                <Box>
                  <RightArrowSmallIcon />
                </Box>

                <Typography sx={{ wordBreak: 'break-all' }} fontSize={18} fontWeight={600} py={1.5} px={2} borderRadius={2} bgcolor='gray.100' width='100%'>
                  {el.keyName === 'files' ? (
                    <Box>
                      {el.newValue?.map((img, ind) => (
                        <img height={40} width={40} style={{ objectFit: 'cover', marginLeft: 8 }} key={ind} src={getImageUrl(img)} alt='' />
                      ))}
                    </Box>
                  ) : (
                    String(
                      el.keyName === 'hashtag'
                        ? el.newValue.map((el) => {
                            const name = hashtags?.data?.find((hashtag) => hashtag._id === el)?.nameRu
                            return name
                          })
                        : el.keyName === 'categories' || el.keyName === 'ancestorsOfCategories'
                        ? el.newValue.map((el) => {
                            const name = categories?.data?.find((hashtag) => hashtag._id === el)?.nameRu
                            return name
                          })
                        : el.newValue
                    )
                  )}
                </Typography>
              </Box>
            </Box>
          )
        })}
      </Box>
    </StyledDialog>
  )
}
