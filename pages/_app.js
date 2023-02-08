import '@/styles/global.css'
import '@/styles/navigation.css'

import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css"; 
import "primereact/resources/themes/lara-light-indigo/theme.css";


import  Sidebar  from '../components/sideBar.js';
import Navbar from '../components/navBar.js';

 function App({ Component, pageProps }) {
  return (
  
  <div>
    <Sidebar/>
    <Navbar />

    <div className="home-section">
      <Component {...pageProps} />
    </div>
  </div>
)}

export default App;