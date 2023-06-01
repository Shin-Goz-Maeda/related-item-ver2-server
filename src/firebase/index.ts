// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { GoogleAuthProvider, getAuth } = require("firebase/auth");

type FirebaseType = {
  apiKey: string | undefined;
  authDomain: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
};

const firebaseConfig: FirebaseType = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BACKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

module.exports.auth = getAuth(firebaseApp);

module.exports.googleProvider = new GoogleAuthProvider();
