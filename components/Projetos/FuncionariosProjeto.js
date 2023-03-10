import React, { useState } from 'react'
import { useEffect } from 'react';

import { db } from '../../config/firebase';
import { collection, query, getDocs, updateDoc, where, addDoc, orderBy, deleteDoc, getDoc, doc, arrayRemove  } from "firebase/firestore";


function FuncionariosProjeto(props) {

    const { funcionario, detalhesProjetoKey } = props;

    const [ funcionarioDetails, setFuncionarioDetails ] = useState([]);
    const [ detalhesProjeto, setDetalhesProjeto ] = useState([]);
    const [ docId, setDocId ] = useState([]);


    //Get funcionario details from db
    const getFuncionarioDetails = async () => {

        const q = query(collection(db, "users"), where("uid", "==", funcionario));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const funcionarioDetails = doc.data();
            setFuncionarioDetails(funcionarioDetails);
        });
    }

    //query db project details on page load
    const getProjectDetails = async () => {
        const q = query(collection(db, "projetos"), where("key", "==", detalhesProjetoKey));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const detalhesProjeto = doc.data();
            setDetalhesProjeto(detalhesProjeto);
        });
    }

    useEffect (() => {
        getFuncionarioDetails();
        getProjectDetails();
        getDocName();
    }, [])

    //get current document Name from db
    const getDocName = async () => {
        const q = query(collection(db, "projetos"), where("key", "==", detalhesProjetoKey));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const docName = doc.id;
            setDocId(docName);
        });
    }



    const deleteFuncionarioFromProject = async (funcionarioKey) => {

        const docRef = doc(db, "projetos", docId);
        await updateDoc(docRef, {
            funcionarios: arrayRemove(funcionarioKey)
        });

        window.location.reload();
    }
    
      
  return (
    <div>
        <div className="grid-membros-projeto">
            <div className="membro-card-projeto">
                <div className="membro-card-title">
                    <div>
                        <img src='https://cdn-icons-png.flaticon.com/512/149/149071.png'/>
                        <h3>{funcionarioDetails.displayName}</h3>
                    </div>
                    <button type="button" className='button button-delete' onClick={() => deleteFuncionarioFromProject(funcionarioDetails.uid)}><i className="pi pi-trash"></i></button>
                </div>
                <div className="membro-card-info">
                    <p><i className="pi pi-wrench"></i><span>{funcionarioDetails.userRole}</span></p>
                    <p><i className="pi pi-phone"></i><span>{funcionarioDetails.contacto}</span></p>
                    <p><i className="pi pi-at"></i><span>{funcionarioDetails.email}</span></p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default FuncionariosProjeto