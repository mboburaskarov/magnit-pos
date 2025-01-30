import CourierIcon from '../assets/icons/CourierIcon'
import FinanceIcon from '../assets/icons/FInanceIcon'
import MarketingIcon from '../assets/icons/MarketingIcon'
import MenuOutline from '../assets/icons/MenuOutline'
import OrdersIcon from '../assets/icons/OrdersIcon'
import ProductsIcon from '../assets/icons/ProductsIcon'
import ReportsIcon from '../assets/icons/ReportsIcon'
import SettingsIcon from '../assets/icons/SettingsIcon'
import UserOutlineIcon from '../assets/icons/UserOutlineIcon'
import UsersIcon from '../assets/icons/UsersIcon'
import QrScanIcon from '../assets/icons/QrScanIcon'

export const navbatRouteData = [
  {
    label: 'navbar.dashboard',
    id: '2',
    icon: <MenuOutline />,
    href: '/dashboard',
  },
  {
    label: 'navbar.catalog',
    id: '3',
    icon: <ProductsIcon />,
    href: '/products',
    children: [
      {
        label: 'navbar.products',
        active: '/products*',
        id: '31',
        href: '/products/all',
      },
      {
        label: 'navbar.import',
        active: '/products/import/*',
        id: '32',
        href: '/products/import',
      },
      {
        label: 'Авто заказ',
        active: '/products/auto-order/*',
        id: '32',
        href: '/products/auto-order',
      },
    ],
  },
  {
    label: 'navbar.sales',
    id: '5',
    icon: <QrScanIcon />,
    href: '/sales',
    children: [
      {
        label: 'navbar.new.sales',
        active: '/sales/create*',
        id: '51',
        href: '/sales/create',
      },
      {
        label: 'Все продажи',
        active: '/sales*',
        id: '52',
        href: '/sales/all',
      },
    ],
  },
  {
    label: 'navbar.clients',
    id: '1',
    icon: <UsersIcon />,
    href: '/clients/all',
  },

  {
    label: 'navbar.settings',
    id: '9',
    icon: <SettingsIcon />,
    href: '/settings',
    children: [
      {
        label: 'Профиль',
        active: '/settings/profile/*',
        id: '91',
        href: '/settings/profile',
      },
      {
        label: 'navbar.vendors',
        id: '92',
        active: '/settings/vendors/*',
        href: '/settings/vendors',
      },
      {
        label: 'Филиалы',
        active: '/settings/stores/*',
        id: '93',
        href: '/settings/stores',
      },
      {
        label: 'Роли',
        active: '/settings/roles/*',
        id: '94',
        href: '/settings/roles',
      },
      {
        label: 'Кассы',
        active: '/settings/cashbox/*',
        id: '94',
        href: '/settings/cashbox',
      },
    ],
  },
]
