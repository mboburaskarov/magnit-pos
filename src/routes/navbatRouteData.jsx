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
        active: '/products/*',
        id: '3.1',
        href: '/products',
      },
      {
        label: 'navbar.import',
        active: '/products/import/*',
        id: '3.1',
        href: '/products/import',
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
        id: '5.2',
        href: '/sales/create',
      },
      {
        label: 'navbar.sales',
        active: '/sales*',
        id: '5.1',
        href: '/sales/all',
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
        label: 'Профиль',
        active: '/settings/profile/*',
        id: '9.1',
        href: '/settings/profile',
      },
      {
        label: 'navbar.vendors',
        id: '9.2',
        href: '/vendors/all',
      },
      {
        label: 'Филиалы',
        active: '/settings/stores/*',
        id: '9.3',
        href: '/settings/stores',
      },
      {
        label: 'Роли',
        active: '/settings/roles/*',
        id: '9.4',
        href: '/settings/roles',
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
