import thousandDivider from '@utils/thousandDivider'
import Highlighter from 'react-highlight-words'
import { Box, Typography } from '@mui/material'
import ZoomTextIcon from '@icons/ZoomTextIcon'
import PrizeBoxIcon from '@icons/PrizeBoxIcon'
import CustomImg from '@components/CustomImg'
import { useParams } from 'react-router-dom'
import { requests } from '@utils/requests'
import { useMutation } from 'react-query'
import CloseIcon from '@icons/CloseIcon'
import { error } from '@utils/toast'
import { useState } from 'react'
import { get } from 'lodash'
import dayjs from 'dayjs'

export default function SerchedItem({
  index,
  handleAddProduct,
  discount,
  itemRef,
  item,
  conflictItem = false,
  isSimilar = false,
  isChild = true,
  classes,
  searchTerm,
  product,
}) {
  const { id } = useParams()

  const [openSimilar, setOpenSimilar] = useState(false)
  const [similarProductList, setSimilarProductList] = useState([])

  const { mutate: getAllSimilarStoreProducts } = useMutation(requests.getAllSimilarStoreProducts, {
    onSuccess: ({ data }) => {
      if (data?.data?.length) {
        setOpenSimilar(true)
        setSimilarProductList(data)
      }
    },
    onError: (err) => {
      error('Ошибка при получении похожих товаров.')
      console.error('err', err)
    },
  })

  return (
    <Box
      id={item?.id}
      data-barcode={product?.barcode}
      className={classes.searchItem + ' search-item'}
      onClick={() => {
        handleAddProduct({
          discount_type: get(discount, 'type', 'percent'),
          discount_value: Number(get(discount, 'amount', 0)),
          sale_id: id,
          barcode: product?.barcode,
          store_product_id: get(product, 'id', 'err #1'),
        })
      }}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        outline: 'none',
        '&:focus': isSimilar
          ? {}
          : {
              '& .main-Box': {
                border: '2px solid #fe5000',
                bgcolor: '#ccc !important',
              },
            },
      }}
      tabIndex={index}
      key={index}
      ref={itemRef}
    >
      <Box display={'flex'} width={'100%'} alignItems={'center'}>
        <Box
          className={classes.searchItemBox + ' main-Box'}
          sx={{
            borderTopLeftRadius: index == 0 ? 16 : 0,
            borderBottomLeftRadius: index == 29 ? 16 : 0,
            borderTopRightRadius: index == 0 ? 16 : 0,
            borderBottomRightRadius: index == 29 ? 16 : 0,
          }}
        >
          <Box flex='1 0 20%' maxWidth={'100%'} overflow={'hidden'} display='flex' alignItems='center'>
            <div className={classes.searchImage}>
              <CustomImg src={product?.main_photo || '65eb3e64-185f-4642-8261-1aeec7379760.jpg'} />
            </div>
            <Box ml={2} width={'100%'} overflow={'hidden'}>
              <Typography
                textOverflow={'ellipsis'}
                maxWidth={'calc(100% - 1px)'}
                whiteSpace={'nowrap'}
                style={{ textDecoration: get(product, 'expire_day', 0) <= 0 ? 'line-through' : 'none' }}
                overflow={'hidden'}
                id='product-name'
                className={classes.itemName}
              >
                <Highlighter
                  highlightClassName='highlighter'
                  searchWords={[searchTerm]}
                  autoEscape
                  textToHighlight={`${product?.name} / ${product?.category_name} (${product?.producer_name})`}
                />
              </Typography>
              <Typography display={'flex'} id='product-barcode'>
                <Highlighter
                  highlightClassName='highlighter'
                  searchWords={searchTerm ? searchTerm?.split(' ') : []}
                  autoEscape
                  className={classes.itemBarcode}
                  textToHighlight={product?.barcode}
                />
                <Typography color={get(product, 'expire_day', 0) < 0 ? 'red.500' : 'bunker.700'} fontSize={'14px'} fontWeight={'500'} lineHeight={'20px'}>
                  / {dayjs(get(product, 'expire_date')).format('DD.MM.YYYY')} ({get(product, 'expire_day', 0)} kun)
                </Typography>
              </Typography>
            </Box>
          </Box>
          {item?.requires_prescription && (
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              m={'auto 10px'}
              bgcolor={'red.200'}
              borderRadius={'20px'}
              p={'0 10px'}
              height={'20px'}
            >
              <Typography fontSize={'12px'} lineHeight={'16px'} fontWeight={'600'} color={'red.500'}>
                Рецепт
              </Typography>
            </Box>
          )}
          {!conflictItem && (
            <Box flex='0 0 22%' pr={2} textAlign='right'>
              <Box display={'flex'} justifyContent={'end'} alignItems={'center'}>
                {item?.bonus_amount > 0 && (
                  <Box
                    sx={{
                      borderRadius: '24px',
                      padding: '0 9px',
                      height: '22px',
                      display: 'flex',
                      mr: '10px',
                      alignItems: 'center',
                      backgroundColor: 'orange.500',
                    }}
                  >
                    <PrizeBoxIcon />
                    <Typography ml='4px' color={'white'} fontSize={'10px'} fontWeight={'600'}>
                      {item.bonus_amount}сум
                    </Typography>
                  </Box>
                )}
                <Box>
                  <Typography whiteSpace={'pre'} className={classes.itemQuantity}>
                    <span>Кол: {item?.quantity}</span>
                  </Typography>
                  <Typography whiteSpace={'pre'} className={classes.itemPrice}>
                    {thousandDivider(product?.retail_price, 'сум')}{' '}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          {!isChild && (
            <Box
              width={'48px'}
              minWidth={'48px'}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              height={'48px'}
              borderRadius={'50%'}
              bgcolor={'#F8F8F9'}
              onClick={(e) => {
                e.stopPropagation()
                if (openSimilar) {
                  setOpenSimilar(false)
                } else {
                  getAllSimilarStoreProducts(get(product, 'product_id'))
                  setOpenSimilar(true)
                }
              }}
            >
              {!openSimilar ? <ZoomTextIcon /> : <CloseIcon color='#000' />}
            </Box>
          )}
        </Box>
      </Box>
      <Box sx={{ paddingLeft: '40px', width: '100%' }}>
        {openSimilar &&
          get(similarProductList, 'data', []).map((item) => (
            <Box
              sx={{
                '& .search-item': {
                  '.main-Box': {
                    border: '2px solid #fff !important',
                    bgcolor: '#fff !important',
                  },
                },
              }}
            >
              <SerchedItem isSimilar={true} classes={classes} item={item} searchTerm={searchTerm} product={item} key={item?.id} />
            </Box>
          ))}
      </Box>
    </Box>
  )
}
