import React, { useEffect, useState } from 'react'

import { db } from '../config/Firebase'
import { collection, query, where, getDocs } from "firebase/firestore";

import FuncList from '../components/Funcionarios/FuncList'

function Funcionarios() {

  const [funcionarios, setFuncionarios] = useState([]);
    
  useEffect(() => {

    // get users from firebase and set it to customers
    const q = query(collection(db, "users"));
    const querySnapshot = getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setFuncionarios(funcionarios => [...funcionarios, doc.data()]);
        //console.log(doc.data());

      });
    }
    )

  }, [])

  const nameImageTemplate = (rowData) => {
    return (
        <React.Fragment>
            <img src={`${rowData.photo}`} width={30} style={{ verticalAlign: 'middle', borderRadius: '50px', marginRight: "10px" }} />
            <span className="vertical-align-middle ml-2">{rowData.name}</span>
        </React.Fragment>
    );
  }

  return (
    <div>
      <h1> Funcionários </h1>

      <FuncList funcionarios={funcionarios}/>

    </div>
  )
}

export default Funcionarios