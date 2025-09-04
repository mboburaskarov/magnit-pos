import LayoutWithHeaderNavbar from '../../layouts/LayoutWithHeaderNavbar'
import SettingsPage from '../../pages/settings'

import CashBoxsPage from '../../pages/settings/cashbox'
import CompaniesPage from '../../pages/settings/companies/index'
import CompanyPage from '../../pages/settings/company'
import PaymentsAssetsList from '../../pages/settings/paymentsAssets/actions'
import Profile from '../../pages/settings/profile'
import RolesPage from '../../pages/settings/roles'
import ActionListPage from '../../pages/settings/roles/actions'
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
      path: 'company',
      element: <CompanyPage />,
    },
    {
      path: 'companies',
      element: <CompaniesPage />,
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
      path: 'payments-assets',
      element: <PaymentsAssetsList />,
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
