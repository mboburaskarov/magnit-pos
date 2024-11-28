import { Box, Button, IconButton, Typography } from '@mui/material'
import LoadingContainer from '../../../../components/LoadingContainer'
import TabContainer from '../../../../components/Tab/TabContainer'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { requests } from '../../../../utils/requests'
import ImageCell from '../../../../components/AgGridTable/Cells/ImageCell'
import ImageGallery from '../../../../components/ImageGallery'
import dayjs from 'dayjs'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import StatusCell from '../../../../components/AgGridTable/Cells/StatusCell'
import BannerCreateDrawer from './BannerCreateDrawer'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import { error, success } from '../../../../utils/toast'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import { LoadingButton } from '@mui/lab'
import { OverlayNoRowsTemplate } from '../../../../components/AgGridTable/AgGridComponents'
import BannerUserIcon from '../../../assets/icons/ReviewUserIcon'
import BannerValueIcon from '../../../assets/icons/ReviewOrderIcon'
import BannerDate from '../../../assets/icons/DateIcon'
import CheckAccess from '../../../../components/CheckAccess'

export default function BannersPage() {
  const [status, setStatus] = useState('ALL')
  const [images, setImages] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(null)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const getBannersParams = useMemo(() => {
    if (status !== 'ALL') {
      return { appType: status }
    }
    return {}
  }, [status])
  const { refetch: refetchGetAllBanners, data: bannersList } = useQuery(['banners'], () => requests.getAllBanners(getBannersParams))
  const { mutate: deleteBanner, isLoading: isDeletingBanner } = useMutation(requests.deleteBanner, {
    onSuccess: () => {
      success('Баннер успешно удален!')
      setOpenConfirmDialog(null)
      refetchGetAllBanners()
    },
    onError: (err) => {
      error('Ошибка при удалении баннера!')
      console.log('err', err)
    },
  })

  useEffect(() => {
    refetchGetAllBanners()
  }, [getBannersParams])

  return (
    <LoadingContainer readyState={true}>
      <Box pb={2}>
        <Box display='flex' flexDirection='column' position='relative' pt={6} px={4} pb={3}>
          <Typography variant='h1'>Баннеры ({bannersList?.data?.length})</Typography>
          <Box mt={4}>
            <Box display={'flex'} justifyContent={'space-between !important'} alignItems={'center'} mb={4}>
              <TabContainer
                customTooltip
                tabs={[
                  { label: 'Все', id: 'ALL' },
                  { label: 'Buchet', id: 'BUCHET' },
                  { label: 'Market', id: 'MARKET' },
                ]}
                selected={status}
                setSelected={setStatus}
              />
              <CheckAccess id={'banner-create'}>
                <Button
                  onClick={() => setIsDrawerOpen({ type: 'create' })}
                  startIcon={<FontAwesomeIcon width={14} icon={faPlus} />}
                  variant='contained'
                  color='primary'
                  sx={{ width: 160 }}
                >
                  Создать
                </Button>
              </CheckAccess>
            </Box>
            <Box>
              <BannerCreateDrawer refetch={refetchGetAllBanners} isOpen={isDrawerOpen?.type === 'create'} onClose={() => setIsDrawerOpen(null)} />
              <ImageGallery open={images} setOpen={setImages} imagesArr={images?.data} />
              {!bannersList?.data?.length && <OverlayNoRowsTemplate />}
              {bannersList?.data.map((banner, ind) => {
                return (
                  <Box
                    key={ind}
                    borderRadius={4}
                    px={4}
                    py={3}
                    backgroundColor={ind % 2 === 0 ? 'gray.50' : 'background.default'}
                    display='inline-flex'
                    width='100%'
                    justifyContent='space-between'
                  >
                    <Box>
                      <Box display='flex' mt={1}>
                        <ImageCell width={450} height={150} imageArr={[banner?.imageRu]} setImages={setImages} />
                      </Box>
                      <Box mt={2} display='inline-flex'>
                        <Box alignItems='center' display='inline-flex'>
                          <BannerValueIcon />
                          <Typography ml={0.7} color='gray.600' fontSize={18} lineHeight='24px'>
                            {banner?.type || '-'}
                          </Typography>
                        </Box>
                        <Box alignItems='center' display='inline-flex' ml={2}>
                          <BannerUserIcon />
                          <Typography ml={0.7} color='gray.600' fontSize={18} lineHeight='24px'>
                            {banner?.userInfo?.fullName || 'Новый пользователь'}
                          </Typography>
                        </Box>
                        <Box alignItems='center' display='inline-flex' ml={2}>
                          <BannerDate />
                          <Typography ml={0.7} color='gray.600' fontSize={18} lineHeight='24px'>
                            {dayjs(banner?.createdAt).format('DD.MM.YYYY HH:mm') || '00.00.0000 00:00'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    {!banner?.isDeleted && (
                      <Box alignItems='center' columnGap={2} display='inline-flex'>
                        <StatusCell id={`banners-apptype-${1}`} bgcolor={'green.600'} title={banner?.appType || '-'} />
                        <CheckAccess id={'banner-delete'}>
                          <IconButton onClick={() => setOpenConfirmDialog({ type: 'delete', id: banner?._id })} sx={{ borderRadius: 3, p: '14px' }}>
                            <DeleteIcon />
                          </IconButton>
                        </CheckAccess>
                      </Box>
                    )}
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Box>
      </Box>
      {openConfirmDialog && (
        <ConfirmDialog
          open={!!openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          icon={<BigWarningIcon />}
          title={openConfirmDialog?.type === 'delete' && 'Удалить баннер?'}
          desc={'Вы действительно хотите удалить баннер, вы не можете вернуть этот баннер после удаления.'}
          actions={
            <>
              <Button variant='contained' color='secondary' onClick={() => setOpenConfirmDialog(null)}>
                Нет
              </Button>
              <LoadingButton
                variant='contained'
                type='button'
                loading={isDeletingBanner}
                onClick={() => {
                  deleteBanner(openConfirmDialog?.id)
                }}
              >
                Да
              </LoadingButton>
            </>
          }
        />
      )}
    </LoadingContainer>
  )
}
