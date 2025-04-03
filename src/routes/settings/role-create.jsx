import MainLayout from '../../layouts/MainLayout'
import ProductCreatePage from '../../pages/products/product-create'
import ProductEditPage from '../../pages/products/product-edit'
import RoleCreatePage from '../../pages/settings/roles/createRole'
import RoleEditPage from '../../pages/settings/roles/editRole'

const rolesCreateRoutes = {
  path: 'roles',
  element: <MainLayout />,
  children: [
    {
      path: 'create',
      element: <RoleCreatePage />,
    },
    {
      path: 'edit/:id',
      children: [{ path: '', element: <RoleEditPage /> }],
    },
  ],
}

export default rolesCreateRoutes
