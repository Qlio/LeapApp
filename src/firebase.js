import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDWlbaNb_XwI1KfEQU3hzJNUsLMQ_UL9LY",
    authDomain: "qr-payment-demo-6a1fe.firebaseapp.com",
    projectId: "qr-payment-demo-6a1fe",
    storageBucket: "qr-payment-demo-6a1fe.appspot.com",
    messagingSenderId: "50507273241",
    appId: "1:50507273241:web:0bc37ef9305082559f0688"
};

firebase.initializeApp(firebaseConfig);
export const firestore = firebase.firestore();
export default firebase;
