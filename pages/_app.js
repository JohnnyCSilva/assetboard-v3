import '@/styles/global.css'
import '@/styles/navigation.css'
import '@/styles/signUp.css'

import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css"; 
import "primereact/resources/themes/lara-light-indigo/theme.css";

import Sidebar  from '../components/sideBar.js';
import Navbar from '../components/navBar.js';
import SignUp from '@/components/signUp.js';

import { AuthProvider } from '../config/AuthContext'
import { useState, useEffect} from 'react'
import { auth, db } from '../config/Firebase'
import { onAuthStateChanged } from 'firebase/auth'

import { addDoc, collection, query, where } from "firebase/firestore";


 function App({ Component, pageProps }) {

  const [currentUser, setCurrentUser] = useState()

  useEffect(() => {
    
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      console.log(1)
      
      if (!user == ""){

        //const getUserFromDB = query(collection(db, "users", where ("userID", "==", user.uid)))

        //if ( getUserFromDB != null)
        addDoc(collection(db, "users"),{
          userId: user.uid,
          nome: user.displayName,
          email: user.email
        });
      }

    })
     
  }, [onAuthStateChanged])

  return (
    <div>
      { !currentUser ? (
        <>
          <SignUp />   a       
        </>
        
      ):( 
        <AuthProvider value={{currentUser}}>

          <Sidebar/>
          <Navbar />

          <div className="home-section">
            <Component {...pageProps} />
          </div>

        </AuthProvider>
      )}
      
    </div>
)}

export default App;