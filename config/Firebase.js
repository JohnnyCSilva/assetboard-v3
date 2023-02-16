import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, FacebookAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore,useState } from "firebase/firestore";

import { useAuthValue } from '../config/AuthContext'
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";



const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

const {currentUser} = useAuthValue();


export const google = new GoogleAuthProvider();
export const facebook = new FacebookAuthProvider();

export const googleSignIn = () => {

  signInWithPopup(auth, google).catch((error) => { 

   });
   importUser(auth.currentUser);
}
export const facebookSignIn = () => {

  signInWithPopup(auth, facebook).catch((error) => {
      importUser(auth.currentUser);
    });


}


export const createUser = (email, password, displayName) => {
  alert(displayName);
   if (displayName === '' || password === '' || email === '') {
     alert('Preencha todos os campos');
     return;
   } else if (password.length < 6) {
     alert('A password tem de ter pelo menos 6 caracteres');
     return;
   } else {
      createUserWithEmailAndPassword(auth, email, password)
      
        .catch((error) => {
          alert(error.message); 
          // ..
        });
      
        //call function to import user into firestore database
        importUser(auth.currentUser);

    }

};

 
export const signIn = (email, password) => {

   signInWithEmailAndPassword(auth, email, password)
     .then((userCredential) => {
       // Signed in
       const user = userCredential.user;
       // ...
     })
     .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
     });

     
}

// funcion to import user into firestore database if not already there
const importUser = (user) => {

  
  const userRef = collection(db, "users");
  const q = query(userRef, where("email", "==", user.email));
  const querySnapshot = getDocs(q);
  querySnapshot.then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
      });
  });
  if (querySnapshot === null) {
    addDoc(userRef, {
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      role: 'user',
      uid: user.uid
    });
  }
}


