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

  }, [currentUser.email]);

  //if currentuser.uid is equal to funcionario.id, set userPermitions to true and show the edit button
  useEffect(() => {
    if (currentUser.uid === props.funcionarios.uid) {
      setUserPermitions(true);
    }
  }
  , [currentUser.uid, props.funcionarios.uid]);

  return (
    <tr>
      <td>
        <div className='image-text'>
          <img src={`${props.funcionarios.photo}`} alt=""/>
          <p>{props.funcionarios.name}</p>
        </div>
      </td>
      <td>{props.funcionarios.email}</td>
      <td>{props.funcionarios.cargo}</td>
      <td>{props.funcionarios.contacto}</td>
      <td>
        {admin && ( 
          <div className='table-td-actions'>
            <i className='pi pi-file-edit editar' onClick={(e) => routeChange(e)}/>
            <i className='pi pi-times-circle excluir'/>
          </div>
        ) || (userPermitions && <div className='table-td-actions'><i className='pi pi-file-edit editar' onClick={(e) => routeChange(e)}/></div>)}
      </td>
    </tr>
  );


  
}

export default FuncItem