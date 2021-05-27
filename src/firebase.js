import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCVIjQWzKXWD9eGIiwjYjv3jYn476xS6OA",
    authDomain: "leaply-2863c.firebaseapp.com",
    projectId: "leaply-2863c",
    storageBucket: "leaply-2863c.appspot.com",
    messagingSenderId: "945384938342",
    appId: "1:945384938342:web:e5179d6caef8cadceb86a7",
};

firebase.initializeApp(firebaseConfig);
export const firestore = firebase.firestore();
export default firebase;
