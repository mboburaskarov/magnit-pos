import { Box, Typography } from '@mui/material'
import { createContext, useEffect, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import InputSearch from '../../../../components/Inputs/InputSearch'
import TextField from '../../../../components/Inputs/TextField'
import SectionTitle from '../../../../components/SectionTitle'
import { requests } from '../../../../utils/requests'
import Section from './Section'

import { makeStyles } from '@mui/styles'
import { get } from 'lodash'
import CartOutlineIcon from '../../../assets/icons/CartOutline'
import FinanceIcon from '../../../assets/icons/FInanceIcon'
import MenuOutline from '../../../assets/icons/MenuOutline'
import ProductsIcon from '../../../assets/icons/ProductsIcon'
import QrScanIcon from '../../../assets/icons/QrScanIcon'
import UserOutlineIcon from '../../../assets/icons/UserOutlineIcon'
import UsersIcon from '../../../assets/icons/UsersIcon'
import useDidUpdate from '../../../hooks/useDidUpdate'
import ActionCreateBody from './ActionCreateBody'

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
export default function RoleBody({ productData = null, disabled, setSelected, selected, setDisabled, roleData }) {
  const { setValue, watch } = useFormContext()
  const [productCategories, setProductCategories] = useState([{}])
  const [childrens, setChildrens] = useState([])
  useEffect(() => {
    setValue('name', get(roleData, 'name'))
    setValue('description', get(roleData, 'description'))
  }, [roleData])
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

  const [searchTerm, setSearchTerm] = useState('')
  const [permissionList, setPermissionList] = useState([])
  console.log(get(roleData, 'id'))

  const { t } = useTranslation()
  const appType = watch('app_type') || 'Pharma'
  const { data: rolesAndPermissionList, refetch: refetchrolesAndPermissionList } = useQuery(['rolesAndPermissionList', roleData], () =>
    requests.getAllRolesWithPermissions({ role_id: get(roleData, 'id'), limit: 20, offset: 0, type: appType })
  )
  const { data: parentCategories } = useQuery('parentCategories', () => requests.getAllCategories())

  useEffect(() => {
    if (productData) {
      setValue('product_name', productData?.name)
      setValue('app_type', productData?.type || 'Pharma')
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

  return (
    <>
      <Box
        pb={10}
        width='100%'
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
        </Box>
      </Box>
    </>
  )
}
