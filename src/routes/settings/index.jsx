import LayoutWithNavbar from '../../layouts/LayoutWithNavbar'
import SettingsPage from '../../pages/settings'
import BannersPage from '../../pages/settings/banners'
import LayoutWithHeaderNavbar from '../../layouts/LayoutWithHeaderNavbar'

import CategoriesPage from '../../pages/settings/categories'
import HashtagsPage from '../../pages/settings/hashtags'
import Profile from '../../pages/settings/profile'
import RegionsPage from '../../pages/settings/regions'
import RolesPage from '../../pages/settings/roles'
import UsersPage from '../../pages/settings/users'
import StoresPage from '../../pages/settings/stores'
import VendorsPage from '../../pages/settings/vendors'

const settingsRoutes = {
  path: 'settings',
  element: <LayoutWithHeaderNavbar />,

  children: [
    {
      path: '',
      element: <SettingsPage />,
    },
    {
      path: 'profile',
      element: <Profile />,
    },
    {
      path: 'stores',
      element: <StoresPage />,
    },
    {
      path: 'roles',
      element: <RolesPage />,
    },
    {
      path: 'regions',
      element: <RegionsPage />,
    },
    {
      path: 'categories',
      element: <CategoriesPage />,
    },
    {
      path: 'hashtags',
      element: <HashtagsPage />,
    },
    { path: 'users', element: <UsersPage /> },
    {
      path: 'vendors',
      element: <VendorsPage />,
    },
  ],
}

export default settingsRoutes
