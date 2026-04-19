const firebaseConfig = {
  apiKey: "AIzaSyBmL__lxlh1PYlkUBc5ye3MzE1OnUoJZLs",
  authDomain: "chara-manager7.firebaseapp.com",
  projectId: "chara-manager7",
  storageBucket: "chara-manager7.firebasestorage.app",
  messagingSenderId: "579471630525",
  appId: "1:579471630525:web:a2824a415807fa4d15d7d4"
};

// 初期化
firebase.initializeApp(firebaseConfig);

// Firestoreを使えるようにする
const db = firebase.firestore();