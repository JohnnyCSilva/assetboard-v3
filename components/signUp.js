import React, { useEffect, useState } from 'react'
import { google, facebook, auth } from '../config/Firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/Firebase';	


function signUp() {

    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    useEffect(() => { 
        const container = document.getElementById('container');
    }, [])

    function toggleForms() {
        container.classList.toggle("sign-up-mode");
    }

    //function to login with google and create a new user in the database
    const loginWithGoogle = async () => {
        //alert('Login with Google');
        const userCredential = await signInWithPopup(auth, google);
        await addUser(userCredential.user);
        //await signInWithEmailAndPassword(auth, userCredential.user.email, userCredential.user.uid);
    };

    //function to login with facebook and create a new user in the database
    const loginWithFacebook = async () => {
        //alert('Login with Facebook');
        const userCredential = await signInWithPopup(auth, facebook);
        await addUser(userCredential.user);
        //await signInWithEmailAndPassword(auth, userCredential.user.email, userCredential.user.uid);
    };



    const CreateAccount = async (e) => {
        e.preventDefault();
      
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
      
        try {

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            await addUser(userCredential.user);
      
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError(err.message);
        }
      };

      //function to add user to the database
        const addUser = async (user) => {

            //check if user already exists in the database if not add it
            const userRef = collection(db, 'users');
            const q = query(userRef, where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);
            //if user photo is null set it to the default image
            if (user.photoURL === null || user.photoURL === '' || user.photoURL === undefined) {
                user.photoURL = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
            }
            //get user display name in field if it is null
            if (user.displayName === null || user.displayName === '' || user.displayName === undefined) {
                user.displayName = displayName;
            }
            if (querySnapshot.empty) {
                await addDoc(userRef, {
                    displayName: user.displayName,
                    email: user.email,
                    uid: user.uid,
                    photoURL: user.photoURL,
                    createdAt: user.metadata.creationTime,
                    userRole: 'funcionario',
                });
            }
            
           
        };

      const IniciarSessao = (event) => {
        event.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(user);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
          });
      };
        
    
  return (
    <div className='login-form'>
        <div className="container" id="container">
            <div className="forms-container">
                <div className="signin-signup">
                    <form action="#" className="sign-in-form">
                        <h2 className="title">Iniciar Sessão</h2>
                        <div className="input-field">
                            <i className="pi pi-user"></i>
                            <input type="text" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}  />
                        </div>
                        <div className="input-field">
                        <i className="pi pi-lock"></i>
                            <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                        </div>
                        <input type="submit" value="Iniciar Sessão" className="btn solid" onClick={IniciarSessao} />
                        <p className="social-text">Ou utilize as redes sociais para iniciar sessão.</p>
                        <div className="social-media">
                        <a href="#" className="social-icon" onClick={() => loginWithFacebook()}>
                            <i className="pi pi-facebook"></i>
                        </a>
                        <a href="#" className="social-icon" onClick={() => loginWithGoogle()}>
                            <i className="pi pi-google"></i>
                        </a>
                        </div>
                    </form>
                    <form action="#" className="sign-up-form">
                        <h2 className="title">Criar Conta</h2>
                            <div className="input-field">
                                <i className="pi pi-user"></i>
                                <input type="text" placeholder="Nome" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required/>
                            </div>
                            <div className="input-field">
                                <i className="pi pi-envelope"></i>
                                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}  required/>
                            </div>
                            <div className="input-field">
                                <i className="pi pi-lock"></i>
                                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}  required/>
                            </div>
                            <div className="input-field">
                                <i className="pi pi-lock"></i>
                                <input type="password" placeholder="Confirme a password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                            </div>
                            <input type="submit" className="btn" value="Criar Conta" onClick={CreateAccount}/>
                            <p className="social-text">Ou crie conta através das redes sociais.</p>
                            <div className="social-media">
                            <a href="#" className="social-icon">
                                <i className="pi pi-facebook" onClick={() => loginWithFacebook()}></i>
                            </a>
                            <a href="#" className="social-icon" onClick={() => loginWithGoogle()}>
                                <i className="pi pi-google"></i>
                            </a>
                        </div>
                    </form>
                </div>
            </div>

            <div className="panels-container">
                <div className="panel left-panel">
                    <div className="content">
                        <h3>É novo aqui ?</h3>
                        <p>
                        Crie a sua conta para utilizar a nossa página.
                        </p>
                        <button className="btn transparent" id="sign-up-btn" onClick={() => toggleForms()}>
                        Criar Conta
                        </button>
                    </div>
                    <img src="/log.svg" className="image" alt="" />
                </div>
                <div className="panel right-panel">
                    <div className="content">
                        <h3>Já é um utilizador ?</h3>
                        <p>
                        Entre já na aplicação no botão em baixo.

                        </p>
                        <button className="btn transparent" id="sign-in-btn" onClick={() => toggleForms()}>
                        Login
                        </button>
                    </div>
                    <img src="/register.svg" className="image" alt="" />
                </div>
            </div>
        </div>
    </div>
  )
}

export default signUp