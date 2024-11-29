import mixpanelTrack from './mixpanelTrack'

const event = (eventName, properties = {}, shouldSendToken) => {
  if (import.meta.env.VITE_APP_ENVIRONMENT === 'prod') {
    const access_token = localStorage.getItem('access_token')
    // ymEvent(eventName, {
    //   ...properties,
    //   ...(access_token && shouldSendToken && { token: access_token }),
    // })
    mixpanelTrack(eventName, {
      ...properties,
      ...(access_token && shouldSendToken && { token: access_token }),
    })
  }
}
export default event
