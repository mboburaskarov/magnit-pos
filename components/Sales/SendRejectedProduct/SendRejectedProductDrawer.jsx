import { Box, Drawer, Typography } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import CloseIcon from '../../../src/assets/icons/CloseIcon'
import { useQueryParams } from '../../../src/hooks/useQueryParams'
import { requests } from '../../../utils/requests'
import InputSearch from '../../Inputs/InputSearch'
import OutLineTextFieldThousand from '../../Inputs/OutLineTextFieldThousand'
import ResultItem from './ResultItem'
import { t } from 'i18next'

const useStyles = makeStyles((theme) => ({
  drawer: {
    '& .MuiDrawer-paper': {
      width: '660px',
      borderRadius: '24px 0 0 24px',
      backgroundColor: theme.palette.background.default,
    },
  },
  drawerHeader: {
    padding: '40px 40px 24px 40px',
    borderBottom: `1px solid ${theme.palette.bunker[100]}`,
  },
}))
function SendRejectedProductDrawer({ open, setOpen, setOpenRejectConfirmDialog, cashBoxDetails }) {
  const classes = useStyles()
  const userData = useSelector((state) => state.user)
  const { values } = useQueryParams()
  const [itemCount, setItemcount] = useState(1)
  useEffect(() => {
    setItemcount(1)
  }, [values?.search])
  const { data } = useQuery(['searchCustomers', values?.search], () =>
    requests.getAllProductsList({
      search: values?.search,
      offset: 0,
      limit: 30,
    })
  )
  const theme = useTheme()
  return (
    <Drawer open={open} onClose={() => setOpen(false)} anchor='right' elevation={1} className={classes.drawer}>
      <Box>
        <Box display={'flex'} justifyContent={'space-between'} className={classes.drawerHeader}>
          <Typography fontSize={24} lineHeight={'48px'} fontWeight={700}>
            {t('navbar.rejected_products')}
          </Typography>
          <CloseIcon color={theme.palette.black} onClick={() => setOpen(false)} />
        </Box>
        <Box display={'flex'} py={'24px'} px={'40px'}>
          <InputSearch fullWidth uncontrolled placeholder={t('search_product')} />
        </Box>
        <Box
          py={'0px'}
          px={'40px'}
          sx={{
            maxHeight: 'calc(100vh - 250px)',
            overflow: 'hidden',
            overflowY: 'auto',
          }}
        >
          {data?.data?.data?.length > 0 ? (
            data?.data?.data?.map((product, index) => (
              <ResultItem
                isChild={false}
                discount={0}
                index={product?.id}
                setOpenRejectConfirmDialog={setOpenRejectConfirmDialog}
                handleAddProduct={(handleAddProduct) => {}}
                setSearchTerm={values?.search}
                item={product}
                // itemRef={(el) => (searchItemRef.current[index] = el)}
                product={product}
                searchTerm={'searchTearm'}
                classes={classes}
                // setOpenRejectConfirmDialog={setOpenRejectConfirmDialog}
              />
            ))
          ) : (
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              sx={{
                backgroundColor: 'bg.10',
                padding: '20px ',
              }}
            >
              <Typography>"{values?.search}" - продукт не найден</Typography>
              <Box display={'flex'} justifyContent={'end'} alignItems={'center'}>
                <OutLineTextFieldThousand
                  setValue={(e) => {
                    if (e < 1) {
                      setItemcount(1)
                    } else {
                      setItemcount(e)
                    }
                  }}
                  value={itemCount}
                  type={'number'}
                  fullWidth
                  name='discount'
                  label={''}
                  minNumber={1}
                  uncontrolled
                  sx={{
                    width: '80px',
                    m: '0 10px',
                  }}
                  placeholder='Введите скидку'
                />
                <Typography
                  onClick={(e) => {
                    e.stopPropagation() // Prevent click from reaching Box
                    setOpenRejectConfirmDialog({
                      product_name: values?.search,
                      count: itemCount,
                    })
                  }}
                  sx={{
                    bgcolor: '#f22',
                    color: '#fff',
                    padding: '5px 10px',
                    borderRadius: '10px',
                    mr: '10px',
                    fontSize: '17px',
                  }}
                >
                  Отказ
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  )
}

export default SendRejectedProductDrawer
