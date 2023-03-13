import React, { useRef, useState, useEffect, useContext } from 'react'
import { ProgressBar } from 'primereact/progressbar';
import Router from 'next/router';
import { db } from '../../config/Firebase'
import { Toast } from 'primereact/toast';
import { AuthContext } from '../../config/AuthContext';
import { collection, query, getDocs, updateDoc, where, addDoc, orderBy, deleteDoc } from "firebase/firestore";

function ProjetoItem(props) {

    const toast = useRef();
    const [userRole, setUserRole] = useState('');
    const { currentUser } = useContext(AuthContext);

    const [dataInicioProjeto, setDataInicioProjeto] = useState('');
    const [dataPrevisaoEntrega, setDataPrevisaoEntrega] = useState('');
    const [nrTarefasRealizadas, setNrTarefasRealizadas] = useState('');
    const [nrTarefasTotais, setNrTarefasTotais] = useState('');
    const [valueProgressBar, setValueProgressBar] = useState('');


    const getUserRole = async () => {
        const q = query(collection(db, "users"), where("email", "==", currentUser.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setUserRole(doc.data());
        });
    }

    const openProjectDetails = () => {
        //alert(props.projetos.key);
        Router.push('/details/' + props.projetos.nome);
    }

    useEffect(() => {

        getUserRole();
        getValoresToTarefas();

    }, []);

    const getValoresToTarefas = async () => {
        setDataInicioProjeto(new Date(props.projetos.dataInicio.seconds * 1000).toLocaleDateString('pt-PT'));
        setDataPrevisaoEntrega(new Date(props.projetos.previsaoEntrega.seconds * 1000).toLocaleDateString('pt-PT'));
        
        const nrTarefasMax = Math.floor(Math.random() * 10) + 1;
        setNrTarefasTotais(nrTarefasMax);
        
        const nrTarefaFeita = Math.floor(Math.random() * nrTarefasMax);
        setNrTarefasRealizadas(nrTarefaFeita);
    
        setValueProgressBar(((nrTarefaFeita / nrTarefasMax) * 100).toFixed(0));

    }


    const contactProjectOwner = () => {
        location.href = 'mailto:' 
        + props.projetos.cliente + 
        '?subject=Projeto: ' 
        + props.projetos.nome + 
        '&body=Olá, gostaria de falar sobre o projeto: ' 
        + props.projetos.nome + ' que está a decorrer.';
    }

    const deleteProjetoFromDB = async () => {
        await deleteDoc(doc(db, "projetos", props.projetos.id));
        toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Projeto eliminado com sucesso', life: 3000 });

        window.location.reload();
    }   


  return (
    <div>
        <Toast ref={toast} />
        <div className="grid-template-card">
            <div className="grid-template-card-top">
                <div className="grid-card-image-text">
                    <img src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" alt="Projeto" />
                    <div className="grid-card-project">
                        <h3>{props.projetos.nome}</h3>
                        <p onClick={contactProjectOwner}>{props.projetos.cliente}</p>
                    </div>
                </div> 
                {
                    userRole.userRole === 'admin' ? 
                    <button className="button button-edit" onClick={openProjectDetails}><i className="pi pi-pencil"></i></button>
                    : null
                }
            </div>
            <div className="grid-template-card-middle">
                <div className="card-middle">
                    <p><i className="pi pi-user"></i><span>{props.projetos.gestor}</span></p>
                    <p><i className="pi pi-clock"></i><span>{dataPrevisaoEntrega}</span></p>
                    <p><i className="pi pi-calendar-times"></i><span>{nrTarefasRealizadas} / {nrTarefasTotais} Tarefas</span></p>
                </div>
            </div>
            <div className="grid-template-card-bottom">
                <div className="card-bottom">
                    <button type='button' className='button button-more' onClick={openProjectDetails}><i className="pi pi-eye"></i><span>Ver Projeto</span></button>
                </div>  
            </div>

            <div className="grid-template-card-progress">
                <div className="card-progress">
                    <ProgressBar value={valueProgressBar}></ProgressBar>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProjetoItem