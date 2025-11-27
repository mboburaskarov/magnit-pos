import DashboardIcon from '../assets/icons/navbar/DashboardIcon'
import SettingIcon from '../assets/icons/navbar/SettingIcon'
import KatalogIcon from '../assets/icons/navbar/KatalogIcon'
import ClientsIcon from '../assets/icons/navbar/ClientsIcon'
import ReportIcon from '../assets/icons/navbar/ReportIcon'
import SaleIcon from '../assets/icons/navbar/SaleIcon'

export const navbatRouteData = [
  {
    label: 'navbar.dashboard',
    id: '2',
    icon: <DashboardIcon />,
    href: '/dashboard',
  },
  {
    label: 'navbar.catalog',
    id: '3',
    icon: <KatalogIcon />,
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
      {
        label: 'Товары с отказом',
        active: '/products/rejected-products/*',
        id: '3255',
        href: '/products/rejected-products',
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
    icon: <SaleIcon />,
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
    icon: <ClientsIcon />,
    href: '/clients',
    children: [
      {
        label: 'navbar.clients',
        active: '/clients/all*',
        id: '51',
        href: '/clients/all',
      },
      {
        label: 'Уровень лояльности',
        active: '/clients/loyalty-level/*',
        id: '52',
        href: '/clients/loyalty-level',
      },
    ],
  },

  {
    label: 'Отчеты',
    id: '9999',
    icon: <ReportIcon />,
    href: '/reports',
    children: [
      {
        label: 'Товары',
        active: '/reports/product/*',
        id: '91',
        href: '/reports/product',
      },
      {
        label: 'Aптека',
        active: '/reports/branch/*',
        id: '9189',
        href: '/reports/branch',
      },
      {
        label: 'Продавцы',
        active: '/reports/vendor/*',
        id: '911',
        // soon: true,
        href: '/reports/vendor',
      },
      {
        label: 'Клиенти',
        active: '/reports/client/*',
        id: '917',
        href: '/reports/client',
      },
    ],
  },
  {
    label: 'navbar.settings',
    id: '9',
    icon: <SettingIcon />,
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
        label: 'Компании',
        active: '/settings/companies/*',
        id: '91',
        href: '/settings/companies',
      },

      {
        label: 'navbar.vendors',
        id: '92',
        active: '/settings/employees/*',
        href: '/settings/employees',
      },
      {
        label: 'Филиалы',
        active: '/settings/branches/*',
        id: '93',
        href: '/settings/branches',
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
