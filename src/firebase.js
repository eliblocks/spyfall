import firebase from 'firebase'
const firebaseConfig = {
  apiKey: "AIzaSyDX7y4z2f5L48NJYuJ3J7fJiC7NRZdMKOE",
  authDomain: "spyfall-eli.firebaseapp.com",
  databaseURL: "https://spyfall-eli.firebaseio.com",
  projectId: "spyfall-eli",
  storageBucket: "",
  messagingSenderId: "190347570321",
  appId: "1:190347570321:web:fab3edaace83f9e2406330"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database()
export default database