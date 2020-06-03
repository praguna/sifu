import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBUvTmiE-_bK--bvSh1WdPS1lhucv-DIq8",
    authDomain: "sifu-fce3f.firebaseapp.com",
    databaseURL: "https://sifu-fce3f.firebaseio.com",
    projectId: "sifu-fce3f",
    storageBucket: "sifu-fce3f.appspot.com",
    messagingSenderId: "209362901890",
    appId: "1:209362901890:web:c6fce31974bae28316cd9b",
    measurementId: "G-F40R7P1CEF"
  };
  // Initialize Firebase
  const Firebase = firebase.initializeApp(firebaseConfig);
//   firebase.analytics();

export default Firebase;