export const clearAuthSession = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user_data')
}

