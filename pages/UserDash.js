import React, {useEffect, useState, useRef} from 'react'
import { db } from '../config/Firebase'
import { collection, query, getDocs, updateDoc, where } from "firebase/firestore";
import { useAuthValue } from '../config/AuthContext'

import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Calendar } from "primereact/calendar";
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';


function UserDash() {

    const {currentUser} = useAuthValue();
    const toast = useRef(null);

    //get currentUser data from database
    const [userData, setUserData] = useState([]);
    const [codPostal, setCodPostal] = useState('');
    const [iban, setIban] = useState('');
    const [date, setDate] = useState(null);
    const [morada , setMorada] = useState('');
    const [nacionalidade , setNacionalidade] = useState('');
    const [contacto , setContacto] = useState('');
    const [nif , setNif] = useState('');
    const [niss , setNiss] = useState('');

    useEffect(() => {
        const q = query(collection(db, "users"));
        const querySnapshot = getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().uid === currentUser.uid) {
                    setUserData(doc.data());
                }
            });
        })
    }, [])

    const chooseOptions = { icon: 'pi pi-cog', iconOnly: true,  className: 'button-uploadFile' };

    //on submit form changes to database and update user data
    const handleSubmit = () => {
        alert(date);
        const q = query(collection(db, "users"), where("uid", "==", currentUser.uid));
        const querySnapshot = getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                updateDoc(doc.ref, {
                    codPostal: codPostal,
                    iban: iban,
                    date: date,
                    morada: morada,
                    nacionalidade: nacionalidade,
                    nascimento: date,
                    contacto: contacto,
                    nif: nif,
                    niss: niss,
                });
            });
        }).then(() => {
            toast.current.show({severity:'success', summary: 'Atualizado', detail:'Campos atualizados com sucesso.', life: 3000});
        })

    }


  return (
    <div>
        <Toast ref={toast} />

        <div className='page-title'>
            <div className='title-left-side'>
                <h1>Perfil</h1>
            </div>
            <div className='title-right-side'>

            </div>
        </div>
        <div className='user-profile'>
            <div className='user-profile-left'>
                <h2>Editar Perfil</h2>
                <div className='user-profile-changes'>
                    <form>

                        <div className='form-flex'>
                            <div className='form-group'>
                                <label htmlFor='avatar'>Avatar</label>
                                <div className='avatar'>
                                    <img src={userData.photo} alt='avatar'/>
                                    <FileUpload chooseOptions={chooseOptions} mode="basic" name="demo[]" url="/api/upload" accept="image/*" maxFileSize={1000000}/>
                                </div>
                            </div>
                        </div>

                        <div className='form-flex'>
                            <div className='form-group'>
                                <label htmlFor='name'>Nome</label>
                                <InputText id='name' type='text' className="inputText" defaultValue={userData.name} disabled/>
                            </div>
                            <div className='form-group'>
                                <label htmlFor='email'>Email</label>
                                <InputText id='email' type='email' className="inputText" defaultValue={userData.email} disabled/>
                            </div>
                        </div>

                        <div className='form-flex'>
                            <div className='form-group morada'>
                                <label htmlFor='morada'>Morada</label>
                                <InputText id='morada' type='morada' className="inputText" defaultValue={userData.morada} onChange={(e) => setMorada(e.target.value)} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='codPostal'>Codigo Postal</label>
                                <InputText className="inputText" type='codPostal' onChange={(e) => setCodPostal(e.target.value)} defaultValue={userData.codPostal} />
                            </div>
                        </div>
                        <div className='form-flex'>
                            <div className='form-group morada'>
                                <label htmlFor='nacionalidade'>Nacionalidade</label>
                                <InputText id='nacionalidade' type='nacionalidade' className="inputText" defaultValue={userData.nacionalidade}  onChange={(e) => setNacionalidade(e.target.value)}/>
                            </div>
                            <div className='form-group morada'>
                                <label htmlFor='nascimento'>Data de Nascimento</label>
                                <Calendar value={date} dateFormat="dd/MM/yy" onChange={(e) => setDate(e.value)} defaultValue={userData.nascimento} showIcon />
                            </div>
                        </div>

                        <div className='form-flex'>
                            <div className='form-group'>
                                <label htmlFor='contacto'>Contacto</label>
                                <InputText id='contacto' type='contacto' className="inputText" defaultValue={userData.contacto} onChange={(e) => setContacto(e.target.value)}/>
                            </div>
                            <div className='form-group'>
                                <label htmlFor='iban'>IBAN</label>
                                <InputMask value={iban} className="inputText" onChange={(e) => setIban(e.target.value)} defaultValue={userData.iban} mask="PT50-9999-9999-9999-9999-9999-9" />
                            </div>
                        </div>

                        <div className='form-flex'>
                            <div className='form-group'>
                                <label htmlFor='nif'>NIF</label>
                                <InputText id='nif' type='nif' className="inputText" defaultValue={userData.nif} onChange={(e) => setNif(e.target.value)}/>
                            </div>
                            <div className='form-group'>
                                <label htmlFor='niss'>NISS</label>
                                <InputText id='niss' type='niss' className="inputText" defaultValue={userData.niss} onChange={(e) => setNiss(e.target.value)}/>
                            </div>
                        </div>

                        <div className='form-flex-buttons'>
                            <div className="form-buttons">
                                <button type="button" className='button button-save' onClick={handleSubmit}><i className='pi pi-save'></i></button>
                                <button type="button" className='button button-cancel'><i className='pi pi-times'></i></button>
                            </div>
                       </div>
                    </form>
                </div>
            </div>
            <div className='user-profile-right'>
                <div className='user-profile-notices'>
                    <h2>Notificações</h2>
                </div>
            </div>  
        </div>
  </div>
  )
}

export default UserDash