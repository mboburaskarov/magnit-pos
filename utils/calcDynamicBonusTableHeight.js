export const getDynamicBonusTableHeight = (user_data, hasClient) => {
  const my_actions = user_data?.role_actions?.filter((role) => role?.type == 'ACTION')
  let count = 6
  const userCount = !hasClient ? 115 : 0
  if (user_data?.type == 'SUPERADMIN') return userCount
  const valid_actions = ['product-reject', 'can-open-new-window', 'draft-and-pending-sales', 'can-return-product', 'can-disable-epos-cheque', 'noor-order']
  my_actions.map((action) => {
    if (valid_actions.includes(action.route)) {
      count -= 1
    }
  })

  return count * 45 + userCount
}
