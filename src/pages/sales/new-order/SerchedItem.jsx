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
  discount,

  itemRef,
  fakeIndexForCheckSearch,
  item,
  conflictItem = false,
  isSimilar = false,
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
      if (data?.data?.length) {
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
      className={classes.searchItem + ' search-item'}
      onClick={() => {
        handleAddProduct({
          discount_type: get(discount, 'type', 'percent'),
          discount_value: Number(get(discount, 'amount', 0)),
          sale_id: id,
          store_product_id: get(product, 'id', 'err #1'),
        })
        setSearchTerm('')
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
      // onKeyDown={(event) => {
      //   if (event.key === 'Enter' && fakeIndexForCheckSearch === index) {
      //     handleAddProduct(product)
      //   }
      // }}
      tabIndex={index}
      key={index}
      ref={itemRef}
    >
      <Box borderRadius={'16px'} display={'flex'} width={'100%'} alignItems={'center'}>
        <Box className={classes.searchItemBox + ' main-Box'}>
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
                {/* <Typography color={'bunker.700'} fontSize={'14px'} fontWeight={'500'} lineHeight={'20px'}>
                  / {get(product, 'quantity ', 0)}
                </Typography> */}
                <Typography color={get(product, 'expire_day', 0) < 0 ? 'red.500' : 'bunker.700'} fontSize={'14px'} fontWeight={'500'} lineHeight={'20px'}>
                  / {get(product, 'expire_day', 0)} kun
                </Typography>
              </Typography>
            </Box>
          </Box>
          {!conflictItem && (
            <Box flex='0 0 22%' pr={2} textAlign='right'>
              <Typography whiteSpace={'pre'} className={classes.itemQuantity}>
                <span>Miqdor: {item?.quantity}</span>
              </Typography>
              <Typography whiteSpace={'pre'} className={classes.itemPrice}>
                {thousandDivider(product?.retail_price, 'сум')}{' '}
              </Typography>
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

      {item?.bonus_amount > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: 3,
            right: -16,
            backgroundColor: '#fe5000',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            padding: '2px 15px 2px 30px',
            transform: 'rotate(35deg)',
          }}
          id='product-details'
        >
          Bonus
        </Box>
      )}
    </Box>
  )
}
