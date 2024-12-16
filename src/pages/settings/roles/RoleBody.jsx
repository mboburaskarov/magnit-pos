import { Box, Button, Typography } from '@mui/material'
import { createContext, useEffect, useRef, useState } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import TextField from '../../../../components/Inputs/TextField'
import AgGridTable from '../../../../components/AgGridTable/AgGridTable'
import CategoriesTree from '../../../../components/CategoriesTree'
import InputDatePicker from '../../../../components/Inputs/InputDatePicker'
import InputWithButton from '../../../../components/Inputs/InputWithButton'
import OutLineTextField from '../../../../components/Inputs/OutLineTextField'
import Label from '../../../../components/Label'
import SectionTitle from '../../../../components/SectionTitle'
import UploadImage from '../../../../components/UploadImage'
import { requests } from '../../../../utils/requests'
import { useQueryParams } from '../../../hooks/useQueryParams'
import InputSearch from '../../../../components/Inputs/InputSearch'
import Section from './Section'
import useScrollSpy from '../../../hooks/useScrollSpy'

import CartOutlineIcon from '../../../assets/icons/CartOutline'
import MenuOutline from '../../../assets/icons/MenuOutline'
import ProductsIcon from '../../../assets/icons/ProductsIcon'
import QrScanIcon from '../../../assets/icons/QrScanIcon'
import UsersIcon from '../../../assets/icons/UsersIcon'
import UserOutlineIcon from '../../../assets/icons/UserOutlineIcon'
import FinanceIcon from '../../../assets/icons/FInanceIcon'
import { get } from 'lodash'
import { makeStyles } from '@mui/styles'
import { error, success } from '../../../../utils/toast'
import { useNavigate } from 'react-router-dom'
import useDidUpdate from '../../../hooks/useDidUpdate'
// import productStoresTableHeaderSelector from './productStoresTableHeaderSelector'

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    // width: '690px',
  },
}))
const filterTwoArrays = (array1, array2) => {
  const arr = array1?.filter((item) => {
    const onlyIds = array2?.map((el) => el._id)

    return !onlyIds?.includes(item._id)
  })
  return arr
}
export const SearchContext = createContext()

