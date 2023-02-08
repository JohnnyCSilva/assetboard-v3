import React, { useState, useRef, useEffect } from 'react'

import { useAuthValue } from '../config/AuthContext'

function sideBar() {

    function toggleSidebar() {

        const sidebar = document.getElementById("sidebar");
        const menu = document.getElementById("menu");

        sidebar.classList.toggle("open");

        menu.classList.toggle("pi-bars");
        menu.classList.toggle("pi-times");

    }

    function redirect (){
        location.href = "/login";
    }

    const {currentUser} = useAuthValue()
    const delay = ms => new Promise(res => setTimeout(res, ms));   

  return (

    <nav className='sidebar' id="sidebar">

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
                    <a href='#'>
                        <i className='pi pi-users'></i>
                        <p className="links_name">Funcionários</p>
                    </a>
                    <span className="tooltip">Funcionários</span>
                </li>

                <li>
                    <a href='#'>
                        <i className='pi pi-euro'></i>
                        <p className="links_name">Despesas</p>
                    </a>
                    <span className="tooltip">Despesas</span>
                </li>

                <li>
                    <a href='#'>
                        <i className='pi pi-wallet'></i>
                        <p className="links_name">Orçamentos</p>
                    </a>
                    <span className="tooltip">Orçamentos</span>
                </li>

                <li>
                    <a href='#'>
                        <i className='pi pi-credit-card'></i>
                        <p className="links_name">Faturas</p>
                    </a>
                    <span className="tooltip">Faturas</span>
                </li>
            </ul>
        </div>
        <div className="footer-sidebar" id="footer-sidebar" onClick={() => redirect()}>
            <img src="/user.jpg" alt="" />
            <div className="user-role">
                {currentUser && ( <h2>{currentUser?.displayName}</h2>)}
                {!currentUser && (<h2>FilhodaPuta</h2>)}
                <p>Administrator</p>
            </div>
            <i className='pi pi-sign-out' id="log_out" ></i>
        </div>


    </nav>
  )
}

export default sideBar