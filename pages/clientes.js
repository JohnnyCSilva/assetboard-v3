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
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { InputMask } from 'primereact/inputmask';
import { InputNumber } from 'primereact/inputnumber';



 function clientes(props) {
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

        }).then(() => {
            toast.current.show({severity:'success', summary: 'Registado', detail:'Cliente registado com sucesso.', life: 3000});
            setVisible(false);
        });

        setClientes([]);
        //run getclientes function to update clientes state
        getClientes();
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <button type='button' className='button button-edit' onClick={() => updateCliente(rowData)}><i className='pi pi-pencil'></i></button>
                <button type='button' className='button button-info-circle' onClick={() => viewCliente(rowData)}><i className='pi pi-info-circle'></i></button>
                <button type='button' className='button button-delete' onClick={() => apagarCliente(rowData)}><i className='pi pi-trash'></i></button>
            </React.Fragment>
        );
    };

    //delete cliente from database
    const apagarCliente = (clientes) => {
         
        //show confirmation dialog
        confirmDialog({
            message: 'Tem a certeza que deseja apagar este cliente?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => {
                deleteCliente(clientes);
            },
        });
    }

    const deleteCliente = async (clientes) => {
        const clienteRef = collection(db, "clientes");
        const q = query(clienteRef, where("key", "==", clientes.key));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            deleteDoc(doc.ref);
        });
        setClientes([]);

        getClientes();

    };


    //view cliente info in dialog box
    const viewCliente = (clientes) => {
        setVisibleInfo(true);
        setNome(clientes.nome);
        setMorada(clientes.morada);
        setEmail(clientes.email);
        setContacto(clientes.contacto);
        setIban(clientes.iban);
        setNif(clientes.nif);
    }

    //update cliente info and save to database
    const updateCliente = async (clientes) => {
        const clienteRef = collection(db, "clientes");
        const q = query(clienteRef, where("key", "==", clientes.key));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            updateDoc(doc.ref,{
                nome: nome,
                morada: morada,
                email: email,
                contacto: contacto,
                iban: iban,
                nif: nif,
            });
        });
        setClientes([]);
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
                    <InputText value={contacto} onChange={(e) => setContacto(e.target.value)} />
                </div> 
                <div className='form-group'>
                    <label htmlFor='nif'>Nif</label>
                    <InputText value={nif} onChange={(e) => setNif(e.target.value)} />
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
                    <button type="button" className='button button-save' onClick={registerCliente}><i className='pi pi-plus'></i>Adicionar</button>
                </div>
            </div> 
            

            
        </form>
         </Dialog>
        </div>
        
      </div>
        <Dialog header='Informação do Cliente' visible={visibleInfo} onHide={() => setVisibleInfo(false)}>
            <form className='form-dialog'>
                <div className='form-flex'>
                    <div className='form-group'>
                        <label htmlFor='nome'>Nome</label>
                        <InputText value={nome} onChange={(e) => setNome(e.target.value)} disabled/>
                    </div>
                </div>
                <div className='form-flex'>
                    <div className='form-group'>
                        <label htmlFor='morada'>Morada</label>
                        <InputTextarea autoResize  value={morada} onChange={(e) => setMorada(e.target.value)} rows={5} cols={30} disabled/>
                    </div>
                </div>
                <div className='form-flex'>
                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <InputText value={email} onChange={(e) => setEmail(e.target.value)} disabled/>
                    </div>
                </div>
                <div className='form-flex'>
                    <div className='form-group'>
                        <label htmlFor='contacto'>Contacto</label>
                        <InputText value={contacto} onChange={(e) => setContacto(e.target.value)} disabled/>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='nif'>Nif</label>
                        <InputText value={nif} onChange={(e) => setNif(e.target.value)} disabled/>
                    </div>
                </div>
                <div className='form-flex'>
                    <div className='form-group'>
                        <label htmlFor='iban'>Iban</label>
                        <InputMask value={iban} onChange={(e) => setIban(e.target.value)} disabled mask="PT50-9999-9999-9999-9999-9999-9"/>
                    </div>
                </div>
                <div className='form-flex-buttons'>
                    <div className="form-buttons">
                        
                    </div>
                </div>
            </form>
        </Dialog>

     
        <div className="table">
            <DataTable value={clientes} 
            className="table-pedidos"
            responsiveLayout="scroll"
            emptyMessage="Nenhum cliente encontradated">
                <Column field="nome" header="Nome"></Column>
                <Column field="email" header="Email"></Column>
                <Column field="contacto" header="Contacto"></Column>
                <Column className='colunaicons' body={actionBodyTemplate} exportable={false} style={{ minWidth: '100px', maxWidth: '200px'}}></Column>
            </DataTable>
        </div>
         <ConfirmDialog />
        </div>
        

       
    );
    }

export default clientes