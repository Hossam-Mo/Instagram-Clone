import firebase from "firebase";
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBcqYmy6cI2nANp8t2IIYDcqKTMbrErSRA",
  authDomain: "bigboom-insta.firebaseapp.com",
  databaseURL: "https://bigboom-insta.firebaseio.com",
  projectId: "bigboom-insta",
  storageBucket: "bigboom-insta.appspot.com",
  messagingSenderId: "641788329859",
  appId: "1:641788329859:web:48b5d9abca1587e66a00b6",
  measurementId: "G-SJPS06RNZC",
});
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
