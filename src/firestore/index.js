import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB7JQf8rlIobzAKrMJlcwKNhD-Z_1s_zf0",
  authDomain: "firestore-react-9810b.firebaseapp.com",
  projectId: "firestore-react-9810b",
  storageBucket: "firestore-react-9810b.appspot.com",
  messagingSenderId: "423203516846",
  appId: "1:423203516846:web:0c7888e9882fc92c40183f",
};

const firebaseApp = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export async function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  await auth.signInWithPopup(provider);
  window.location.reload();
}

export function checkAuth(callback) {
  auth.onAuthStateChanged(callback);
}