const items = [
  {
    id: 'role-products',
    title: 'navbar.products',
    icon: <MenuOutline gray />,
  },
  {
    id: 'role-sales',
    title: 'navbar.sales',
    icon: <ProductsIcon gray />,
  },
  {
    id: 'role-clients',
    title: 'navbar.clients',
    icon: <QrScanIcon gray />,
  },
  {
    id: 'role-marketing',
    title: 'navbar.marketing',
    icon: <UsersIcon gray />,
  },
  {
    id: 'role-reports',
    title: 'navbar.reports',
    icon: <UserOutlineIcon gray />,
  },
  {
    id: 'role-finances',
    title: 'navbar.finance',
    icon: <FinanceIcon gray />,
  },
  {
    id: 'role-settings',
    title: 'navbar.settings',
    icon: <CartOutlineIcon gray />,
  },
  {
    id: 'role-employees',
    title: 'navbar.management',
    icon: <CartOutlineIcon gray />,
  },
  {
    id: 'role-dashboard',
    title: 'navbar.dashboard',
    icon: <CartOutlineIcon gray />,
  },
]
export default function RoleBody({ productData = null }) {
  const { setValue, watch } = useFormContext()
  const [productCategories, setProductCategories] = useState([{}])
  const [hasDiscontPrice, setHasDiscontPrice] = useState(false)
  // const { columns, loading } = useSelector((state) => state.storesListTableColumnsForProduct)
  const { values } = useQueryParams()
  const navigate = useNavigate()

  const [selected, setSelected] = useState([])
  const [disabled, setDisabled] = useState([])
  const classes = useStyles()
  const methods = useForm()
  const sectionRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ]

  const activeSection = useScrollSpy({
    sectionElementRefs: sectionRefs,
    offsetPx: -180,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [permissionList, setPermissionList] = useState([])

  const [parentCategory, setParentCategory] = useState(null)
  const { t } = useTranslation()
  const [images, setImages] = useState([])
  const appType = watch('app_type') || 'BUCHET'
  // const tableColumns = productStoresTableHeaderSelector({
  //   productsColumns: columns,
  //   t,
  //   values,
  // })
  const { data: rolesAndPermissionList, refetch: refetchrolesAndPermissionList } = useQuery('rolesAndPermissionList', () =>
    requests.getAllRolesWithPermissions({ limit: 1000, offset: 0, type: appType })
  )
  const { data: parentCategories } = useQuery('parentCategories', () => requests.getAllCategories())
  // const { data: subCategories, refetch: refetchCategories } = useQuery(
  //   ['subCategories', parentCategory, appType],
  //   () => requests.getAllCategories({ type: appType, subId: parentCategory.id }),
  //   { enabled: !!appType && !!productData?.categories?.length > 0 }
  // )
  // const { data: hashtags } = useQuery('hashtags', () => requests.getAllHashtags({ limit: 1000, offset: 0 }))

  useEffect(() => {
    if (productData) {
      setValue('product_name', productData?.name)
      setValue('app_type', productData?.type || 'BUCHET')
      setValue('product_price', productData?.cost)
      setValue('product_price_with_discount', productData?.discountCost)
      setValue('description', productData?.description)
      setValue('shop', productData?.shop)
      setValue(
        'hashtag',
        productData?.hashtag?.map((el) => ({ value: el.nameRu, name: el.nameRu, id: el._id }))
      )
      setValue('preparation_time', {
        name: `${productData?.preparationTime} ${productData?.preparationTime === 0 ? 'express' : 'минут'}`,
        time: productData?.preparationTime,
      })
      setProductCategories(productData?.categories?.map((el, ind) => ({ ...el, name: el.nameRu, quantity: productData?.quantityOfCategories?.[ind] })))
      setHasDiscontPrice(productData?.isDiscount)
    }
  }, [productData])

  useEffect(() => {
    if (!!parentCategories?.data && !!productData) {
      const parentCategory = parentCategories?.data?.find((el) => el._id === productData?.categories?.[0]?.parentId)
      setParentCategory({ ...parentCategory, name: parentCategory.nameRu })
    }
  }, [parentCategories, productData])

  useEffect(() => {
    if (productCategories.length > 0) setValue('categories', productCategories)
  }, [productCategories])
  useEffect(() => {
    refetchrolesAndPermissionList()
    // refetchCategories()
  }, [appType])
  useEffect(() => {
    if (!productData) {
      setValue('app_type', 'BUCHET')
    }
  }, [])

  // const addCategoryButton = productCategories?.length > 0 ? !!productCategories?.at(-1)?.name : true
  const { refetch } = useQuery('barcode', () => requests.generateBarcode(), { enabled: false })

  const generateBarcode = () => {
    refetch().then(({ data }) => {
      clearErrors('barcode')
      setValue('barcode', data?.data?.barcode)
    })
  }

  const { mutate: createRole, isLoading: createRoleLoading } = useMutation(requests.createRole, {
    onSuccess: async ({ data }) => {
      success('Роль создана')
      navigate('/settings/roles')
    },
    onError: (err) => {
      error('Ошибка создания роли')
      console.log('err', err)
    },
  })
  const filterPermissions = (sections) => {
    const permissions = sections
      ?.map((section) => {
        const foundPermissions = section.permissions?.filter((permission) => permission?.entity_name?.toLowerCase()?.includes(searchTerm.toLowerCase()))
        return foundPermissions?.length ? { ...section, permissions: foundPermissions } : null
      })
      .filter((item) => item)
    return permissions
  }
  useEffect(() => {
    setPermissionList(get(rolesAndPermissionList, 'data.data', []))
    if (get(rolesAndPermissionList, 'data.data', [])) {
      // const keys = rolePermissions?.data?.sections?.map((el) => el.key)
      // setDisabled(keys)
      const permissions = []

      get(rolesAndPermissionList, 'data.data', [])
        ?.filter((section) => section.permissions?.length)
        ?.forEach((section) => {
          section?.permissions?.forEach((permission) => {
            if (permission?.is_active) {
              permissions.push(permission.id)
              return
            }
            permission.children.forEach((el) => {
              if (el.is_active) {
                permissions.push(el.id)
              }
            })
          })
        })
      setSelected(permissions)
    }
  }, [rolesAndPermissionList])
  useDidUpdate(() => {
    if (searchTerm === '') setPermissionList(get(rolesAndPermissionList, 'data.data', []) || [])
    else {
      const filteredPermissions = filterPermissions(get(rolesAndPermissionList, 'data.data', []))
      setPermissionList(filteredPermissions)
    }
  }, [searchTerm])

  const onSubmit = (data) => {
    // console.log('fff', data, get(rolesAndPermissionList, 'data.data', []))
    // console.log(section)

    const permissions = []
    get(rolesAndPermissionList, 'data.data', [])
      ?.filter((section) => section.permissions?.length && !disabled.includes(section.key))
      ?.forEach((section) => {
        section?.permissions?.forEach((permission) => {
          permissions.push({
            parent_id: permission?.id || '',
            children_ids: selected?.includes(permission?.id)
              ? [...new Set(permission.children.map((el) => el.id))]
              : [...new Set(selected.filter((el) => permission.children.find((child) => child.id === el)))] || [],
            is_active: !!selected?.includes(permission?.id),
          })
        })
      })

    const requestBody = {
      // id,
      name: get(data, 'name'),
      description: get(data, 'description'),
      // data: {
      permissions,
      // },
    }
    createRole(requestBody)
    // update(requestBody)
  }
  const onError = (err) => {
    console.log(err)
  }

  return (
    <FormProvider {...methods}>
      <form className={classes.form} id='role-create' onSubmit={methods.handleSubmit(onSubmit, onError)}>
        <Box
          pb={10}
          width='690px'
          sx={{
            margin: 'auto',
            '& .MuiInputBase-root': {
              border: '2px solid',
              borderColor: 'bunker.100',
            },
          }}
        >
          <SectionTitle noWrap withLine>
            {t('create_new_product.main_section.label')}
          </SectionTitle>
          <Box mt={'24px'}>
            <TextField
              required
              fullWidth
              borderRadius={'40px'}
              name='name'
              label={t('role.name')}
              placeholder={t('role.name.placeholder')}
              // sx={{ mb: '24px' }}
            />
            <Box height={'24px'} />
            <TextField
              required
              fullWidth
              multiline
              borderRadius={'16px'}
              name='description'
              label={t('role.description')}
              placeholder={t('role.description.placeholder')}
              sx={{ mb: 3 }}
            />
            <Box width='100%'>
              <Box mt={4} pb={4}>
                <Typography mb={'16px'} fontSize={'24px'} lineHeight={'32px'} fontWeight={'700'}>
                  {t('Системные разрешения')}
                </Typography>
                <InputSearch
                  name='search'
                  placeholder={'Поиск'}
                  fullWidth
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                  }}
                  value={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              </Box>
              <Box sx={{ borderRadius: '16px', padding: '16px', border: '2px solid', borderColor: 'bunker.100' }}>
                <SearchContext.Provider value={searchTerm}>
                  {permissionList.map((section, index) => (
                    <Section
                      selected={selected}
                      setSelected={setSelected}
                      disabled={disabled}
                      setDisabled={setDisabled}
                      sectionRef={sectionRefs[index]}
                      section={section}
                      id={items[index]?.id}
                      searchTerm={searchTerm}
                    />
                  ))}
                </SearchContext.Provider>
              </Box>
            </Box>
            {/* <ImageUpload
          id='images'
          name='images'
          images={productData?.files?.map((el, ind) => ({ key: el, name: el, sequence_number: ind }))}
          onChange={(imagesArr) => setValue('images', imagesArr)}
        /> */}
          </Box>
        </Box>
        <Box sx={{ width: 690, display: 'flex', justifyContent: 'end' }}>
          <Button sx={{ width: '137px', right: 0 }} onClick={methods.handleSubmit(onSubmit, onError)}>
            Qo'shish
          </Button>
        </Box>
      </form>
    </FormProvider>
  )
}
