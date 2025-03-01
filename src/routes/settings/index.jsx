import LayoutWithHeaderNavbar from '../../layouts/LayoutWithHeaderNavbar'
import SettingsPage from '../../pages/settings'

import Profile from '../../pages/settings/profile'
import RolesPage from '../../pages/settings/roles'
import StoresPage from '../../pages/settings/stores'
import VendorsPage from '../../pages/settings/vendors'
import CashBoxsPage from '../../pages/settings/cashbox'
import ActionListPage from '../../pages/settings/roles/actions'
import CompanyPage from '../../pages/settings/company'

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
      path: 'company',
      element: <CompanyPage />,
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
      path: 'actions',
      element: <ActionListPage />,
    },

    {
      path: 'vendors',
      element: <VendorsPage />,
    },
    {
      path: 'cashbox',
      element: <CashBoxsPage />,
    },
  ],
}

export default settingsRoutes
