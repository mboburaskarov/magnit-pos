import LoginPage from '../../pages/login'

const authRoutes = {
  path: 'login',
  children: [
    {
      path: '',
      element: <LoginPage />,
    },
  ],
}

export default authRoutes
