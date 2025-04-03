import { useSelector } from 'react-redux'

const CheckAccess = ({ id, children }) => {
  const user_data = useSelector((state) => state.user)
  const idsArray = id.split(' ')

  const hasAccess =
    idsArray.length === 1
      ? user_data?.role_actions?.some((item) => item.route === id)
      : idsArray.some((id) => user_data?.role_actions?.some((item) => item.route === id))
  if (user_data?.type === 'SUPERADMIN') {
    return children
  }
  return hasAccess ? children : <></>
}

export default CheckAccess
