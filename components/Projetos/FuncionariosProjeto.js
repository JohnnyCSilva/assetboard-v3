import React, { useState } from 'react'
import { useEffect } from 'react';

import { db } from '../../config/firebase';
import { collection, query, getDocs, updateDoc, where, addDoc, orderBy, deleteDoc, getDoc, doc } from "firebase/firestore";


function FuncionariosProjeto(props) {

    const { funcionario, detalhesProjetoKey } = props;

    const [ funcionarioDetails, setFuncionarioDetails ] = useState([]);
    const [ detalhesProjeto, setDetalhesProjeto ] = useState([]);


    //Get funcionario details from db
    const getFuncionarioDetails = async () => {

        console.log(props)

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
    }, [])

    //delete funcionario from project
    const deleteFuncionario = async (funcionario) => {
        const funcionarios = detalhesProjeto.funcionarios;
        const index = funcionarios.indexOf(funcionario);
        if (index > -1) {
          funcionarios.splice(index, 1);
        }
        const docRef = doc(db, "projetos", detalhesProjetoKey);
        try {
          await updateDoc(docRef, {
            funcionarios: funcionarios
          });
        } catch (error) {
          console.log(error.message);
        }
        //window.location.reload();
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
                    {
                    //delete funcionario from project
                    }
                    <button type="button" className='button button-delete' onClick={() => deleteFuncionario(funcionarioDetails.uid)}><i className="pi pi-trash"></i></button>
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