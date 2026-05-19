import { lazy } from 'react'

// Lazily loaded MagnitGo pages
export const BannersPage = lazy(() => import('../../pages/magnit/banners/BannersPage'))
export const CategoriesPage = lazy(() => import('../../pages/magnit/categories/CategoriesPage'))
export const BrandsPage = lazy(() => import('../../pages/magnit/brands/BrandsPage'))
export const HomeSectionsPage = lazy(() => import('../../pages/magnit/home-sections/HomeSectionsPage'))
export const NotificationsPage = lazy(() => import('../../pages/magnit/notifications/NotificationsPage'))
export const ChatPage = lazy(() => import('../../pages/magnit/chat/ChatPage'))

// Route definitions — consumed in the main Routes.jsx
export const magnitRoutes = {
  layout: () => import('../../layouts/MagnitLayout'),
  basePath: '/magnit',
  children: [
    { path: '/magnit/chat', component: 'ChatPage' },
    { path: '/magnit/app/banners', component: 'BannersPage' },
    { path: '/magnit/app/home-sections', component: 'HomeSectionsPage' },
    { path: '/magnit/app/notifications', component: 'NotificationsPage' },
    { path: '/magnit/catalog/brands', component: 'BrandsPage' },
    { path: '/magnit/catalog/categories', component: 'CategoriesPage' },
  ],
}
