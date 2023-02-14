import React, { useState, useEffect, useRef } from 'react'

import { signOut } from 'firebase/auth';
import { useAuthValue } from '../config/AuthContext'
import { auth } from '../config/Firebase'

import { Toast } from 'primereact/toast';

import { db } from '../config/Firebase'
import { collection, query, getDocs } from "firebase/firestore";

import { Badge } from 'primereact/badge';



function sideBar() {

    const toast = useRef(null);
    const {currentUser} = useAuthValue();
    const delay = ms => new Promise(res => setTimeout(res, ms));


    // get currentUser role from database
    const [role, setRole] = useState('');

    useEffect(() => {
        const q = query(collection(db, "users"));
        const querySnapshot = getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().uid === currentUser.uid) {
                    setRole(doc.data().userRole);
                }
            });
        }
        )
        console.log("role" + role);
    }, [])

    const showToast = () => {
        toast.current.show({ severity: 'warn', summary: 'Sessão Encerrada', detail: 'A terminar sessão...' });
    };

    function toggleSidebar() {

        const sidebar = document.getElementById("sidebar");
        const menu = document.getElementById("menu");

        sidebar.classList.toggle("open");

        menu.classList.toggle("pi-bars");
        menu.classList.toggle("pi-times");

    }
  
    async function SignOutUser() {
        showToast();
        await delay(2000);
        signOut(auth);
        window.location = "/";
    }   



    //if currentUser role is admin, show admin sidebar
    if (role === 'admin') {

        return (

            <nav className='sidebar' id="sidebar">
        
            <Toast ref={toast} />
        
                <div className="header-sidebar">
                    <i className='pi pi-bars' id="menu" onClick={() => toggleSidebar()}></i>
                    <h1>AssetBoard</h1>
                </div>
                <div className="container-sidebar" id="container-sidebar">
                    <ul className="menu-list">
                        <li>
                            <a href='#'>
                                <i className='pi pi-th-large'></i>
                                <p className="links_name">Dashboard</p>
                            </a>
                            <span className="tooltip">Dashboard</span>
                        </li>
                        <li>
                            <a href='#'>
                                <i className='pi pi-folder-open'></i>
                                <p className="links_name">Projetos</p>
                            </a>
                            <span className="tooltip">Projetos</span>
                        </li>
                        <li>
                            <a href='/Funcionarios'>
                                <i className='pi pi-users'></i>
                                <p className="links_name">Funcionários</p>
                            </a>
                            <span className="tooltip">Funcionários</span>
                        </li>
                        <li>
                            <a href='#'>
                                <i className='pi pi-calculator'></i>
                                <p className="links_name">Despesas</p>
                            </a>
                            <span className="tooltip">Despesas</span>
                        </li>
                        <li>
                            <a href='#'>
                                <i className='pi pi-users'></i>
                                <p className="links_name">Clientes</p>
                            </a>
                            <span className="tooltip">Clientes</span>
                        </li>
                        <li>
                            <a href='#'>
                                <i className='pi pi-bell'></i>
                                <p className="links_name">Pedidos <Badge value="2" severity="danger"></Badge></p>
                            </a>
                            <span className="tooltip">Pedidos</span>
                        </li>
                    </ul>
                </div>
                <div className="footer-sidebar" id="footer-sidebar" >
                    <img src={currentUser.photoURL} alt="" onClick={() => window.location = "/UserDash"}/>
                    <div className="user-role">
                        {currentUser && ( <>
                            <h2>{currentUser.displayName}</h2>
                            <p>{role}</p>
                        </>
                        )}
                    </div>
                    <i className='pi pi-sign-out' id="log_out" onClick={() => SignOutUser()} ></i>
                </div>
        
        
            </nav>
          )
    } else if (role === 'funcionario'){
        return (
        <nav className='sidebar' id="sidebar">
        
            <Toast ref={toast} />
        
                <div className="header-sidebar">
                    <i className='pi pi-bars' id="menu" onClick={() => toggleSidebar()}></i>
                    <h1>AssetBoard</h1>
                </div>
                <div className="container-sidebar" id="container-sidebar">
                    <ul className="menu-list">
                        <li>
                            <a href='#'>
                                <i className='pi pi-th-large'></i>
                                <p className="links_name">Dashboard</p>
                            </a>
                            <span className="tooltip">Dashboard</span>
                        </li>
                        <li>
                            <a href='#'>
                                <i className='pi pi-folder-open'></i>
                                <p className="links_name">Projetos</p>
                            </a>
                            <span className="tooltip">Projetos</span>
                        </li>
                        <li>
                            <a href='/Funcionarios'>
                                <i className='pi pi-calendar-times'></i>
                                <p className="links_name">Tarefas</p>
                            </a>
                            <span className="tooltip">Tarefas</span>
                        </li>
                        <li>
                            <a href='#'>
                                <i className='pi pi-calculator'></i>
                                <p className="links_name">Despesas</p>
                            </a>
                            <span className="tooltip">Despesas</span>
                        </li>
                    </ul>
                </div>
                <div className="footer-sidebar" id="footer-sidebar" >
                    <img src={currentUser.photoURL} alt="" onClick={() => window.location = "/UserDash"}/>
                    <div className="user-role">
                        {currentUser && ( <>
                            <h2>{currentUser.displayName}</h2>
                            <p>{role}</p>
                        </>
                        )}
                    </div>
                    <i className='pi pi-sign-out' id="log_out" onClick={() => SignOutUser()} ></i>
                </div>
            </nav>
        )
    }   else if (role === 'gestor'){
        alert('gestor');

    } 


}

export default sideBar