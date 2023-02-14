import React, { useEffect, useState } from 'react'

import { db } from '../config/Firebase'
import { collection, query, getDocs } from "firebase/firestore";
import XLSX from "xlsx";

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

  // search funcionarios by name, if name is not found, show all funcionarios
  const searchFuncionarios = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredFuncionarios = funcionarios.filter(funcionarios => {
      return (
        funcionarios.name.toLowerCase().includes(searchValue)
      )
    })
    setFuncionarios(filteredFuncionarios);

    // if funcionarios is empty, show all funcionarios
    if (filteredFuncionarios.length === 0 || searchValue === '') {
      setFuncionarios(funcionarios);
    }

  }


  // get number of users in database
  const numFuncionarios = funcionarios.length;

  //function to export Funcionarios to excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(funcionarios);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Funcionarios");
    XLSX.writeFile(wb, "Funcionarios.xlsx");
  }

  return (
    <div>
      <div className='main-title-page'>
        <div className='title-left-side'>
          <h1>Funcionários </h1>
          <span>{numFuncionarios} Funcionários</span>
        </div>
    
        <div className='title-right-side'>
          <input type='text' placeholder='Pesquisar Funcionário' onChange={searchFuncionarios}/>
          
          <button className='btn-export' onClick={exportToExcel}><i className='pi pi-file-excel'></i>Exportar</button>
        </div>
      </div>

      <FuncList funcionarios={funcionarios}/>

    </div>
  )
}

export default Funcionarios