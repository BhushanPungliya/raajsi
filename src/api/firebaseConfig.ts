// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyBluYHBt5x2Z7sq59UPm9O5sE_k6rBwyCE",
  authDomain: "rajsi-592b6.firebaseapp.com",
  projectId: "rajsi-592b6",
  storageBucket: "rajsi-592b6.firebasestorage.app",
  messagingSenderId: "852259559900",
  appId: "1:852259559900:web:900267e760b0aec748d719",
  measurementId: "G-9DH6WXQSHF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);