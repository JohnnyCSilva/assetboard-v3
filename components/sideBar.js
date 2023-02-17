import React, { useState, useEffect, useRef, useContext } from 'react'

import { signOut } from 'firebase/auth';
import { AuthContext } from '../config/AuthContext';
import { auth } from '../config/Firebase'

import { Toast } from 'primereact/toast';

import { db } from '../config/Firebase'
import { collection, query, getDocs } from "firebase/firestore";

import { Badge } from 'primereact/badge';

import Link from 'next/link';



function SideBar() {

    const toast = useRef(null);
    const { currentUser } = useContext(AuthContext);
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

    //get faltas from database and show in badge
    const [faltas, setFaltas] = useState(0);
    const [countFaltas, setCountFaltas] = useState(0);

    //get faltas from every user in database and count them
    useEffect(() => {
        const q = query(collection(db, "users"));
        const querySnapshot = getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().faltas) {
                    setFaltas(faltas + doc.data().faltas);
                }
            });
            //count faltas and display in variable
            setCountFaltas(faltas.lenght);
        }
        )
    }, [])

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
                            <Link href="/dashboard" >
                                
                                    <i className='pi pi-home'></i>
                                    <p className="links_name">Dashboard</p>
                                
                            </Link>
                            
                            <span className="tooltip">Dashboard</span>
                        </li>
                        <li>
                            <Link href="/" >
                                
                                <i className='pi pi-folder-open'></i>
                                <p className="links_name">Projetos</p>
                                
                            </Link>
                            <span className="tooltip">Projetos</span>
                        </li>
                        <li>
                            <Link href='/funcionarios' >
                                
                                <i className='pi pi-users'></i>
                                <p className="links_name">Funcionários</p>
                                
                            </Link>
                            <span className="tooltip">Funcionários</span>
                        </li>
                        <li>
                            <Link href="/" >
                                
                                <i className='pi pi-calculator'></i>
                                <p className="links_name">Despesas</p>
                                
                            </Link>
                            <span className="tooltip">Despesas</span>
                        </li>
                        <li>
                            <Link href="/" >
                                
                                <i className='pi pi-users'></i>
                                <p className="links_name">Clientes</p>
                                
                            </Link>
                            <span className="tooltip">Clientes</span>
                        </li>
                        <li>
                            <Link href="/" >
                                
                                <i className='pi pi-bell'></i>
                                <p className="links_name">Pedidos &nbsp; <Badge value={countFaltas} severity="danger"></Badge></p>
                                
                            </Link>
                            <span className="tooltip">Pedidos</span>
                        </li>
                    </ul>
                </div>
                <div className="footer-sidebar" id="footer-sidebar">    
                    
                        <img src={currentUser.photoURL} alt="" onClick={() => window.location = "/userDash"}/>
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
                            <Link href="/" >
                                
                                <i className='pi pi-th-large'></i>
                                <p className="links_name">Dashboard</p>
                                
                            </Link>
                            <span className="tooltip">Dashboard</span>
                        </li>
                        <li>
                            <Link href="/" >
                                
                                <i className='pi pi-folder-open'></i>
                                <p className="links_name">Projetos</p>
                                
                            </Link>
                            <span className="tooltip">Projetos</span>
                        </li>
                        <li>
                            <Link href='/' >
                                
                                <i className='pi pi-calendar-times'></i>
                                <p className="links_name">Tarefas</p>
                                
                            </Link>
                            <span className="tooltip">Tarefas</span>
                        </li>
                        <li>
                            <Link href="/" >
                                
                                <i className='pi pi-calculator'></i>
                                <p className="links_name">Despesas</p>
                                
                            </Link>
                            <span className="tooltip">Despesas</span>
                        </li>
                    </ul>
                </div>
                <div className="footer-sidebar" id="footer-sidebar" >
                        
                    <img src={currentUser.photoURL} alt="" onClick={() => window.location = "/userDash"}/>
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

export default SideBar