import LayoutWithNavbar from '../../layouts/LayoutWithNavbar';
import ClientsPage from '../../pages/clients';


const userRoutes = {
  path: 'clients',
  element: <LayoutWithNavbar />,
  children: [
    {
      path: 'all',
      element: <ClientsPage />,
    },
  ],
}

export default userRoutes
