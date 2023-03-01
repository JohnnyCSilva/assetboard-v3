import React from 'react'
import { useState, useRef } from 'react';
import { OverlayPanel } from 'primereact/overlaypanel';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { collection, db, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { InputMask } from 'primereact/inputmask';

function clientesitem(props) {
    const [clientes, setClientes] = useState([]);
    const [nome, setNome] = useState('');
    const [morada, setMorada] = useState('');
    const [email, setEmail] = useState('');
    const [contacto, setContacto] = useState('');
    const [iban, setIban] = useState('');
    const [nif, setNif] = useState('');
    const op = useRef(null);
    const [displayEdit, setDisplayEdit] = useState(false);
    const [cliente, setCliente] = useState({});
    const [visible, setVisible] = useState(false);
    

 

    //add a new table row with the new data
    const addRow = () => {
        const newClientes = {
            nome: nome,
            morada: morada,
            email: email,
            contacto: contacto,
            iban: iban,
            nif: nif
        }
        props.setClientes([...props.clientes, newClientes]);
        setNome('');
        setMorada('');
        setEmail('');
        setContacto('');
        setIban('');
        setNif('');
    }


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

  
    //delete cliente from the database
    const deleteCliente = async (clientes) => {
        const clienteRef = collection(db, "clientes");
        const q = query(clienteRef, where("key", "==", clientes.key));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            deleteDoc(doc.ref).then(() => {
                toast.current.show({severity:'success', summary: 'Apagado', detail:'Cliente apagado com sucesso.', life: 3000});

            });
        });
        setClientes([]);
        getClientes();
    }

 
    

    //update cliente
    const updateCliente = async () => {
        const clienteRef = collection(db, "clientes");
        const q = query(clienteRef, where("key", "==", cliente.key));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            updateDoc(doc.ref, {
                nome: nome || cliente.nome,
                morada: morada || cliente.morada,
                email: email || cliente.email,
                contacto: contacto || cliente.contacto,
                iban: iban || cliente.iban,
                nif: nif || cliente.nif,
            }).then(() => {
                toast.current.show({severity:'success', summary: 'Atualizado', detail:'Cliente atualizado com sucesso.', life: 3000});
                setVisible(false);

            });
        });
        setClientes([]);
        getClientes();
        setDisplayEdit(false);
    }


    

  return (
<div>
        <div className="grid-template-card">
            <div className="grid-template-card-top">
                <div className="grid-card-image-text">
                    <img src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" alt="Projeto" />
                    <div className="grid-card-project">
                        <h3>{props.clientes.nome}</h3>
                        <p><i className="pi pi-user"></i><span>{props.clientes.email}</span></p>
                    </div>
                </div>
              
                    <button className="button button-actions" onClick={(e) => op.current.toggle(e)}><i className="pi pi-ellipsis-v"></i></button>  
                <OverlayPanel ref={op}> 
                    <button type='button' className='button button-edit' onClick={() => updateCliente()}><i className='pi pi-pencil'></i></button>
                    <button type='button' className='button button-delete' onClick={() => apagarCliente()}><i className='pi pi-trash'></i></button>
                </OverlayPanel>
            </div>
            <div className="grid-template-card-middle">
                <div className="card-middle">
                    <p><i className="pi pi-phone"></i><span>{props.clientes.contacto}</span></p>
                    <p><i className="pi pi-id-card"></i><span>{props.clientes.nif}</span></p>
                    <p><i className="pi pi-credit-card"></i><span>{props.clientes.iban}</span></p>
                    <p><i className="pi pi-map-marker"></i><span>{props.clientes.morada}</span></p>
                </div>
            </div>
            
  
            <Dialog header='Editar Cliente' visible={displayEdit} onHide={() => setDisplayEdit(false)}>
            <form className='form-dialog'>
                <div className='form-flex'>
                    <div className='form-group'>
                        <label htmlFor='nome'>Nome</label>
                        <InputText value={clientes.nome} onChange={(e) => setCliente({...clientes, nome: e.target.value})} />
                    </div>
                </div>
                <div className='form-flex'>
                    <div className='form-group'>
                        <label htmlFor='morada'>Morada</label>
                        <InputTextarea autoResize  value={clientes.morada} onChange={(e) => setCliente({...clientes, morada: e.target.value})} rows={5} cols={30} />
                    </div>
                </div>
                <div className='form-flex'>
                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <InputText value={clientes.email} onChange={(e) => setCliente({...clientes, email: e.target.value})} />
                    </div>
                </div>
                <div className='form-flex'>
                    <div className='form-group'>
                        <label htmlFor='contacto'>Contacto</label>
                        <InputNumber value={clientes.contacto} onValueChange={(e) => setCliente({...clientes, contacto: e.value})} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='nif'>Nif</label>
                        <InputNumber value={clientes.nif} onValueChange={(e) => setCliente({...clientes, nif: e.value})} />
                    </div>
                </div>
                <div className='form-flex'>
                    <div className='form-group'>
                        <label htmlFor='iban'>Iban</label>
                        <InputMask value={clientes.iban} onChange={(e) => setCliente({...clientes, iban: e.target.value})} mask="PT50-9999-9999-9999-9999-9999-9"/>
                    </div>
                </div>
                <div className='form-flex-buttons'>
                    <div className="form-buttons">
                        <button type="button" className='button button-save' ><i className='pi pi-save'></i><span>Guardar</span></button>
                    </div>
                </div>
            </form>
        </Dialog>
          
        </div>

</div>

  )
}

export default clientesitem