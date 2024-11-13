import MainLayout from '../../layouts/MainLayout'
import NotificationCreatePage from '../../pages/marketing/notifications/notification-create'

const notificationsCreateRoutes = {
  path: 'marketing/notifications',
  element: <MainLayout />,
  children: [
    {
      path: 'create',
      element: <NotificationCreatePage />,
    },
  ],
}

export default notificationsCreateRoutes
