// firebaseConfig.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; // 👈 Required for authentication
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB3Ln7XYJWDSbDjY1__71T5zc0EG8e0eL0",
  authDomain: "eye-specialist-main.firebaseapp.com",
  projectId: "eye-specialist-main",
  storageBucket: "eye-specialist-main.appspot.com",
  messagingSenderId: "892280012335",
  appId: "1:892280012335:web:2c9680c4d3380eabbd50da",
  measurementId: "G-V2FH4GX7ZP"
};

// ✅ Only initialize Firebase once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const db = firebase.firestore();