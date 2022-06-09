// NOTE - INCLUDE YOUR FIREBASE CONFIG HERE FOR ANYTHING TO WORK:

// git update-index --assume-unchanged public/firebaseInit.js
//git update-index --no-assume-unchanged public/firebaseInit.js

const firebaseConfig = {
    apiKey: "AIzaSyDtOWeZSNk1lu1B4gXdlZc6sFmm3Y0sLkA",
    authDomain: "ghostvallis-local.firebaseapp.com",
    projectId: "ghostvallis-local",
    storageBucket: "ghostvallis-local.appspot.com",
    messagingSenderId: "705571016036",
    appId: "1:705571016036:web:daf2f1d0758d5c7c6cbe71",
    measurementId: "G-KY4YZP1V7N",
    databaseURL: "https://ghostvallis-local-default-rtdb.firebaseio.com/"
}

firebase.initializeApp(firebaseConfig);