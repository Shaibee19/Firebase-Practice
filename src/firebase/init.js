// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBax4h9QGcLz04-OFh6PnitDCWw6PuNhh8",
  authDomain: "fir-practice-63e10.firebaseapp.com",
  projectId: "fir-practice-63e10",
  storageBucket: "fir-practice-63e10.firebasestorage.app",
  messagingSenderId: "766301038961",
  appId: "1:766301038961:web:fade31cd501417cc43aed0",
  measurementId: "G-QW3K8ZBY60"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();