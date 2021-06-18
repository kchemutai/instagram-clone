
import firebase from 'firebase'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBqSYTxZD36FlENDdjdLXzTsYy86sTw5R8",
    authDomain: "instagram-clone-644d1.firebaseapp.com",
    projectId: "instagram-clone-644d1",
    storageBucket: "instagram-clone-644d1.appspot.com",
    messagingSenderId: "177123925378",
    appId: "1:177123925378:web:ae67914082a1d0ba23c39b",
    measurementId: "G-1G542NVZ37"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)
const db = firebaseApp.firestore()
const auth = firebaseApp.auth()
const storage = firebase.storage()

export { db, auth, storage };