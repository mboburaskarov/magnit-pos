import { Box, Typography } from '@mui/material'
import Highlighter from 'react-highlight-words'
import SearchIcon from '../../../assets/icons/SearchIcon'
import paletteLight from '../../../assets/theme/paletteLight'
import ZoomTextIcon from '../../../assets/icons/ZoomTextIcon'
// import currency from '../../../utils/currency'

export default function SerchedItem({
  index,
  handleAddProduct,
  setSearchTerm,
  fakeIndexForCheckSearch,
  item,
  getShopPrice,
  classes,
  searchTerm,
  wholeSaleEnabled,
  current_shop_id,
  lastElementRef,
  product,
}) {
  return (
    <div
      id={`cartSearchResult${index}`}
      className={classes.searchItem}
      onClick={() => {
        handleAddProduct({ discount_type: 'cash', discount_value: 100, product_id: product?.id, quantity: 1, unit_price: product?.retail_price })
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && fakeIndexForCheckSearch === index) {
          handleAddProduct(product)
        }
      }}
      tabIndex={index}
      key={index}
      ref={lastElementRef}
    >
      <Box
        p={'12px 16px'}
        borderRadius={'16px'}
        bgcolor={'background.default'}
        height={'80px'}
        display={'flex'}
        width={'100%'}
        justifyContent={'end'}
        alignItems={'center'}
      >
        <Box flex='1 0 60%' display='flex' alignItems='center'>
          <div className={classes.searchImage}>
            <img src={product?.main_photo || '/default-img.avif'} />{' '}
          </div>
          <Box ml={2}>
            <Typography textOverflow={'ellipsis'} maxWidth={'190px'} whiteSpace={'nowrap'} overflow={'hidden'} id='product-name' className={classes.itemName}>
              <Highlighter
                highlightClassName='highlighter'
                searchWords={[searchTerm]}
                autoEscape
                textToHighlight={`${product?.name} / ${product?.category?.name}`}
              />
            </Typography>
            <Typography id='product-barcode'>
              <Highlighter
                highlightClassName='highlighter'
                searchWords={searchTerm ? searchTerm?.split(' ') : []}
                autoEscape
                className={classes.itemBarcode}
                textToHighlight={product?.barcode}
              />
            </Typography>
          </Box>
        </Box>
        <Box flex='0 0 30%' pr={2} textAlign='right'>
          <Typography className={classes.itemQuantity}>
            {product?.quantity > 0 ? (
              <span>Miqdor: {product?.quantity}</span>
            ) : (
              <Typography color={'orange.500'} fontWeight={'500'} fontSize={'14px'} lineHeight={'20px'}>
                Sotuvda yo'q
              </Typography>
            )}
          </Typography>
          <Typography className={classes.itemPrice}>{product?.retail_price} so'm</Typography>
        </Box>
        <Box
          width={'48px'}
          minWidth={'48px'}
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          height={'48px'}
          borderRadius={'50%'}
          bgcolor={'#F8F8F9'}
        >
          <ZoomTextIcon />
        </Box>
      </Box>

      <Box display={'flex'} flexDirection={'column'} padding={'16px'} bgcolor={'bg.10'} ml={'8px'} height={'80px'} borderRadius={'16px'} minWidth={'160px'}>
        <Typography sx={{ color: 'bunker.950', fontSize: '16px', lineHeight: '24px', fontWeight: '600' }}>Sotuv bonusi</Typography>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Typography sx={{ color: 'purple.500', fontSize: '14px', lineHeight: '20px', fontWeight: '500' }}>2%</Typography>
          <Typography sx={{ color: 'purple.500', fontSize: '14px', lineHeight: '20px', fontWeight: '500' }}>4 986 so'm</Typography>
        </Box>
      </Box>
    </div>
  )
}
