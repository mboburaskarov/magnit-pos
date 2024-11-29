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
import VendorsIcon from '../assets/icons/VendorsIcon'

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
        active: '/products/*',
        id: '3.1',
        href: '/products',
      },
    ],
  },
  {
    label: 'navbar.sales',
    id: '5',
    icon: <OrdersIcon />,
    href: '/sales',
    children: [
      {
        label: 'navbar.sales',
        active: '/sales*',
        id: '5.1',
        href: '/sales/all',
      },
      {
        label: 'navbar.new.sales',
        active: '/sales/create*',
        id: '5.2',
        href: '/sales/create',
      },
    ],
  },
  {
    label: 'navbar.clients',
    id: '1',
    icon: <UsersIcon />,
    href: '/clients/all/',
    children: [
      {
        label: 'navbar.clients',
        active: '/clients/all/*',
        id: '1.1',
        href: '/clients/all',
      },
    ],
  },
  {
    label: 'navbar.vendors',
    id: '1',
    icon: <UserOutlineIcon />,
    href: '/vendors',
    children: [
      {
        label: 'navbar.vendors',
        active: '/vendors/all/*',
        id: '1.1',
        href: '/vendors/all',
      },
    ],
  },
  {
    label: 'navbar.payments',
    id: '1',
    icon: <FinanceIcon />,
    href: '/reports',
    children: [
      {
        label: 'navbar.payments',
        active: '/reports/main/*',
        id: '1.1',
        href: '/reports/main',
      },
    ],
  },
  // {
  //   label: 'Маркетинг',
  //   id: '10',
  //   icon: <MarketingIcon />,
  //   href: '/marketing',
  //   children: [
  //     {
  //       label: 'Уведомления',
  //       active: '/marketing/*',
  //       id: '10.1',
  //       href: '/marketing/notifications',
  //     },
  //   ],
  // },

  // {
  //   label: 'Отчеты',
  //   id: '8',
  //   icon: <ReportsIcon />,
  //   href: '/reports',
  //   children: [
  //     {
  //       label: 'Отчет клиентов',
  //       active: '/reports/main/*',
  //       id: '8.1',
  //       href: '/reports/main',
  //     },
  //     {
  //       label: 'Отчет о доставке',
  //       active: '/reports/delivery/*',
  //       id: '8.4',
  //       href: '/reports/delivery',
  //     },
  //     {
  //       label: 'Отчет трафика',
  //       active: '/reports/trafic/*',
  //       id: '8.3',
  //       href: '/reports/trafic',
  //     },
  //     {
  //       label: 'Отчет о приложении',
  //       active: '/reports/app/*',
  //       id: '8.5',
  //       href: '/reports/app',
  //     },

  //     {
  //       label: 'Бухгалтерский отчет',
  //       active: '/reports/accounting/*',
  //       id: '8.2',
  //       href: '/reports/accounting',
  //     },
  //     {
  //       label: 'Отчет транзакции',
  //       active: '/reports/transactions/*',
  //       id: '8.3',
  //       href: '/reports/transactions',
  //     },
  //   ],
  // },
  {
    label: 'navbar.settings',
    id: '9',
    icon: <SettingsIcon />,
    href: '/settings',
    children: [
      {
        label: 'navbar.settings',
        active: '/settings/users/*',
        id: '9.5',
        href: '/settings/users',
      },
    ],
  },
  // {
  //   label: 'Курьеры',
  //   id: '11',
  //   icon: <CourierIcon />,
  //   href: '/couriers',
  // },
]
