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
import { googleSignIn } from '../config/Firebase'
import { useState, useEffect} from 'react'
import { auth } from '../config/Firebase'
import { onAuthStateChanged } from 'firebase/auth'

 function App({ Component, pageProps }) {

  const [currentUser, setCurrentUser] = useState()

  useEffect(() => {
    
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      console.log(currentUser);
    })
     
  }, [])

  return (
    <div>
      { !currentUser ? (
        <>
          <SignUp />          
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