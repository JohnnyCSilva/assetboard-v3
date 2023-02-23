import React, { useState, useEffect, useRef, useContext } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { getDocs, collection, addDoc } from "firebase/firestore";
import { db } from '../config/Firebase'
import { Toast } from 'primereact/toast';
import { AuthContext } from '../config/AuthContext';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';



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

        }).then(() => {
            toast.current.show({severity:'success', summary: 'Registado', detail:'Cliente registado com sucesso.', life: 3000});
            setVisible(false);
        });

        setClientes([]);
        //run getclientes function to update clientes state
        getClientes();
    }
    

 

    
    return (
        <div>
            <Toast ref={toast} />
        <div className='main-title-page'>
        <div className='title-left-side'>
          <h1>Clientes </h1>
        </div>
    
        <div className='title-right-side'>
        <button className='button button-vaccation' onClick={() => setClientesDialog(true)}><i className='pi pi-user'></i>Adicionar Cliente</button>
         <Dialog visible={clientesDialog} onHide={() => setClientesDialog(false)}>
            <form className='form-dialog'>
            <h2>Adicionar Cliente</h2>
            <form className='form-dialog'>
            <div className='form-flex'>
                <div className='form-group'>
                    <label htmlFor='nome'>Nome</label>
                    <InputText value={nome} onChange={(e) => setNome(e.target.value)} />
                </div>  
                </div>  
                </form>
            <form className='form-dialog'>
                <div className='form-flex'>
                <div className='form-group'>
                    <label htmlFor='morada'>Morada</label>
                    <InputTextarea autoResize  value={morada} onChange={(e) => setMorada(e.target.value)} rows={5} cols={30} />
                </div>
                </div>
           </form>
            <div className='form-flex'>
                <div className='form-group'>
                    <label htmlFor='email'>Email</label>
                    <InputText value={email} onChange={(e) => setEmail(e.target.value)} />
                </div> 
                <div className='form-group'>
                    <label htmlFor='contacto'>Contacto</label>
                    <InputText value={contacto} onChange={(e) => setContacto(e.target.value)} />
                </div> 
            </div>
            <div className='form-flex'>
                <div className='form-group'>
                    <label htmlFor='iban'>Iban</label>
                    <InputText value={iban} onChange={(e) => setIban(e.target.value)} />
                </div>
                <div className='form-group'>
                    <label htmlFor='nif'>Nif</label>
                    <InputText value={nif} onChange={(e) => setNif(e.target.value)} />
                </div>  
            </div>
            <div className='form-flex-buttons'>
                <div className="form-buttons">
                    <button type="button" className='button button-save' onClick={registerCliente}><i className='pi pi-plus'></i>Adicionar</button>
                </div>
            </div> 
            

            
        </form>
         </Dialog>
        </div>
        
      </div>
        <div className="table">
            <DataTable value={clientes} resizableColumns showGridlines>
                <Column field="nome" header="Nome" sortable></Column>
                <Column field="morada" header="Morada" sortable></Column>
                <Column field="email" header="Email" sortable></Column>
                <Column field="contacto" header="Contacto" sortable></Column>
                <Column field="iban" header="Iban" sortable></Column>
                <Column field="nif" header="NIF" sortable></Column>
            </DataTable>
        </div>
         
        </div>

       
    );
    }

export default clientes