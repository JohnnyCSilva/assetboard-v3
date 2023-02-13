import React, { useEffect, useState } from 'react'

import { db } from '../config/Firebase'
import { collection, query, getDocs } from "firebase/firestore";

import FuncList from '../components/Funcionarios/FuncList'

function Funcionarios() {

  const [funcionarios, setFuncionarios] = useState([]);


    
  useEffect(() => {

    const q = query(collection(db, "users"));
    const querySnapshot = getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setFuncionarios(funcionarios => [...funcionarios, doc.data()]);
      });
    }
    )

  }, [])

  // get number of users in database
  const numFuncionarios = funcionarios.length;

  //function to export data to excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(funcionarios);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Funcionários");
    XLSX.writeFile(wb, "Funcionários.xlsx");
  }

  //function to add new user
  const addNewUser = () => {
    console.log('add new user')
  }

  return (
    <div>
      <div className='main-title-page'>
        <div className='title-left-side'>
          <h1>Funcionários </h1>
          <span>{numFuncionarios} Funcionários</span>
        </div>

        <div className='title-right-side'>
          <button className='btn-add'><i className='pi pi-plus-circle'></i>Adicionar</button>
          <button className='btn-export' onClick={exportToExcel}><i className='pi pi-file-excel'></i>Exportar</button>
        </div>
      </div>

      <FuncList funcionarios={funcionarios}/>

    </div>
  )
}

export default Funcionarios