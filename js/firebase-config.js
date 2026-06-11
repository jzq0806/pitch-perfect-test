// Firebase 配置和初始化
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, addDoc, updateDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';

// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyC2n-Wbjt5neShYkA0WdAszB5C1GFvVrNw",
  authDomain: "pitch-perfect-test.firebaseapp.com",
  projectId: "pitch-perfect-test",
  storageBucket: "pitch-perfect-test.firebasestorage.app",
  messagingSenderId: "271590294070",
  appId: "1:271590294070:web:8335856c4be9fdfba5ce97",
  measurementId: "G-ZF01HT023L"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// 导出实例
export { auth, db, analytics, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, doc, setDoc, getDoc, collection, query, where, getDocs, addDoc, updateDoc, serverTimestamp };
