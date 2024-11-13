import { Box, Button, Typography } from '@mui/material'
import LoadingContainer from '../../../../components/LoadingContainer'
import { useMutation, useQuery } from 'react-query'
import { requests } from '../../../../utils/requests'
import { useState } from 'react'
import TabContainer from '../../../../components/Tab/TabContainer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import LoadingBlurry from '../../../../components/LoadingBlurry'
import HashtagsBox from './HashtagsBox'
import { OverlayNoRowsTemplate } from '../../../../components/AgGridTable/AgGridComponents'
import ConfirmDialog from '../../../../components/ConfirmDialog'
import BigWarningIcon from '../../../assets/icons/BigWarningIcon'
import { LoadingButton } from '@mui/lab'
import { error, success } from '../../../../utils/toast'
import HashtagCreateDrawer from './HashtagCreateDrawer'
import CheckAccess from '../../../../components/CheckAccess'

export default function HashtagsPage() {
  const [status, setStatus] = useState('ALL')
  const [openConfirmDialog, setOpenConfirmDialog] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(null)

  const {
    data: hashtagsList,
    isLoading: hashtagsLoading,
    isFetching: isFetchingHashtagsList,
    refetch,
  } = useQuery(['hashtagsList', status], () => requests.getAllHashtags({ status }))

  const { mutate: deleteHashtag, isLoading: isDeletingHashtag } = useMutation(requests.deleteHashtag, {
    onSuccess: () => {
      refetch()
      success('Хэштег успешно удален!')
      setOpenConfirmDialog(null)
    },
    onError: (err) => {
      refetch()
      error('Ошибка при удалении хэштега!')
      setOpenConfirmDialog(null)
      console.log('err', err)
    },
  })

  return (
    <LoadingContainer readyState={true}>
      <Box display='flex' flexDirection='column' position='relative' pt={6} px={4} pb={3}>
        <Box>
          <Typography variant='h1'>Хэштеги ( {hashtagsList?.data?.length || 0} )</Typography>
        </Box>
        <Box alignItems={'center'} justifyContent={'space-between'} display='flex' width='100%' mb={3} mt={3}>
          <TabContainer
            customTooltip
            tabs={[
              { id: 'ALL', label: 'Все' },
              //   { id: 'BUCHET', label: 'Buchet' },
            ]}
            selected={status}
            setSelected={setStatus}
          />
          <CheckAccess id={'hashtag-create'}>
            <Box minWidth={156}>
              <Button
                onClick={() => setIsDrawerOpen({ type: 'create' })}
                fullWidth
                startIcon={<FontAwesomeIcon width={14} icon={faPlus} />}
                variant='contained'
                color='primary'
              >
                Создать
              </Button>
            </Box>
          </CheckAccess>
        </Box>
        <Box mb={4} mt={4}>
          <LoadingBlurry isLoading={hashtagsLoading || isFetchingHashtagsList} height={-50} outside />
          {hashtagsList?.data?.map((hashtag, ind) => (
            <HashtagsBox setOpenConfirmDialog={setOpenConfirmDialog} key={ind} data={hashtag} ind={ind} />
          ))}
          {!hashtagsList?.data?.length && <OverlayNoRowsTemplate />}
        </Box>
      </Box>
      <HashtagCreateDrawer refetch={refetch} isOpen={isDrawerOpen?.type === 'create'} onClose={() => setIsDrawerOpen(null)} />
      {openConfirmDialog && (
        <ConfirmDialog
          open={!!openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          icon={<BigWarningIcon />}
          title={'Удалить категорию'}
          desc={'Вы действительно хотите удалить категорию?'}
          actions={
            <>
              <Button variant='contained' color='secondary' onClick={() => setOpenConfirmDialog(null)}>
                Нет
              </Button>
              <LoadingButton variant='contained' type='button' loading={isDeletingHashtag} onClick={() => deleteHashtag(openConfirmDialog.id)}>
                Да
              </LoadingButton>
            </>
          }
        />
      )}
    </LoadingContainer>
  )
}
