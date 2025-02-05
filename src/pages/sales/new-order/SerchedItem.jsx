import { Box, Typography } from '@mui/material'
import Highlighter from 'react-highlight-words'
import CloseIcon from '../../../assets/icons/CloseIcon'
import ZoomTextIcon from '../../../assets/icons/ZoomTextIcon'

import { get } from 'lodash'
import { useState } from 'react'
import { useMutation } from 'react-query'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { requests } from '../../../../utils/requests'
import { error } from '../../../../utils/toast'
import thousandDivider from '../../../../utils/thousandDivider'

export default function SerchedItem({
  index,
  handleAddProduct,
  itemRef,
  fakeIndexForCheckSearch,
  item,
  isChild = true,
  classes,
  setSearchTerm,
  searchTerm,
  lastElementRef,
  product,
}) {
  const userData = useSelector((state) => state.user)
  const [openSimilar, setOpenSimilar] = useState(false)
  const [similarProductList, setSimilarProductList] = useState([])
  const { id } = useParams()
  const { mutate: getAllSimilarStoreProducts } = useMutation(requests.getAllSimilarStoreProducts, {
    onSuccess: ({ data }) => {
      if (data?.length) {
        setOpenSimilar(true)
        setSimilarProductList(data)
      }
    },
    onError: (err) => {
      error('Ошибка при получении похожих товаров.')
      console.log('err', err)
    },
  })
  return (
    <Box
      id={item?.id}
      className={classes.searchItem}
      onClick={() => {
        handleAddProduct({
          discount_type: 'percent',
          discount_value: 0,
          employee_id: userData.id,
          sale_id: id,
          store_product_id: product?.id,
          quantity: 1,
          unit_price: product?.retail_price,
        })
        setSearchTerm('')
      }}
      sx={{
        outline: 'none',
        '&:focus': {
          border: '2px solid #fe5000',
        },
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && fakeIndexForCheckSearch === index) {
          handleAddProduct(product)
        }
      }}
      tabIndex={index}
      key={index}
      ref={itemRef}
    >
      <Box borderRadius={'16px'} height={'80px'} display={'flex'} width={'100%'} alignItems={'center'}>
        <Box className={classes.searchItemBox}>
          <Box flex='1 0 20%' maxWidth={'100%'} overflow={'hidden'} display='flex' alignItems='center'>
            <div className={classes.searchImage}>
              <img src={product?.main_photo || '/default-img.avif'} />{' '}
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
                  textToHighlight={`${product?.name} / ${product?.category_name}`}
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
                <Typography color={'bunker.700'} fontSize={'14px'} fontWeight={'500'} lineHeight={'20px'}>
                  / {get(product, 'expire_day', 0)} kun
                </Typography>
              </Typography>
            </Box>
          </Box>
          <Box flex='0 0 22%' pr={2} textAlign='right'>
            <Typography className={classes.itemQuantity}>
              {product?.quantity > 0 ? (
                <span>Miqdor: {item?.quantity}</span>
              ) : (
                <Typography color={'orange.500'} fontWeight={'500'} fontSize={'14px'} lineHeight={'20px'}>
                  Sotuvda yo'q
                </Typography>
              )}
            </Typography>
            <Typography className={classes.itemPrice}>{thousandDivider(product?.retail_price, 'сум')} </Typography>
          </Box>
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
                e.stopPropagation(), !openSimilar ? getAllSimilarStoreProducts(get(product, 'id')) : setOpenSimilar(false)
              }}
            >
              {!openSimilar ? <ZoomTextIcon /> : <CloseIcon color='#000' />}
            </Box>
          )}
        </Box>

        <Box display={'flex'} flexDirection={'column'} padding={'16px'} bgcolor={'bg.10'} ml={'8px'} height={'80px'} borderRadius={'16px'} minWidth={'160px'}>
          <Typography sx={{ color: 'bunker.950', fontSize: '16px', lineHeight: '24px', fontWeight: '600' }}>Sotuv bonusi</Typography>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Typography sx={{ color: 'purple.500', fontSize: '14px', lineHeight: '20px', fontWeight: '500' }}>{product?.bonus_percent}%</Typography>
            <Typography sx={{ color: 'purple.500', fontSize: '14px', lineHeight: '20px', fontWeight: '500' }}>{product?.bonus_amount}</Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ paddingLeft: '40px', width: '100%' }}>
        {openSimilar &&
          get(similarProductList, 'data', []).map((item) => (
            <SerchedItem classes={classes} item={item} searchTerm={searchTerm} product={get(item, 'product')} key={item?.id} />
          ))}
      </Box>
    </Box>
  )
}
