import React, {useEffect, useState, useRef, useContext} from 'react'
import { db } from '../config/Firebase'
import { collection, query, getDocs, updateDoc, where, addDoc, orderBy } from "firebase/firestore";
import { AuthContext } from '../config/AuthContext';

import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { Calendar } from "primereact/calendar";
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';

import FaltasList from '../components/UserConfig/FaltasList'
import { Dropdown } from 'primereact/dropdown';


function userDash() {

    const { currentUser } = useContext(AuthContext);
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);


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
    const [nascimento , setNascimento] = useState(null);
    const [estadoCivil , setEstadoCivil] = useState('');
    const [dependentes , setDependentes] = useState('');
    const [deficientes , setDeficientes] = useState('');


    const [motivo, setMotivo] = useState('');
    const [diasFalta, setDiasFalta] = useState(null);
    const [diasFaltaFim, setDiasFaltaFim] = useState(null);
    const [obs, setObs] = useState('');

    const [faltas, setFaltas] = useState([]);

    const estadoCivilOptions = [
        {label: 'Solteiro', value: 'Solteiro'},
        {label: 'Casado', value: 'Casado'},
        {label: 'Divorciado', value: 'Divorciado'},
        {label: 'Viúvo', value: 'Viúvo'},
    ]

    const dependentesOptions = [
        {label: '0', value: '0'},
        {label: '1', value: '1'},
        {label: '2', value: '2'},
        {label: '3', value: '3'},
        {label: '4', value: '4'},
        {label: '5', value: '5'},
        {label: '6', value: '6'},
        {label: '7', value: '7'},
        {label: '8', value: '8'},
        {label: '9', value: '9'},
        {label: '10', value: '10'},
    ]

    const deficientesOptions = [
        {label: '0', value: '0'},
        {label: '1', value: '1'},
        {label: '2', value: '2'},
        {label: '3', value: '3'},
        {label: '4', value: '4'},
        {label: '5', value: '5'},
        {label: '6', value: '6'},
        {label: '7', value: '7'},
        {label: '8', value: '8'},
        {label: '9', value: '9'},
        {label: '10', value: '10'},
        {label: '11', value: '11'},
        {label: '12', value: '12'},
    ]


    useEffect(() => {
        getFaltas();        
    }, [])

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

    async function getFaltas() {

        setFaltas([]);

        //get faltas from database where uid is equal to currentUser uid order by diasFalta
        const q = query(collection(db, "faltas"), where("uid", "==", currentUser.uid), orderBy("diasFalta", "desc"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setFaltas(faltas => [...faltas, doc.data()]);
        });
    }

    // on handleSubmit update user data in database and show toast message
    const handleSubmit = () => {
   
        // Update userData with new values
        const newUserData = {
            ...userData,
            codPostal: codPostal || userData.codPostal,
            iban: iban || userData.iban,
            morada: morada || userData.morada,
            nacionalidade: nacionalidade || userData.nacionalidade,
            contacto: contacto || userData.contacto,
            nif: nif || userData.nif,
            niss: niss || userData.niss,
            nascimento: nascimento || userData.nascimento,
            estadoCivil: estadoCivil || userData.estadoCivil,
            dependentes: dependentes || userData.dependentes,
            deficientes: deficientes || userData.deficientes,
        }
        
        const q = query(collection(db, "users"), where("uid", "==", currentUser.uid));
        const querySnapshot = getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                updateDoc(doc.ref, newUserData);
            });
        }).then(() => {
            toast.current.show({severity:'success', summary: 'Atualizado', detail:'Campos atualizados com sucesso.', life: 3000});
        })
    
    }  


    //set minDate to diasFalta 
    const minDate = new Date(diasFalta);

    //max date is today date
    const maxDate = new Date();

    const registerFalta = () => {
        addDoc(collection(db, "faltas"), {
            key: Math.random().toString(36),
            motivo: motivo,
            diasFalta: diasFalta,
            diasFaltaFim: diasFaltaFim,
            obs: obs,
            uid: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName,
            estado: "Pendente",

        }).then(() => {
            toast.current.show({severity:'success', summary: 'Registado', detail:'Falta registada com sucesso.', life: 3000});
            setVisible(false);
        });

        setFaltas([]);
        //run getFaltas function to update faltas state
        getFaltas();
    }
    

  return (
    <div>
        <Toast ref={toast} />

        <div className='page-title'>
            <div className='title-left-side'>
                <h1>Perfil</h1>
            </div>
            <div className='title-right-side'>
                <button className='button button-vaccation' onClick={() => setVisible(true)}><i className='pi pi-calendar'></i>Registar Faltas</button>
                <Dialog header="Registar Faltas" visible={visible} className='dialog-faltas' onHide={() => setVisible(false)}>
                    <form className='form-dialog'>
                        <label>Motivo</label>
                        <div className='form-flex'>
                            <div className='form-group-radio'>
                                <RadioButton inputId="motivo1" name="motivo" value="Ferias" onChange={(e) => setMotivo(e.value)} checked={motivo === 'Ferias'} />
                                <p htmlFor="motivo1">Férias</p>
                            </div>
                            <div className='form-group-radio'>
                                <RadioButton inputId="motivo2" name="motivo" value="Doenca" onChange={(e) => setMotivo(e.value)} checked={motivo === 'Doenca'} />
                                <p htmlFor="motivo2">Doença</p>
                            </div>
                            <div className='form-group-radio'>
                                <RadioButton inputId="motivo3" name="motivo" value="Outro" onChange={(e) => setMotivo(e.value)} checked={motivo === 'Outro'} />
                                <p htmlFor="motivo3">Outro</p>
                            </div>
                        </div>
                        <div className='form-flex'>
                            <div className='form-group'>
                                <label htmlFor='date'>Inicio</label>
                                <Calendar value={diasFalta} dateFormat="dd/mm/yy" onChange={(e) => setDiasFalta(e.value)} showIcon />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='date'>Fim</label>
                                <Calendar value={diasFaltaFim} minDate={minDate} dateFormat="dd/mm/yy" onChange={(e) => setDiasFaltaFim(e.value)} showIcon />
                            </div>
                        </div>
                        <div className='form-flex'>
                            <div className='form-group'>
                                <label htmlFor='obs'>Observações</label>
                                <InputTextarea autoResize  value={obs} onChange={(e) => setObs(e.target.value)} rows={5} cols={30} />
                            </div>
                        </div>
                        <div className='form-flex-buttons'>
                            <div className="form-buttons">
                                <button type="button" className='button button-save' onClick={registerFalta}><i className='pi pi-calendar-plus'></i>Registar</button>
                            </div>
                       </div>
                    </form>
                </Dialog>
            </div>
        </div>
        <div className='user-profile'>
            <div className='user-profile-left'>
                <h2>Editar Perfil</h2>
                <div className='user-profile-changes'>
                    <form>
                        <div className='form-flex'>
                            <div className='form-group'>
                                <label htmlFor='name'>Nome</label>
                                <InputText id='name' type='text' className="inputText" defaultValue={userData.displayName} disabled/>
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
                                <InputText id='nacionalidade' type='nacionalidade' className="inputText"  defaultValue={userData.nacionalidade}  onChange={(e) => setNacionalidade(e.target.value)}/>
                            </div>
                            <div className='form-group morada'>
                                <label htmlFor='nascimento'>Data de Nascimento</label>
                                <Calendar value={date} dateFormat="dd/mm/yy" maxDate={maxDate} onChange={(e) => setNascimento(e.value)} showIcon />                                
                            </div>
                        </div>

                        <div className='form-flex'>
                            <div className='form-group'>
                                <label htmlFor='contacto'>Contacto</label>
                                <InputText id='contacto' type='contacto' className="inputText" defaultValue={userData.contacto} onChange={(e) => setContacto(e.target.value)}/>
                            </div>
                            <div className='form-group'>
                                <label htmlFor='iban'>IBAN</label>
                                <InputMask value={userData.iban} className="inputText" onChange={(e) => setIban(e.target.value)} defaultValue={userData.iban} mask="PT50-9999-9999-9999-9999-9999-9" />
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

                        <div className='form-flex'>
                            <div className='form-group'>
                                <label htmlFor='estadoCivil'>Estado Civil</label>
                                <Dropdown className="dropdown-value" value={estadoCivil} options={estadoCivilOptions} onChange={(e) => setEstadoCivil(e.value)} placeholder="Selecione o Estado Civil" />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='dependentes'>Número de Dependentes</label>
                                <Dropdown className="dropdown-value" value={dependentes} options={dependentesOptions} onChange={(e) => setDependentes(e.value)} placeholder="Selecione o Número de Dependentes" />
                            </div>  
                        </div>
                        <div className='form-flex'>
                            <div className='form-group'>
                                <label htmlFor='deficientes'>Número de deficientes no agregado familiar</label>
                                <Dropdown className="dropdown-value" value={deficientes} options={deficientesOptions} onChange={(e) => setDeficientes(e.value)} placeholder="Selecione o Número de Deficientes" />
                            </div>
                        </div>

                        

                        <div className='form-flex-buttons'>
                            <div className="form-buttons">
                                <button type="button" className='button button-save' onClick={handleSubmit}><i className='pi pi-save'></i>Guardar</button>
                            </div>
                       </div>
                    </form>
                </div>
            </div>
            <div className='user-profile-right'>
                <h2>Registo de Faltas</h2>
                <div className='user-profile-faltas'>
                    
                    <FaltasList faltas={faltas} />
                </div>  
            </div>
        </div>
  </div>
  )
}

export default userDash
