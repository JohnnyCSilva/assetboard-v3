import React, { useState, useEffect, useRef, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { getDocs, collection, addDoc, deleteDoc,query,where, updateDoc } from "firebase/firestore";
import { db } from '../config/Firebase'
import { Toast } from 'primereact/toast';
import { AuthContext } from '../config/AuthContext';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputMask } from 'primereact/inputmask';
import Clienteslist from '../components/ClientesConfig/ClientesList';




 function clientes() {

    const { currentUser } = useContext(AuthContext);
    const [visible, setVisible] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [clientesDialog, setClientesDialog] = useState(false);
    const [nome, setNome] = useState('');
    const [morada, setMorada] = useState('');
    const [email, setEmail] = useState('');
    const [contacto, setContacto] = useState('');
    const [iban, setIban] = useState('');
    const [nif, setNif] = useState('');
    const toast = useRef(null);
    const [ globalFilterValue, setGlobalFilterValue ] = useState('');
    const dt = useRef(null);
    const [ filters, setFilters ] = useState(null);

    const [ displayEdit, setDisplayEdit ] = useState(false);
    const [visibleInfo, setVisibleInfo] = useState(false);

    useEffect(() => {
        getClientes();        
    }, [])

    async function getClientes() {

        setClientes([]);

        //get clientes from database
        const querySnapshot = await getDocs(collection(db, "clientes"));
        querySnapshot.forEach((doc) => {
            setClientes((clientes) => [...clientes, doc.data()]);

        });
    }
   


    const registerCliente = () => {
        addDoc(collection(db, "clientes"), {
            key: Math.random().toString(36),
            nome: nome,
            morada: morada,
            email: email,
            contacto: contacto,
            iban: iban,
            nif: nif,
            createdAt: new Date(),

        }).then(() => {
            toast.current.show({severity:'success', summary: 'Registado', detail:'Cliente registado com sucesso.', life: 3000});
            setVisible(false);
            setClientesDialog(false);
            
        });

        //reset form
        setNome('');
        setMorada('');
        setEmail('');
        setContacto('');
        setIban('');
        setNif('');


        setClientes([]);
        //run getclientes function to update clientes state
        getClientes();
    }

    






    const [ cliente, setCliente ] = useState(false);


    


    
   

    //search clientes by name and email and if the result doesnt match any of the above, show all clientes  

  

    const searchClientes = (e) => {
        if (e.target.value === '') {
            getClientes();
            return;
        }else{
            const search = e.target.value;
            const filteredClientes = clientes.filter(clientes => {
                return clientes.nome.toLowerCase().includes(search.toLowerCase()) || clientes.email.toLowerCase().includes(search.toLowerCase());
            })
            setClientes(filteredClientes);
                    }
                }
      

    
    return (
        <div>
            <Toast ref={toast} />
            <div className='page-title'>
                <div className='title-left-side'>
                    <h1>Clientes</h1>    
                </div>
                <div className='title-right-side'>
                <button className='button button-add' onClick={() => setClientesDialog(true)}><i className='pi pi-user'></i><span>Adicionar Cliente</span></button>
                </div>
            </div>
        
    
        <div className='title-right-side'>
        
         <Dialog header='Adicionar Cliente' visible={clientesDialog} onHide={() => setClientesDialog(false)}>
            <form className='form-dialog'>
          
            <form className='form-dialog'>
            <div className='form-flex'>
                <div className='form-group'>
                    <label htmlFor='nome'>Nome</label>
                    <InputText value={nome} onChange={(e) => setNome(e.target.value)} />
                </div>  
                </div>  
                </form>
           
                <div className='form-flex'>
                <div className='form-group'>
                    <label htmlFor='morada'>Morada</label>
                    <InputTextarea autoResize  value={morada} onChange={(e) => setMorada(e.target.value)} rows={5} cols={30} />
                </div>
                </div>
          
            <div className='form-flex'>
                <div className='form-group'>
                    <label htmlFor='email'>Email</label>
                    <InputText value={email} onChange={(e) => setEmail(e.target.value)} />
                </div> 
            </div>
            <div className='form-flex'>
                <div className='form-group'>
                    <label htmlFor='contacto'>Contacto</label>
                    <InputNumber value={contacto} onValueChange={(e) => setContacto(e.value)} />
                </div> 
                <div className='form-group'>
                    <label htmlFor='nif'>Nif</label>
                    <InputNumber value={nif} onValueChange={(e) => setNif(e.value)} />
                </div>  
            </div>
            <div className='form-flex'>
                <div className='form-group'>
                    <label htmlFor='iban'>Iban</label>
                    <InputMask value={iban} onChange={(e) => setIban(e.target.value)} mask="PT50-9999-9999-9999-9999-9999-9"/>
                </div>
                
            </div>
            <div className='form-flex-buttons'>
                <div className="form-buttons">
                    <button type="button" className='button button-save' onClick={registerCliente}><i className='pi pi-plus'></i><span>Adicionar</span></button>
                </div>
            </div> 
            

            
        </form>
         </Dialog>
        </div>
        
      
        <ConfirmDialog/>

        

        <div className='page-content'>
        <div className='search-box'>
            <i className='pi pi-search'></i>
            <input type="text" placeholder='Pesquisar Cliente' onChange={searchClientes} />
        </div>
        <div className="grid">
            <div className="grid-box">
                <Clienteslist clientes={clientes} />
            </div>
        </div>
        </div>
        </div>
        

       
    );
    }

export default clientes