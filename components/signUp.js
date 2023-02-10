import React, { useEffect} from 'react'
import { googleSignIn } from '../config/Firebase'
import { facebookSignIn } from '../config/Firebase'

function signUp() {

    useEffect(() => { 
        const container = document.getElementById('container');
    }, [])

    function toggleForms() {
        container.classList.toggle("sign-up-mode");
    }

    
  return (
    <div className='login-form'>
        <div className="container" id="container">
            <div className="forms-container">
                <div className="signin-signup">
                    <form action="#" className="sign-in-form">
                        <h2 className="title">Iniciar Sessão</h2>
                        <div className="input-field">
                            <i className="pi pi-user"></i>
                            <input type="text" placeholder="Utilizador" />
                        </div>
                        <div className="input-field">
                        <i className="pi pi-lock"></i>
                            <input type="password" placeholder="Password" />
                        </div>
                        <input type="submit" value="Login" className="btn solid" />
                        <p className="social-text">Ou utilize as redes sociais para iniciar sessão.</p>
                        <div className="social-media">
                        <a href="#" className="social-icon" onClick={() => facebookSignIn()}>
                            <i className="pi pi-facebook"></i>
                        </a>
                        <a href="#" className="social-icon" onClick={() => googleSignIn()}>
                            <i className="pi pi-google"></i>
                        </a>
                        </div>
                    </form>
                    <form action="#" className="sign-up-form">
                        <h2 className="title">Criar Conta</h2>
                            <div className="input-field">
                                <i className="pi pi-user"></i>
                                <input type="text" placeholder="Utilizador" required/>
                            </div>
                            <div className="input-field">
                                <i className="pi pi-envelope"></i>
                                <input type="email" placeholder="Email" required/>
                            </div>
                            <div className="input-field">
                                <i className="pi pi-lock"></i>
                                <input type="password" placeholder="Password" required/>
                            </div>
                            <div className="input-field">
                                <i className="pi pi-lock"></i>
                                <input type="password" placeholder="Confirme a password" required/>
                            </div>
                            <input type="submit" className="btn" value="Sign up" />
                            <p className="social-text">Ou crie conta através das redes sociais.</p>
                            <div className="social-media">
                            <a href="#" className="social-icon">
                                <i className="pi pi-facebook" onClick={() => facebookSignIn()}></i>
                            </a>
                            <a href="#" className="social-icon" onClick={() => googleSignIn()}>
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