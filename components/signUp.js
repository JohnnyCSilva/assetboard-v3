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
        <div class="container" id="container">
            <div class="forms-container">
                <div class="signin-signup">
                    <form action="#" class="sign-in-form">
                        <h2 class="title">Iniciar Sessão</h2>
                        <div class="input-field">
                            <i class="pi pi-user"></i>
                            <input type="text" placeholder="Utilizador" />
                        </div>
                        <div class="input-field">
                        <i class="pi pi-lock"></i>
                            <input type="password" placeholder="Password" />
                        </div>
                        <input type="submit" value="Login" class="btn solid" />
                        <p class="social-text">Ou utilize as redes sociais para iniciar sessão.</p>
                        <div class="social-media">
                        <a href="#" class="social-icon" onClick={() => facebookSignIn()}>
                            <i class="pi pi-facebook"></i>
                        </a>
                        <a href="#" class="social-icon" onClick={() => googleSignIn()}>
                            <i class="pi pi-google"></i>
                        </a>
                        </div>
                    </form>
                    <form action="#" class="sign-up-form">
                        <h2 class="title">Criar Conta</h2>
                            <div class="input-field">
                                <i class="pi pi-user"></i>
                                <input type="text" placeholder="Utilizador" required/>
                            </div>
                            <div class="input-field">
                                <i class="pi pi-envelope"></i>
                                <input type="email" placeholder="Email" required/>
                            </div>
                            <div class="input-field">
                                <i class="pi pi-lock"></i>
                                <input type="password" placeholder="Password" required/>
                            </div>
                            <div class="input-field">
                                <i class="pi pi-lock"></i>
                                <input type="password" placeholder="Confirme a password" required/>
                            </div>
                            <input type="submit" class="btn" value="Sign up" />
                            <p class="social-text">Ou crie conta através das redes sociais.</p>
                            <div class="social-media">
                            <a href="#" class="social-icon">
                                <i class="pi pi-facebook" onClick={() => facebookSignIn()}></i>
                            </a>
                            <a href="#" class="social-icon" onClick={() => googleSignIn()}>
                                <i class="pi pi-google"></i>
                            </a>
                        </div>
                    </form>
                </div>
            </div>

            <div class="panels-container">
                <div class="panel left-panel">
                    <div class="content">
                        <h3>É novo aqui ?</h3>
                        <p>
                        Crie a sua conta para utilizar a nossa página.
                        </p>
                        <button class="btn transparent" id="sign-up-btn" onClick={() => toggleForms()}>
                        Criar Conta
                        </button>
                    </div>
                    <img src="img/log.svg" class="image" alt="" />
                </div>
                <div class="panel right-panel">
                    <div class="content">
                        <h3>Já é um utilizador ?</h3>
                        <p>
                        Entre já na aplicação no botão em baixo.

                        </p>
                        <button class="btn transparent" id="sign-in-btn" onClick={() => toggleForms()}>
                        Login
                        </button>
                    </div>
                    <img src="img/register.svg" class="image" alt="" />
                </div>
            </div>
        </div>
    </div>
  )
}

export default signUp