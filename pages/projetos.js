import React, { useState, useEffect, useContext, useRef} from 'react'

import { db } from '../config/Firebase'
import { collection, query, getDocs, updateDoc, where, addDoc, orderBy, deleteDoc } from "firebase/firestore";
import { AuthContext } from '../config/AuthContext';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';


import ProjetoList from '../components/Projetos/ProjetoList'

function projetos() {

    const { currentUser } = useContext(AuthContext);
    const [ userRole, setUserRole ] = useState('');
    const [ displayAddProjeto, setDisplayAddProjeto ] = useState(false);
    const [ projetos, setProjetos ] = useState([]);
    const [ clientes, setClientes ] = useState([]);
    const [ gestores, setGestores ] = useState([]);
    const toast = useRef(null);

    const [ nomeProjeto, setNomeProjeto ] = useState('');
    const [ selectedCliente, setSelectedCliente ] = useState(null);
    const [ dataInicio, setDataInicio ] = useState(null);
    const [ previsaoEntrega, setPrevisaoEntrega ] = useState(null);
    const [ selectedGestor, setSelectedGestor ] = useState(null);
    const [ obs, setObs ] = useState('');

    const minDate = dataInicio;

    //get currentUser role from db
    const getUserRole = async () => {
        const q = query(collection(db, "users"), where("email", "==", currentUser.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setUserRole(doc.data());
        });
    }

    //get all projetos from db
    const getProjetos = async () => {
        const projetos = [];
        const q = query(collection(db, "projetos"), orderBy ("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            projetos.push({ ...doc.data(), id: doc.id });
        });
        setProjetos(projetos);
    }

    //get all clientes from db and add to dropdown
    const getClientes = async () => {
        const clientes = [];
        const q = query(collection(db, "clientes"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            clientes.push({ label: doc.data().nome, value: doc.data().email });
        });
        setClientes(clientes);
    }

    //get all users that are gestor from db and add to dropdown
    const getGestores = async () => {
        const gestores = [];
        const q = query(collection(db, "users"), where("userRole", "==", "gestor"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            gestores.push({ label: doc.data().displayName, value: doc.data().displayName });
        });
        setGestores(gestores);
    }

    useEffect(() => {
        getProjetos();
        getClientes();
        getGestores();	
        getUserRole();
        getProjetosFuncionario();
        getProjetosGestor();
    }, [])

    const registarProjeto = async () => {
        const projeto = {
            key: Math.random().toString(36),
            nome: nomeProjeto,
            cliente: selectedCliente,
            dataInicio: dataInicio,
            previsaoEntrega: previsaoEntrega,
            gestor: selectedGestor,
            obs: obs,
            createdAt: new Date()
        }
        await addDoc(collection(db, "projetos"), projeto);

        toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Projeto adicionado com sucesso', life: 3000 });
        setDisplayAddProjeto(false);
        getProjetos();
    }
    const searchProjetos = (e) => {
        if (e.target.value === '') {
            getProjetos();
            return;
        }else{
            const search = e.target.value;
            const filteredProjetos = projetos.filter(projetos => {
                return projetos.nome.toLowerCase().includes(search.toLowerCase());
            })
            setProjetos(filteredProjetos);
        }
    }

    //userRole === funcionario

    const [ projetosFuncionarios, setProjetosFuncionarios ] = useState([]);

    const getProjetosFuncionario = async () => {
        const projetos = [];
        const q = query(collection(db, "projetos"), where("funcionarios", "array-contains", currentUser.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            projetos.push({ ...doc.data(), id: doc.id });
        });

        setProjetosFuncionarios(projetos);
    }

    //userRole === gestor

    const [ projetosGestor, setProjetosGestor ] = useState([]);

    const getProjetosGestor = async () => {

        const projetos = [];
            const q = query(collection(db, "projetos"), where("gestor", "==", currentUser.displayName || currentUser.name));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                projetos.push({ ...doc.data(), id: doc.id });
            });
        console.log("Projetos Gestor: " + projetos);
        setProjetosGestor(projetos);
        
    }
   
    if (userRole.userRole === 'admin') {
        return (
            <div>

                <Toast ref={toast} />
                <div className='page-title'>
                    <div className='title-left-side'>
                        <h1>Projetos</h1>    
                    </div>
                    <div className='title-right-side'>
                        <button className='button button-add' onClick={() => setDisplayAddProjeto(true)}><i className='pi pi-plus-circle'></i><span>Adicionar Projeto</span></button>
                    </div>
                </div>

                <div className='page-content'>

                    <div className='search-box'>
                        <i className='pi pi-search'></i>
                        <input type="text" placeholder='Pesquisar' id='search-box' onChange={searchProjetos}/>
                    </div>

                    <div className='page-grid-template'>
                        <ProjetoList projetos={projetos} />
                    </div>
                </div>

                <Dialog header="Adicionar Projeto" className='dialog-faltas' visible={displayAddProjeto} onHide={() => setDisplayAddProjeto(false)}>
                    <form className='form-dialog'>
                        <div className='form-flex'>
                            <div className='form-group'>
                                <label htmlFor="name">Nome do Projeto</label>
                                <InputText className="inputTextEdit" id="name" onChange={(e) => setNomeProjeto(e.target.value)} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor="name">Cliente</label>
                                <Dropdown optionLabel="label" optionValue="value" value={selectedCliente} options={clientes} onChange={(e) => setSelectedCliente(e.value)} placeholder="Selecione o Cliente" />
                            </div>
                        </div>

                        <div className='form-flex'>
                            <div className='form-group'>
                                <label htmlFor="name">Data Inicio</label>
                                <Calendar value={dataInicio} dateFormat="dd/mm/yy" onChange={(e) => setDataInicio(e.value)} showIcon />
                            </div>
                            <div className='form-group'>
                                <label htmlFor="name">Previs??o de Entrega</label>
                                <Calendar value={previsaoEntrega} minDate={minDate} dateFormat="dd/mm/yy" onChange={(e) => setPrevisaoEntrega(e.value)} showIcon />
                            </div>
                        </div>

                        <div className='form-flex'>
                            <div className='form-group'>
                                <label htmlFor="name">Gestor do Projeto</label>
                                <Dropdown optionLabel="label" optionValue="value" value={selectedGestor} options={gestores} onChange={(e) => setSelectedGestor(e.value)} placeholder="Selecione o Gestor do Projeto" />
                            </div>
                        </div>

                        <div className='form-flex'>
                            <div className='form-group'>
                                <label htmlFor="name">Observa????es</label>
                                <InputTextarea autoResize  value={obs} onChange={(e) => setObs(e.target.value)} rows={5} cols={30} />
                            </div>
                        </div>

                        <div className='form-flex-buttons'>
                            <div className="form-buttons">
                                <button type="button" className='button button-save' onClick={registarProjeto}><i className='pi pi-check-circle'></i><span>Registar</span></button>
                            </div>
                        </div>
                    </form>
                </Dialog>
                
            </div>
        )

    } else if (userRole.userRole === 'funcionario') {

        return (
            <div>
                <Toast ref={toast} />
                    <div className='page-title'>
                        <div className='title-left-side'>
                            <h1>Projetos</h1>    
                        </div>
                    </div>

                    <div className='page-content'>

                        <div className='search-box'>
                            <i className='pi pi-search'></i>
                            <input type="text" placeholder='Pesquisar' id='search-box' onChange={searchProjetos}/>
                        </div>

                        <div className='page-grid-template'>
                            <ProjetoList projetos={projetosFuncionarios} />
                        </div>
                    </div>

            </div>
        )
    } else if (userRole.userRole === 'gestor') {

        return (
            <div>
                <Toast ref={toast} />
                    <div className='page-title'>
                        <div className='title-left-side'>
                            <h1>Projetos</h1>    
                        </div>
                    </div>

                    <div className='page-content'>

                        <div className='search-box'>
                            <i className='pi pi-search'></i>
                            <input type="text" placeholder='Pesquisar' id='search-box' onChange={searchProjetos}/>
                        </div>

                        <div className='page-grid-template'>
                            <ProjetoList projetos={projetosGestor} />
                        </div>
                    </div>

            </div>
        )
       
    }
}

export default projetos