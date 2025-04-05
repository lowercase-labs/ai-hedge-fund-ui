// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAz4paoPHpAZWaAUKaakQFf8KRW7m_tQjo",
  authDomain: "quant-ai-agent.firebaseapp.com",
  projectId: "quant-ai-agent",
  storageBucket: "quant-ai-agent.firebasestorage.app",
  messagingSenderId: "127312197691",
  appId: "1:127312197691:web:633156d43979007487041e",
  measurementId: "G-WWVHEQS8HC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Debug Firestore initialization
console.log('Firestore initialized with config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

// Add auth state change listener for debugging
auth.onAuthStateChanged((user) => {
  console.log('Auth state changed:', {
    isAuthenticated: !!user,
    userId: user?.uid,
    email: user?.email
  });
});