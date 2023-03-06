import React, { useEffect, useRef, useState, useContext } from 'react'
import { AuthContext } from '../config/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../config/Firebase'
import { Toast } from 'primereact/toast';

import { db } from '../config/Firebase'
import { collection, query, getDocs, where } from "firebase/firestore";

function Navbar() {

    const toast = useRef(null);
    const { currentUser } = useContext(AuthContext);
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const [currentUserInfo, setCurrentUserInfo] = useState([]);
    
    useEffect(() => {
        getCurrentUserInfo();
    }, [])

    //get current user details from db
    const getCurrentUserInfo = async () => {
        const q = query(collection(db, "users"), where("uid", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setCurrentUserInfo(doc.data());
        });
    }

    //getCurrentPageTitle
    const [pageTitle, setPageTitle] = useState('');

    useEffect(() => {
        const path = window.location.pathname;
        switch (path) {
            case '/dashboard':
                setPageTitle('Dashboard');
                break;
            case '/projetos':
                setPageTitle('Projetos');
                break;
            case '/funcionarios':
                setPageTitle('Funcionários');
                break;
            case '/despesas':
                setPageTitle('Despesas');
                break;
            case '/clientes':
                setPageTitle('Clientes');
                break;
            case '/pedidos':
                setPageTitle('Pedidos');
                break;
            case '/userDash':
                setPageTitle('Perfil');
                break;

            default:
                setPageTitle('Dashboard');
                break;
        }
    }, [])

    function toggleNavbar() {
        const menu = document.getElementById("menu_show");
        const navbar = document.getElementById("navbar");

        navbar.classList.toggle("show");

        menu.classList.toggle("pi-bars");
        menu.classList.toggle("pi-times");

    }


    const showToast = () => {
        toast.current.show({ severity: 'warn', summary: 'Sessão Encerrada', detail: 'A terminar sessão...' });
    };

    async function SignOutUser() {
        const navbar = document.getElementById("navbar");

        navbar.classList.toggle("show");

        showToast();
        await delay(2000);
        signOut(auth);
        window.location = "/";
    }  
    if (currentUserInfo.userRole === 'admin') {
        return (
            <nav className='navbar' id="navbar">

                <Toast ref={toast} />

                <div className='header-navbar'>
                    <i className='pi pi-bars' id="menu_show" onClick={() => toggleNavbar()}></i>
                    <h1>{pageTitle}</h1>
                    <img src={currentUserInfo.photo} alt="" onClick={() => window.location = "/userDash"}/>
                </div>
                <div className='container-navbar'>
                    <ul className="list-menu">
                        <li>
                            <a href="/dashboard" >
                                    
                                <i className='pi pi-home'></i>
                                <p className="name-link">Dashboard</p>
                                
                            </a>
                        </li>

                        <li>
                            <a href="/projetos" >
                                
                                <i className='pi pi-folder-open'></i>
                                <p className="name-link">Projetos</p>
                                
                            </a>
                        </li>

                        <li>
                            <a href="/funcionarios" >
                                
                                <i className='pi pi-users'></i>
                                <p className="name-link">Funcionários</p>
                                
                            </a>
                        </li>

                        <li>
                            <a href="/despesas" >
                                
                                <i className='pi pi-calculator'></i>
                                <p className="name-link">Despesas</p>
                                
                            </a>
                        </li>

                        <li>
                            <a href="/clientes" >
                                
                                <i className='pi pi-users'></i>
                                <p className="name-link">Clientes</p>
                                
                            </a>
                        </li>

                        <li>
                            <a href="/pedidos" >
                                
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
    } else if (currentUserInfo.userRole === 'funcionario'){
        return (
            <nav className='navbar' id="navbar">

                <Toast ref={toast} />

                <div className='header-navbar'>
                    <i className='pi pi-bars' id="menu_show" onClick={() => toggleNavbar()}></i>
                    <h1>{pageTitle}</h1>
                    <img src={currentUserInfo.photo} alt="" onClick={() => window.location = "/userDash"}/>
                </div>
                <div className='container-navbar'>
                    <ul className="list-menu">
                        <li>
                            <a href="/dashboard" >
                                    
                                <i className='pi pi-home'></i>
                                <p className="name-link">Dashboard</p>
                                    
                            </a>
                        </li>

                        <li>
                            <a href="/projetos" >
                                
                                <i className='pi pi-folder-open'></i>
                                <p className="name-link">Projetos</p>
                                
                            </a>
                        </li>

                        <li>
                            <a href="/tarefas">
                                
                                <i className='pi pi-calendar-times'></i>
                                <p className="name-link">Tarefas</p>
                                
                            </a>
                        </li>

                        <li>
                            <a href="/despesas">
                                
                                <i className='pi pi-calculator'></i>
                                <p className="name-link">Despesas</p>
                                
                            </a>
                        </li>

                        <li>
                            <a onClick={SignOutUser} >
                                
                                <i className='pi pi-sign-out'></i>
                                <p className="name-link">Sair da Conta</p>
                                
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    } else if (currentUserInfo.userRole === 'gestor'){
        alert('gestor');

    } 
}

export default Navbar
