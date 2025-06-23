export const checkPermission = (id, user_data) => {
  const idsArray = id.split(' ')

  const hasAccess =
    idsArray.length === 1
      ? user_data?.role_actions?.some((item) => item.route === id)
      : idsArray.some((id) => user_data?.role_actions?.some((item) => item.route === id))
  if (user_data?.type === 'SUPERADMIN') {
    return true
  }
  return hasAccess ? true : false
}
