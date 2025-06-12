import MenuOutline from '../assets/icons/MenuOutline'
import ProductsIcon from '../assets/icons/ProductsIcon'
import QrScanIcon from '../assets/icons/QrScanIcon'
import RevenueIcon from '../assets/icons/RevenueIcon'
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
        label: 'Перемещение',
        active: '/products/transfer/*',
        id: '32',
        href: '/products/transfer',
      },
      {
        label: 'Переоценка',
        active: '/products/revaluation/*',
        id: '3255',
        href: '/products/revaluation',
      },
      {
        label: 'Возврат на склад',
        active: '/products/return-to-warehouse/*',
        id: '32',
        href: '/products/return-to-warehouse',
      },
      {
        label: 'Списание',
        active: '/products/write-off/*',
        id: '32',
        href: '/products/write-off',
      },

      // {
      //   label: 'Бонусный продукт',
      //   active: '/products/bonus-product/*',
      //   id: '327',
      //   href: '/products/bonus-product',
      // },
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
    href: '/clients',
    children: [
      {
        label: 'navbar.clients',
        active: '/clients/all*',
        id: '912221',
        href: '/clients/all',
      },
      {
        label: 'Дисконтная карта',
        active: '/clients/discount-cards/*',
        id: '91122',
        soon: true,

        href: '/clients/discount-cards',
      },
    ],
  },

  {
    label: 'Отчеты',
    id: '9999',
    icon: <RevenueIcon />,
    href: '/reports',
    children: [
      {
        label: 'Oтчет LFL',
        active: '/reports/lfl/*',
        id: '91',
        soon: true,
        href: '/reports/lfl',
      },
      {
        label: 'Отчет о бонусах',
        active: '/reports/seller-bonus/*',
        id: '911',
        // soon: true,
        href: '/reports/seller-bonus',
      },
      {
        label: 'Отчет о продукте',
        active: '/reports/product-report/*',
        id: '91',
        href: '/reports/product-report',
      },
      {
        label: 'Отчет филиала',
        active: '/reports/store-report/*',
        id: '91',
        href: '/reports/store-report',
      },
    ],
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
