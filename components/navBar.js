import React from 'react'

function navBar() {

    function toggleNavbar() {

        const navbar = document.getElementById("navbar");
        const menu = document.getElementById("menu_show");

        navbar.classList.toggle("show");

        menu.classList.toggle("pi-bars");
        menu.classList.toggle("pi-times");

    }

    function redirect (){
        location.href = "/login";
    }

  return (
    <nav className='navbar' id="navbar">
        <div className='header-navbar'>
            <i className='pi pi-bars' id="menu_show" onClick={() => toggleNavbar()}></i>
            <h1>AssetBoard</h1>
            <img src="/user.jpg" alt="" onClick={() => redirect()}/>
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
                        <i className='pi pi-users'></i>
                        <p className="name-link">Funcionários</p>
                    </a>
                </li>

                <li>
                    <a href='#'>
                        <i className='pi pi-euro'></i>
                        <p className="name-link">Despesas</p>
                    </a>
                </li>

                <li>
                    <a href='#'>
                        <i className='pi pi-wallet'></i>
                        <p className="name-link">Orçamentos</p>
                    </a>
                </li>

                <li>
                    <a href='#'>
                        <i className='pi pi-credit-card'></i>
                        <p className="name-link">Faturas</p>
                    </a>
                </li>
            </ul>
        </div>
    </nav>
  )
}

export default navBar