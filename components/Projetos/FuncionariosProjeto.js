import React, { useState } from 'react'
import { useEffect } from 'react';
import { db } from '../../config/Firebase'
import { collection, query, getDocs, updateDoc, where, addDoc, orderBy, deleteDoc } from "firebase/firestore";


function FuncionariosProjeto(props) {

    const [ funcionarioDetails, setFuncionarioDetails ] = useState([]);

    //Get funcionario details from db
    const getFuncionarioDetails = async () => {

        console.log(props)

        const q = query(collection(db, "users"), where("displayName", "==", props.funcionario));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const funcionarioDetails = doc.data();
            setFuncionarioDetails(funcionarioDetails);
        });
    }

    useEffect (() => {
        getFuncionarioDetails();
    }, [])

    //delete funcionario from project
    const deleteFuncionario = async () => {
        const q = query(collection(db, "projetos"), where("key", "==", props.key));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const funcionariosProjeto = doc.data().funcionarios;
            const index = funcionariosProjeto.indexOf(props.funcionario);
            funcionariosProjeto.splice(index, 1);
            updateDoc(doc.ref, {
                funcionarios: funcionariosProjeto
            })
        });

        //get project details again
        props.getProjectDetails();

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
                    <button type="button" className='button button-delete' onClick={deleteFuncionario}><i className="pi pi-trash"></i></button>
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