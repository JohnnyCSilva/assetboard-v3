import React, { useEffect, useRef, useState } from 'react'
import { useAuthValue } from '../config/AuthContext'
import { signOut } from 'firebase/auth';
import { auth } from '../config/Firebase'
import { Toast } from 'primereact/toast';

import { db } from '../config/Firebase'
import { collection, query, getDocs } from "firebase/firestore";

import { Badge } from 'primereact/badge';

function navBar() {

    const toast = useRef(null);
    const {currentUser} = useAuthValue();
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const [role, setRole] = useState('');
    
    useEffect(() => {
        const navbar = document.getElementById("navbar");
        const menu = document.getElementById("menu_show");

        const q = query(collection(db, "users"));
        const querySnapshot = getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().uid === currentUser.uid) {
                    setRole(doc.data().userRole);
                }
            });
        }
        )
    }, [])

    function toggleNavbar() {

        navbar.classList.toggle("show");

        menu.classList.toggle("pi-bars");
        menu.classList.toggle("pi-times");

    }


    const showToast = () => {
        toast.current.show({ severity: 'warn', summary: 'Sessão Encerrada', detail: 'A terminar sessão...' });
    };

    async function SignOutUser() {
        navbar.classList.toggle("show");

        showToast();
        await delay(2000);
        signOut(auth);
        window.location = "/";
    }  
    if (role === 'admin') {
        return (
            <nav className='navbar' id="navbar">

                <Toast ref={toast} />

                <div className='header-navbar'>
                    <i className='pi pi-bars' id="menu_show" onClick={() => toggleNavbar()}></i>
                    <h1>AssetBoard</h1>
                    <img src={currentUser.photoURL} alt="" onClick={() => window.location = "/UserDash"}/>
                </div>
                <div className='container-navbar'>
                    <ul className="list-menu">
                        <li>
                            <a href="#">
                            <i className='pi pi-th-large'></i>
                                <p className="name-link">Dashboard</p>
                            </a>
                        </li>

                        <li>
                            <a href='#'>
                                <i className='pi pi-folder-open'></i>
                                <p className="name-link">Projetos</p>
                            </a>
                        </li>

                        <li>
                            <a href='/Funcionarios'>
                                <i className='pi pi-users'></i>
                                <p className="name-link">Funcionários</p>
                            </a>
                        </li>

                        <li>
                            <a href='#'>
                                <i className='pi pi-calculator'></i>
                                <p className="name-link">Despesas</p>
                            </a>
                        </li>

                        <li>
                            <a href='#'>
                                <i className='pi pi-users'></i>
                                <p className="name-link">Clientes</p>
                            </a>
                        </li>

                        <li>
                            <a href='#'>
                                <i className='pi pi-bell'></i>
                                <p className="name-link">Pedidos</p>
                            </a>
                        </li>

                        <li>
                            <a onClick={SignOutUser}>
                                <i className='pi pi-sign-out'></i>
                                <p className="name-link">Sair da Conta</p>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    } else if (role === 'funcionario'){
        return (
            <nav className='navbar' id="navbar">

                <Toast ref={toast} />

                <div className='header-navbar'>
                    <i className='pi pi-bars' id="menu_show" onClick={() => toggleNavbar()}></i>
                    <h1>AssetBoard</h1>
                    <img src={currentUser.photoURL} alt="" onClick={() => window.location = "/UserDash"}/>
                </div>
                <div className='container-navbar'>
                    <ul className="list-menu">
                        <li>
                            <a href="#">
                            <i className='pi pi-th-large'></i>
                                <p className="name-link">Dashboard</p>
                            </a>
                        </li>

                        <li>
                            <a href='#'>
                                <i className='pi pi-folder-open'></i>
                                <p className="name-link">Projetos</p>
                            </a>
                        </li>

                        <li>
                            <a href='#'>
                                <i className='pi pi-calendar-times'></i>
                                <p className="name-link">Tarefas</p>
                            </a>
                        </li>

                        <li>
                            <a href='#'>
                                <i className='pi pi-calculator'></i>
                                <p className="name-link">Despesas</p>
                            </a>
                        </li>

                        <li>
                            <a onClick={SignOutUser}>
                                <i className='pi pi-sign-out'></i>
                                <p className="name-link">Sair da Conta</p>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    } else if (role === 'gestor'){
        alert('gestor');

    } 
}

export default navBar