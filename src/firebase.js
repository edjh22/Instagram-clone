import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';


const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCr7E1KTrvdFa2gCEuRKDZZtfR-cPhQrNk",
    authDomain: "instagram-clone2-26b1e.firebaseapp.com",
    projectId: "instagram-clone2-26b1e",
    storageBucket: "instagram-clone2-26b1e.appspot.com",
    messagingSenderId: "938516538666",
    appId: "1:938516538666:web:50ccc825eb724ce53cea53"
});

const db = firebaseApp.firestore(); // Database
const auth = firebase.auth(); // Allows users to login
const storage = firebase.storage(); // Storage to upload pictures

export { db, auth, storage };
