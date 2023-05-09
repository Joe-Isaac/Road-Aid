import { initializeApp } from 'firebase/app';
import { getAuth,  } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
    apiKey: "AIzaSyCVBaqlxojQCJpk6k8mWR-HKN10uisdNZw",
    authDomain: "sarah-s-app.firebaseapp.com",
    projectId: "sarah-s-app",
    storageBucket: "sarah-s-app.appspot.com",
    messagingSenderId: "896997316935",
    appId: "1:896997316935:web:f19640409834ecb6779462",
    measurementId: "G-RD303SGWTM"
}
// const firebaseConfig = {
//     apiKey: "AIzaSyACydB_5ChZTEUYTDjlWdbAWNdnrAJsjso",
//     authDomain: "road-aid-app-d43a0.firebaseapp.com",
//     projectId: "road-aid-app-d43a0",
//     storageBucket: "road-aid-app-d43a0.appspot.com",
//     messagingSenderId: "842100689700",
//     appId: "1:842100689700:web:6be9287abd3933cc2141b1"
//   };


const app = initializeApp(firebaseConfig);

export const authentication = getAuth(app);

export const db = getFirestore(app);