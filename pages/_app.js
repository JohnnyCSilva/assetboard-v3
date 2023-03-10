import '@/styles/global.css';
import '@/styles/navigation.css';
import '@/styles/signUp.css';
import '@/styles/userDash.css';
import '@/styles/pedidos.css';
import '@/styles/projetos.css';

import '@/styles/cliente.css';
import '@/styles/despesas.css';


import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css"; 
import "primereact/resources/themes/lara-light-indigo/theme.css";

import Navbar from '@/components/Navbar.js';
import Sidebar from '@/components/Sidebar.js';
import SignUp from '@/components/signUp';

import { AuthContextProvider } from '../config/AuthContext';
import { useState, useEffect } from 'react';
import { auth } from '../config/Firebase';

function App({ Component, pageProps }) {

  const [user, setUser] = useState(null);

  useEffect(() => {
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        console.log(user);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  //signOut function
  const signOut = () => {
    auth.signOut();
  };


  return (
    <AuthContextProvider>
      {user ? (
        <>  
          <Sidebar />
          <Navbar />
          
          <div className='home-section'>
            <p onClick={signOut}>Desligar Conta</p>
            <Component {...pageProps} />
          </div>
        </>
      ) : (
        <SignUp />
      )}
    </AuthContextProvider>
  );
}

export default App;
