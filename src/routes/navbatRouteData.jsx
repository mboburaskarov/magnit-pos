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
    label: 'Asosiy',
    id: '2',
    icon: <MenuOutline fill='red' stroke='red' color='red' />,
    href: '/shops',
    children: [
      {
        label: 'Все магазины',
        active: '/shops/*',
        id: '2.1',
        href: '/shops',
      },
      {
        label: 'Вендоры',
        active: '/shops/vendors/*',
        id: '2.2',
        href: '/shops/vendors',
      },
    ],
  },
  {
    label: 'Katalog',
    id: '3',
    icon: <ProductsIcon />,
    href: '/products',
    children: [
      {
        label: 'Barcha tavarlar',
        active: '/products/*',
        id: '3.1',
        href: '/products',
      },
      {
        label: 'Отзывы продуктов',
        active: '/products/reviews/*',
        id: '3.2',
        href: '/products/reviews',
      },
    ],
  },
  {
    label: 'Sotuv',
    id: '5',
    icon: <OrdersIcon />,
    href: '/orders',
    children: [
      {
        label: 'Barcha sotuvlar',
        active: '/orders*',
        id: '5.1',
        href: '/orders/all',
      },
      {
        label: 'QR продажа',
        active: '/orders/qr-sale/*',
        id: '5.2',
        href: '/orders/qr-sale',
      },
      {
        label: 'Транзакции',
        active: '/orders/order-transactions/*',
        id: '5.2',
        href: '/orders/order-transactions',
      },
    ],
  },
  {
    label: 'Mijozlar',
    id: '1',
    icon: <UsersIcon />,
    href: '/users',
    children: [
      {
        label: 'Все клиенты',
        active: '/clients/all/*',
        id: '1.1',
        href: '/clients/all',
      },
    ],
  },
  {
    label: 'Sotuvchilar',
    id: '1',
    icon: <UserOutlineIcon />,
    href: '/users',
    children: [
      {
        label: 'Все клиенты',
        active: '/clients/all/*',
        id: '1.1',
        href: '/clients/all',
      },
    ],
  },
  {
    label: "To'lovlar",
    id: '1',
    icon: <FinanceIcon />,
    href: '/users',
    children: [
      {
        label: 'Все клиенты',
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
    label: 'Sozlamalar',
    id: '9',
    icon: <SettingsIcon />,
    href: '/settings',
    children: [
      {
        label: 'Баннеры',
        active: '/settings/banners/*',
        id: '9.1',
        href: '/settings/banners',
      },

      {
        label: 'Категории',
        active: '/settings/categories/*',
        id: '9.2',
        href: '/settings/categories',
      },
      {
        label: 'Роли',
        active: '/settings/roles/*',
        id: '9.3',
        href: '/settings/roles',
      },
      {
        label: 'Хэштеги',
        active: '/settings/hashtags/*',
        id: '9.4',
        href: '/settings/hashtags',
      },
      {
        label: 'Пользователи',
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
