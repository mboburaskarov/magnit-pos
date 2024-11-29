import mixpanel from 'mixpanel-browser'

const mixpanelTrack = (eventName, properties = {}) => {
  mixpanel.track(eventName, properties)
}
export default mixpanelTrack
