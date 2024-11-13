/* eslint-disable no-undef */
// Scripts for firebase and firebase messaging
if ('function' === typeof importScripts) {
  importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
  importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')
}
// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: 'AIzaSyBwt6d-fccQuMU6SrDQ7rE1NZJjkzN6yHY',
  authDomain: 'buchet-uz.firebaseapp.com',
  projectId: 'buchet-uz',
  storageBucket: 'buchet-uz.appspot.com',
  messagingSenderId: '843678942531',
  appId: '1:843678942531:web:50c791bf33c17b1e1b9bf6',
  measurementId: 'G-VMNF1PZP31',
}

if (!firebase.apps.length) {
  try {
    firebase.initializeApp(firebaseConfig)
  } catch (e) {
    console.log('sw error', e)
  }
}

// Retrieve firebase messaging
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload)

  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.svg',
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
