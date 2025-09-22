const hasAccess = (id, user_data) => {
  const idsArray = id.split(' ')

  const has_access =
    idsArray.length === 1
      ? user_data?.role_actions?.some((item) => item.route === id)
      : idsArray.some((id) => user_data?.role_actions?.some((item) => item.route === id))
  if (user_data?.type === 'SUPERADMIN') {
    return true
  }
  console.log(user_data?.role_actions, id, has_access)

  return has_access ? true : false
}

export default hasAccess
