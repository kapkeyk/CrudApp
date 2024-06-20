// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5AessBBCuRMQqK4c_LKvvCVZV6-eH15A",
  authDomain: "crud-app-by-kap-b8daa.firebaseapp.com",
  databaseURL: "https://crud-app-by-kap-b8daa-default-rtdb.firebaseio.com",
  projectId: "crud-app-by-kap-b8daa",
  storageBucket: "crud-app-by-kap-b8daa.appspot.com",
  messagingSenderId: "332408245265",
  appId: "1:332408245265:web:c1f9a1b81f150b076775b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);