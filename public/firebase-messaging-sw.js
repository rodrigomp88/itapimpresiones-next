importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCjUL-d5WPuuFpHy8PA6Fw8EMMxhY6nxzU",
  authDomain: "itap-shop.firebaseapp.com",
  projectId: "itap-shop",
  storageBucket: "itap-shop.appspot.com",
  messagingSenderId: "1032996797049",
  appId: "1:1032996797049:web:6fbba04368cced914272a8",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon-192x192.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
