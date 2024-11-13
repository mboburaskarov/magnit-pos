import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { notification as notificationToast } from '../utils/toast'

const vapidKey = 'BDsufieqdM1bZyJPAunAmAiycALgtpefn1s0gq37pudAuH6ivqxtSQJfm2GVKPtwoYdOJ4_TyJ13wLcFJIsRh88'
const firebaseConfig = {
  apiKey: 'AIzaSyBwt6d-fccQuMU6SrDQ7rE1NZJjkzN6yHY',
  authDomain: 'buchet-uz.firebaseapp.com',
  projectId: 'buchet-uz',
  storageBucket: 'buchet-uz.appspot.com',
  messagingSenderId: '843678942531',
  appId: '1:843678942531:web:50c791bf33c17b1e1b9bf6',
  measurementId: 'G-VMNF1PZP31',
}
const firebaseApp = initializeApp(firebaseConfig)
const messaging = getMessaging(firebaseApp)

export const fetchToken = (setTokenFound) => {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return setTokenFound('null')
  }

  return getToken(messaging, { vapidKey: vapidKey })
    .then((currentToken) => {
      if (currentToken) {
        console.log('current token for client: ', currentToken)
        setTokenFound(currentToken)
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        console.log('No registration token available. Request permission to generate one.')
        setTokenFound(null)
        // shows on the UI that permission is required
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err)
      // catch error while creating client token
    })
}

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) === false) {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      onMessage(messaging, (payload) => {
        console.log('permission test', permission, payload)
        new Notification(payload.notification.title, { body: payload.notification.body, icon: '../public/favicon.svg' })

        notificationToast(payload.notification.title, payload.notification.body)
      })
    } else {
      console.log('Do not have permission!')
    }
  })
}
