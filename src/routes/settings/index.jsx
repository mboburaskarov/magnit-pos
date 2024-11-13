import LayoutWithNavbar from '../../layouts/LayoutWithNavbar'
import SettingsPage from '../../pages/settings'
import BannersPage from '../../pages/settings/banners'
import CategoriesPage from '../../pages/settings/categories'
import HashtagsPage from '../../pages/settings/hashtags'
import RegionsPage from '../../pages/settings/regions'
import RolesPage from '../../pages/settings/roles'
import UsersPage from '../../pages/settings/users'

const settingsRoutes = {
  path: 'settings',
  element: <LayoutWithNavbar />,
  children: [
    {
      path: '',
      element: <SettingsPage />,
    },
    {
      path: 'banners',
      element: <BannersPage />,
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
  ],
}

export default settingsRoutes
