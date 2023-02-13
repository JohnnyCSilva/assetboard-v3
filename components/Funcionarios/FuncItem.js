import React, { useEffect, useState } from 'react'
import { useAuthValue } from '../../config/AuthContext'
import { db } from '../../config/Firebase'

import { collection, query, where, getDocs,  } from "firebase/firestore";

function FuncItem(props) {

  const [admin, setAdmin] = useState(false);
  const [userPermitions, setUserPermitions] = useState(false);

  //get the current route path and pass it to the funcionario_edit component
  const routeChange = () => {
    let path = `/funcionario_edit/${props.funcionarios.id}`;
    props.history.push(path);
  }

  const {currentUser} = useAuthValue();

  // get the current user role and check if it is admin
  useEffect(() => {

    const q = query(collection(db, "users"), where("uid", "==", currentUser.uid));
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().userRole === "admin") {
          setAdmin(true);
        }
      });
    });

  }, [currentUser.uid]);

  //if currentuser.uid is equal to funcionario.id, set userPermitions to true and show the edit button
  useEffect(() => {
    if (currentUser.uid === props.funcionarios.uid) {
      setUserPermitions(true);
    }
  }, [currentUser.uid, props.funcionarios.uid]);

  return (
    <tr>
      <td width="20%">
        <div className='image-text'>
          <img src={`${props.funcionarios.photo}`} alt=""/>
          <div className='image-text-name'>
            <p className='name'>{props.funcionarios.name}</p>
            <p className='email'>{props.funcionarios.email}</p>
          </div>
        </div>
      </td>
      <td width="15%" className='table-col-userRole'><p>{props.funcionarios.userRole}</p></td>
      <td width="15%">{props.funcionarios.area}</td>
      <td width="15%">+351 91x xxx xxx{props.funcionarios.contacto}</td>
      <td width="15%">PT50 5000 1234 1234 12{props.funcionarios.iban}</td>
      <td width="10%">
        {admin && ( 
          <div className='table-td-actions'>
            <i className='pi pi-pencil editar' onClick={(e) => routeChange(e)}/>
            <i className='pi pi-trash excluir'/>
          </div>
        ) || (userPermitions && <div className='table-td-actions'><i className='pi pi-file-edit editar' onClick={(e) => routeChange(e)}/></div>)}
      </td>
    </tr>
  );


  
}

export default FuncItem