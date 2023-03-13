import React, { useState, useEffect, useRef, useContext } from 'react'

import { signOut } from 'firebase/auth';
import { AuthContext } from '../config/AuthContext';
import { auth } from '../config/Firebase'

import { Toast } from 'primereact/toast';

import { db } from '../config/Firebase'
import { collection, query, getDocs, where } from "firebase/firestore";

import { Badge } from 'primereact/badge';

import Link from 'next/link';

function Sidebar() {

    const toast = useRef(null);
    const { currentUser } = useContext(AuthContext);
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const [currentUserInfo, setCurrentUserInfo] = useState([]);

    useEffect(() => {
        getCurrentUserInfo();
        console.log(currentUserInfo);
    }, [])

    //get current user details from db
    const getCurrentUserInfo = async () => {
        console.log(currentUser.uid);
        const q = query(collection(db, "users"), where("uid", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setCurrentUserInfo(doc.data());
        });
    }


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

    //get all faltas from db faltas and count them to display in countFaltas
    useEffect(() => {

        setFaltas(0);

        const q = query(collection(db, "faltas"));
        const querySnapshot = getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data()) {
                    setFaltas(faltas => faltas + 1);
                }
            });
        }
        )
        
    }, [])


    if (currentUserInfo.userRole === 'admin') {

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
                            <Link href="/projetos" >
                                
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
                            <Link href="/despesas" >
                                
                                <i className='pi pi-calculator'></i>
                                <p className="links_name">Despesas</p>
                                
                            </Link>
                            <span className="tooltip">Despesas</span>
                        </li>
                        <li>
                            <Link href="/clientes" >
                                
                                <i className='pi pi-users'></i>
                                <p className="links_name">Clientes</p>
                                
                            </Link>
                            <span className="tooltip">Clientes</span>
                        </li>
                        <li>
                            <Link href="/pedidos" >
                                
                                <i className='pi pi-bell'></i>
                                <p className="links_name">Pedidos &nbsp;<Badge value={faltas} severity="danger"></Badge></p>
                                
                            </Link>
                            <span className="tooltip">Pedidos</span>
                        </li>
                    </ul>
                </div>
                <div className="footer-sidebar" id="footer-sidebar">    
                    <Link href='/userDash'>
                        <img src={currentUserInfo.photo || currentUserInfo.photoURL} alt=""/>
                        <div className="user-role">
                            {currentUser && ( <>
                                <h2>{currentUserInfo.name || currentUserInfo.displayName}</h2>
                                <p>{currentUserInfo.userRole}</p>
                            </>
                            )}
                        </div>
                    </Link>
                    <i className='pi pi-sign-out' id="log_out" onClick={() => SignOutUser()} ></i>
                
          </div>
            </nav>
          )
    } else if (currentUserInfo.userRole === 'funcionario'){
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
                                
                                <i className='pi pi-th-large'></i>
                                <p className="links_name">Dashboard</p>
                                
                            </Link>
                            <span className="tooltip">Dashboard</span>
                        </li>
                        <li>
                            <Link href="/projetos" >
                                
                                <i className='pi pi-folder-open'></i>
                                <p className="links_name">Projetos</p>
                                
                            </Link>
                            <span className="tooltip">Projetos</span>
                        </li>
                        <li>
                            <Link href='/tarefas' >
                                
                                <i className='pi pi-calendar-times'></i>
                                <p className="links_name">Tarefas</p>
                                
                            </Link>
                            <span className="tooltip">Tarefas</span>
                        </li>
                        <li>
                            <Link href="/despesas" >
                                
                                <i className='pi pi-calculator'></i>
                                <p className="links_name">Despesas</p>
                                
                            </Link>
                            <span className="tooltip">Despesas</span>
                        </li>
                    </ul>
                </div>
                <div className="footer-sidebar" id="footer-sidebar" >
                    <Link href='/userDash'>
                    <img src={currentUserInfo.photo || currentUserInfo.photoURL} alt=""/>
                    <div className="user-role">
                        {currentUser && ( <>
                            <h2>{currentUserInfo.name || currentUserInfo.displayName}</h2>
                            <p>{currentUserInfo.userRole}</p>
                        </>
                        )}
                    </div>
                    </Link>
                    <i className='pi pi-sign-out' id="log_out" onClick={() => SignOutUser()} ></i>
                </div>
            </nav>
        )
    }   else if (currentUserInfo.userRole === 'gestor'){
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
                                
                                <i className='pi pi-th-large'></i>
                                <p className="links_name">Dashboard</p>
                                
                            </Link>
                            <span className="tooltip">Dashboard</span>
                        </li>
                        <li>
                            <Link href="/projetos" >
                                
                                <i className='pi pi-folder-open'></i>
                                <p className="links_name">Projetos</p>
                                
                            </Link>
                            <span className="tooltip">Projetos</span>
                        </li>
                        <li>
                            <Link href='/tarefas' >
                                
                                <i className='pi pi-calendar-times'></i>
                                <p className="links_name">Tarefas</p>
                                
                            </Link>
                            <span className="tooltip">Tarefas</span>
                        </li>
                        <li>
                            <Link href="/despesas" >
                                
                                <i className='pi pi-calculator'></i>
                                <p className="links_name">Despesas</p>
                                
                            </Link>
                            <span className="tooltip">Despesas</span>
                        </li>
                    </ul>
                </div>
                <div className="footer-sidebar" id="footer-sidebar" >
                    <Link href='/userDash'>
                    <img src={currentUserInfo.photo || currentUserInfo.photoURL} alt=""/>
                    <div className="user-role">
                        {currentUser && ( <>
                            <h2>{currentUserInfo.name || currentUserInfo.displayName}</h2>
                            <p>{currentUserInfo.userRole}</p>
                        </>
                        )}
                    </div>
                    </Link>
                    <i className='pi pi-sign-out' id="log_out" onClick={() => SignOutUser()} ></i>
                </div>
            </nav>
        )
    } 


}

export default Sidebar
