import React, { useEffect, useState } from 'react'
import { useAuthValue } from '../../config/AuthContext'
import { db } from '../../config/Firebase'
import { Dialog } from 'primereact/dialog';
import { useRouter } from 'next/router'

import { collection, query, where, getDocs, deleteDoc, updateDoc } from "firebase/firestore";

function FuncItem(props) {

  const [admin, setAdmin] = useState(false);
  const [userPermitions, setUserPermitions] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleInfo, setVisibleInfo] = useState(false);
  const {currentUser} = useAuthValue();


  const [contacto, setContacto] = useState("");
  const [area, setArea] = useState("");
  const [iban, setIban] = useState("");
  const [nif, setNif] = useState("");
  const [precohora, setPrecohora] = useState("");
  const [userRole, setUserRole] = useState("");
  const [morada, setMorada] = useState("");

  const router = useRouter()

  useEffect(() => {
    const q = query(collection(db, "users"), where("uid", "==", currentUser.uid));
    getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().userRole === "admin") {
          setAdmin(true);
        }

        setFuncionarios(funcionarios => [...funcionarios, doc.data()]);

      });
    });

  }, [currentUser.uid]);

  useEffect(() => {
    if (currentUser.uid === props.funcionarios.uid) {
      setUserPermitions(true);
    }
  }, [currentUser.uid, props.funcionarios.uid]);

  useEffect(() => {	
    setContacto(props.funcionarios.contacto);
    setArea(props.funcionarios.area);
    setIban(props.funcionarios.iban);
    setNif(props.funcionarios.nif);
    setPrecohora(props.funcionarios.precoHora);
    setMorada(props.funcionarios.morada);
    setUserRole(props.funcionarios.userRole);
  }, []);

  const deleteFuncionario = () => {

    const confirmation = window.confirm("Tem a certeza que quer eliminar este funcionário?");
    if (!confirmation) {
      return;
    } else {
      const q = query(collection(db, "users"), where("uid", "==", props.funcionarios.uid));
      getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          deleteDoc(doc.ref);

          //router.reload()

      });
    });
    }      
  }

  const updateSellectedUser = () => {
    const q = query(collection(db, "users"), where("uid", "==", props.funcionarios.uid));
    getDocs(q).then((querySnapshot) => {
      updateDoc(querySnapshot.docs[0].ref, {
        contacto: contacto,
        area: area,
        iban: iban,
        nif: nif,
        precoHora: precohora,
        userRole: userRole,
        morada: morada,
      });
    });
   
  }
  
  const openFile = () => {
    window.open("https://drive.google.com/file/d/16Zzn0vs_mGYfKQ0Eqi-pjBIZ3qndvVWb/view", "_blank");
  }

  return (
    <tr>
      <td>
        <div className='image-text'>
          <img src={`${props.funcionarios.photo}`} alt=""/>
          <div className='image-text-name'>
            <p className='name'>{props.funcionarios.name}</p>
            <p className='email'>{props.funcionarios.email}</p>
          </div>
        </div>
      </td>
      <td className='table-col-userRole'><p>{props.funcionarios.userRole}</p></td>
      <td>{props.funcionarios.area}</td>
      <td>{props.funcionarios.contacto}</td>
      <td>{props.funcionarios.iban}</td>
      <td>
        {admin && ( 
          <div className='table-td-actions'>
            
            <i className='pi pi-pencil editar' onClick={() => setVisible(true)}/>
            <i className='pi pi-info-circle info'onClick={() => setVisibleInfo(true)}/>
            <i className='pi pi-trash excluir' onClick={(e) => deleteFuncionario(e)}/>
          </div>
        ) || (userPermitions && 
          <div className='table-td-actions'>
            <i className='pi pi-pencil editar' onClick={() => setVisible(true)}/>
          </div>)}
      </td>
      <Dialog header={"Editar " + props.funcionarios.name} visible={visible} className="dialog-box" onHide={() => setVisible(false)} draggable={false}>
          <form className="form-edit-funcionario">
          <div className="form-edit-funcionario-divider">
              <div className="form-edit-funcionario-group">
                <label htmlFor="name"><i className='pi pi-user'></i>Nome</label>
                <input type="text" name="name" id="name" value={props.funcionarios.name} disabled readOnly/>
              </div>
              <div className="form-edit-funcionario-group">
                <label htmlFor="email"><i className='pi pi-at'></i>Email</label>
                <input type="email" name="email" id="email" value={props.funcionarios.email} disabled readOnly/>
              </div>
            </div>
            <div className="form-edit-funcionario-group-alone">
                <label htmlFor="morada"><i className='pi pi-map-marker'></i>Morada</label>
                <input type="text" name="morada" id="morada" value={morada} onChange={(e) => setMorada(e.target.value)} required/>
              </div>
            <div className="form-edit-funcionario-divider">
              <div className="form-edit-funcionario-group">
                <label htmlFor="contacto"><i className='pi pi-phone'></i>Contacto</label>
                <input type="number" name="contacto" id="contacto" value={contacto} onChange={(e) => setContacto(e.target.value)} required/>
              </div>
              <div className="form-edit-funcionario-group">
                <label htmlFor="area"><i className='pi pi-wrench'></i>Área de Trabalho</label>
                <input type="text" name="area" id="area" value={area} onChange={(e) => setArea(e.target.value)} required/>
              </div>
            </div>
            <div className="form-edit-funcionario-divider">
              <div className="form-edit-funcionario-group">
                <label htmlFor="iban"><i className='pi pi-credit-card'></i>IBAN</label>
                <input type="text" name="iban" id="iban" value={iban} onChange={(e) => setIban(e.target.value)} required/>
              </div>
              <div className="form-edit-funcionario-group">
                <label htmlFor="nif"><i className='pi pi-id-card'></i>NIF</label>
                <input type="number" name="nif" id="nif" value={nif} onChange={(e) => setNif(e.target.value)} required/>
              </div>
            </div>
            <div className="form-edit-funcionario-divider">
              <div className="form-edit-funcionario-group">
                <label htmlFor="precohora"><i className='pi pi-money-bill'></i>Preço Hora</label>
                {admin && ( 
                    <input type="number" name="precohora" id="precohora" value={precohora} onChange={(e) => setPrecohora(e.target.value)}/>
                  ) || (userPermitions && 
                    <input type="number" name="precohora" id="precohora" value={props.funcionarios.precoHora} disabled readOnly/>
                  )}
                
                
              </div>
              <div className="form-edit-funcionario-group">
                <label htmlFor="userRole"><i className='pi pi-briefcase'></i>Função</label>
                {admin && ( 
                  <select name="userRole" id="userRole" value={userRole} onChange={(e) => setUserRole(e.target.value)}>
                    <option value="admin">Administrador</option>
                    <option value="funcionario">Funcionário</option>
                    <option value="gestor">Gestor</option>
                  </select>
                ) || (userPermitions && 
                  <select name="userRole" id="userRole" value={userRole} onChange={(e) => setUserRole(e.target.value)}> 
                    <option value="funcionario">Funcionário</option>
                  </select>
                )}
              </div>
            </div>
            <div className="form-edit-funcionario-group-button">
              <div className='form-edit-funcionario-buttons'>
                <button type="button" className='btn-save' onClick={updateSellectedUser}><i className="pi pi-check-circle"></i>Validar</button>
                <button type="button" className='btn-cancelar' onClick={() => setVisible(false)}><i className='pi pi-times-circle'></i></button>
                <button type="button" className='btn-download'><i className="pi pi-cloud-download" onClick={() => openFile()}></i> </button>
              </div>
            </div>
          </form>
      </Dialog>
      <Dialog className='dialog-box-info' header={"Informação de " + props.funcionarios.name}  visible={visibleInfo} onHide={() => setVisibleInfo(false)} draggable={false}>
          <div className="dialog-box-info-group">
            <div className="dialog-box-info-group-item">
              <p className="dialog-box-info-group-item-title"><i className='pi pi-user'></i>Nome: </p>
              <p className="dialog-box-info-group-item-value">{props.funcionarios.name}</p>
            </div>
            <div className="dialog-box-info-group-item">
              <p className="dialog-box-info-group-item-title"><i className='pi pi-at'></i>Email: </p>
              <p className="dialog-box-info-group-item-value">{props.funcionarios.email}</p>
            </div>
            <div className="dialog-box-info-group-item">  
              <p className="dialog-box-info-group-item-title"><i className='pi pi-map-marker'></i>Morada: </p>
              <p className="dialog-box-info-group-item-value">{props.funcionarios.morada}</p>
            </div>
            <div className="dialog-box-info-group-item">
              <p className="dialog-box-info-group-item-title"><i className='pi pi-phone'></i>Contacto: </p>
              <p className="dialog-box-info-group-item-value">{props.funcionarios.contacto}</p>
            </div>
            <div className="dialog-box-info-group-item">
              <p className="dialog-box-info-group-item-title"><i className='pi pi-wrench'></i>Área de Trabalho : </p>
              <p className="dialog-box-info-group-item-value">{props.funcionarios.area}</p>
            </div>
            <div className="dialog-box-info-group-item"> 
              <p className="dialog-box-info-group-item-title"><i className='pi pi-credit-card'></i>IBAN: </p>
              <p className="dialog-box-info-group-item-value">{props.funcionarios.iban}</p>
            </div>
            <div className="dialog-box-info-group-item">
              <p className="dialog-box-info-group-item-title"><i className='pi pi-id-card'></i>NIF: </p>
              <p className="dialog-box-info-group-item-value">{props.funcionarios.nif}</p>
            </div>
            <div className="dialog-box-info-group-item">
              <p className="dialog-box-info-group-item-title"><i className='pi pi-money-bill'></i>Preço Hora: </p>
              <p className="dialog-box-info-group-item-value">{props.funcionarios.precoHora} €</p>
            </div>
            <div className="dialog-box-info-group-item">
              <p className="dialog-box-info-group-item-title"><i className='pi pi-briefcase'></i>Cargo: </p>
              <p className="dialog-box-info-group-item-value">{props.funcionarios.userRole}</p>
            </div>
          </div>
      </Dialog>
    </tr>
  );


  
}

export default FuncItem