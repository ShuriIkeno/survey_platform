// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbIBXiHcLOOjl36A_iDL9ns4oy9ZnAgIY",
  authDomain: "survey-platform-81252.firebaseapp.com",
  databaseURL: "https://survey-platform-81252-default-rtdb.firebaseio.com",
  projectId: "survey-platform-81252",
  storageBucket: "survey-platform-81252.firebasestorage.app",
  messagingSenderId: "536420061003",
  appId: "1:536420061003:web:1ad2aad0d60fbf988062ce",
  measurementId: "G-30W7PMNE60"
};

// Firebaseアプリの初期化
const app = initializeApp(firebaseConfig);

// 各サービスの取得
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);