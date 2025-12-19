import LayoutWithHeaderNavbar from '../../layouts/LayoutWithHeaderNavbar'
import SettingsPage from '../../pages/settings'

import PermissionsManager from '@/pages/settings/new-permission-v2'
import StoresPage from '../../pages/settings/branches'
import CashBoxsPage from '../../pages/settings/cashbox'
import CompaniesPage from '../../pages/settings/companies/index'
import CompanyPage from '../../pages/settings/company'
import EmployeesPage from '../../pages/settings/employees'
import PaymentsAssetsList from '../../pages/settings/paymentsAssets/actions'
import Profile from '../../pages/settings/profile'
import RolesPage from '../../pages/settings/roles'
import ActionListPage from '../../pages/settings/roles/actions'
import ActivityLogsPage from '@/pages/settings/logs/ActivityLogs'

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

    { path: 'new-permission-v2', element: <PermissionsManager /> },
    {
      path: 'company',
      element: <CompanyPage />,
    },
    {
      path: 'activity-logs',
      element: <ActivityLogsPage />,
    },
    {
      path: 'companies',
      element: <CompaniesPage />,
    },
    {
      path: 'branches',
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
      path: 'employees',
      element: <EmployeesPage />,
    },
    {
      path: 'cashbox',
      element: <CashBoxsPage />,
    },
  ],
}

export default settingsRoutes
