import '@/styles/global.css'
import '@/styles/navigation.css'
import '@/styles/signUp.css'
import '@/styles/funcionario.css'
import '@/styles/userDash.css'

import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css"; 
import "primereact/resources/themes/lara-light-indigo/theme.css";

import Sidebar  from '../components/sideBar.js';
import Navbar from '../components/navBar.js';
import SignUp from '@/components/signUp.js';

import { AuthProvider } from '../config/AuthContext'
import { useState } from 'react'
import { auth, db } from '../config/Firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useAuthValue } from '../config/AuthContext'

import { addDoc, collection, query, where, getDocs } from "firebase/firestore";

function App({ Component, pageProps }) {

  //const [currentUser, setCurrentUser] = useState(null);
  const {currentUser} = useAuthValue();


    // if user no logged in, show sign up page
    // if user logged in, show the rest of the app
    if (currentUser === null || currentUser === undefined) {

      return (
        <AuthProvider value={{currentUser}}>
          <SignUp />
        </AuthProvider>
      )
    } else {
      return (
        <AuthProvider value={{currentUser}}>
          <Navbar />
          <Sidebar />
          <div className='home-section'>
            <Component {...pageProps} />
          </div>
        </AuthProvider>
      )
    }
}



export default App;