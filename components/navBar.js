import React, { useEffect, useRef, useState, useContext } from 'react'
import { AuthContext } from '../config/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../config/Firebase'
import { Toast } from 'primereact/toast';
import Link from 'next/link';
import { db } from '../config/Firebase'
import { collection, query, getDocs } from "firebase/firestore";

function Navbar() {

    const toast = useRef(null);
    const { currentUser } = useContext(AuthContext);
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
                    <img src={currentUser.photoURL} alt="" onClick={() => window.location = "/userDash"}/>
                </div>
                <div className='container-navbar'>
                    <ul className="list-menu">
                        <li>
                            <Link href="/dashboard" >
                                
                                    <i className='pi pi-th-large'></i>
                                    <p className="name-link">Dashboard</p>
                                
                            </Link>
                        </li>

                        <li>
                            <Link href="/">
                                
                                    <i className='pi pi-folder-open'></i>
                                    <p className="name-link">Projetos</p>
                                
                            </Link>
                        </li>

                        <li>
                            <Link href="/funcionarios">
                                
                                    <i className='pi pi-users'></i>
                                    <p className="name-link">Funcionários</p>
                                
                            </Link>
                        </li>

                        <li>
                            <Link href="/">
                                
                                    <i className='pi pi-calculator'></i>
                                    <p className="name-link">Despesas</p>
                                
                            </Link>
                        </li>

                        <li>
                            <Link href="/">
                                
                                <i className='pi pi-users'></i>
                                <p className="name-link">Clientes</p>
                                
                            </Link>
                        </li>

                        <li>
                            <Link href="/">
                                
                                <i className='pi pi-bell'></i>
                                <p className="name-link">Pedidos</p>
                                
                            </Link>
                        </li>

                        <li>
                            <Link onClick={SignOutUser}>
                                <i className='pi pi-sign-out'></i>
                                <p className="name-link">Sair da Conta</p>
                            </Link>
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
                    <img src={currentUser.photoURL} alt="" onClick={() => window.location = "/userDash"}/>
                </div>
                <div className='container-navbar'>
                    <ul className="list-menu">
                        <li>
                            <Link href="/dashboard" >
                                
                                <i className='pi pi-th-large'></i>
                                <p className="name-link">Dashboard</p>
                                
                            </Link>
                        </li>

                        <li>
                            <Link href="/">
                                
                                <i className='pi pi-folder-open'></i>
                                <p className="name-link">Projetos</p>
                                
                            </Link>
                        </li>

                        <li>
                            <Link href="/">
                                
                                <i className='pi pi-calendar-times'></i>
                                <p className="name-link">Tarefas</p>
                                
                            </Link>
                        </li>

                        <li>
                            <Link href="/">
                                
                                <i className='pi pi-calculator'></i>
                                <p className="name-link">Despesas</p>
                                
                            </Link>
                        </li>

                        <li>
                            <Link onClick={SignOutUser} >
                                
                                <i className='pi pi-sign-out'></i>
                                <p className="name-link">Sair da Conta</p>
                                
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    } else if (role === 'gestor'){
        alert('gestor');

    } 
}

export default Navbar