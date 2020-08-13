import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyD8D_qI-_awQboFpDNkhKNwXlXKbAAhf9s",
    authDomain: "instagram-clone-220ea.firebaseapp.com",
    databaseURL: "https://instagram-clone-220ea.firebaseio.com",
    projectId: "instagram-clone-220ea",
    storageBucket: "instagram-clone-220ea.appspot.com",
    messagingSenderId: "105247917484",
    appId: "1:105247917484:web:ba6bd7e8bfebf1258c6609",
    measurementId: "G-1K1QPN0EQ8"  
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };

