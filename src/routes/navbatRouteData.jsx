import ChartIcon from '../assets/icons/ChartIcon'
import MenuOutline from '../assets/icons/MenuOutline'
import ProductsIcon from '../assets/icons/ProductsIcon'
import QrScanIcon from '../assets/icons/QrScanIcon'
import SettingsIcon from '../assets/icons/SettingsIcon'
import UsersIcon from '../assets/icons/UsersIcon'
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
      {
        label: 'Инвентаризация',
        active: '/products/inventory/*',
        id: '32',
        href: '/products/inventory',
      },
      {
        label: 'Трансфер',
        active: '/products/transfer/*',
        id: '32',
        href: '/products/transfer',

        soon: true,
      },
      {
        label: 'Списание',
        active: '/products/write-off/*',
        id: '32',
        href: '/products/write-off',
        soon: true,
      },
      {
        label: 'Категории',
        active: '/products/categories/*',
        id: '327',
        href: '/products/categories',
      },
      {
        label: 'Бонусный продукт',
        active: '/products/bonus-product/*',
        id: '327',
        href: '/products/bonus-product',
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
        label: 'all_sales',
        active: '/sales/all-sales*',
        id: '52',
        href: '/sales/all-sales',
      },
      {
        label: 'navbar.cash_shifts',
        active: '/sales/cash-shifts*',
        id: '55',
        href: '/sales/cash-shifts',
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
    label: 'Отчеты',
    id: '333',
    icon: <ChartIcon />,
    href: '/',
    active: '/se/*',

    soon: true,
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
        label: 'Компания',
        active: '/settings/company/*',
        id: '91',
        href: '/settings/company',
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
