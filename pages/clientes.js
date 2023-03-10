import React, { useState, useEffect, useRef, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import {getDocs,collection,addDoc,deleteDoc,query,where,updateDoc} from "firebase/firestore";
import { db } from "../config/Firebase";
import { Toast } from "primereact/toast";
import { AuthContext } from "../config/AuthContext";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { ConfirmDialog } from "primereact/confirmdialog";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputMask } from "primereact/inputmask";
import Clienteslist from "../components/ClientesConfig/ClientesList";
import ClientesItem from "@/components/ClientesConfig/ClientesItem";
import { confirmDialog } from "primereact/confirmdialog";

function clientes(props) {
  const { currentUser } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [clientesDialog, setClientesDialog] = useState(false);
  const [nome, setNome] = useState("");
  const [morada, setMorada] = useState("");
  const [email, setEmail] = useState("");
  const [contacto, setContacto] = useState("");
  const [iban, setIban] = useState("");
  const [nif, setNif] = useState("");
  const toast = useRef(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const dt = useRef(null);

  const [filters, setFilters] = useState(null);
  const [search, setSearch] = useState("");

  const [getCliente, setGetCliente] = useState(false);

  const [displayEdit, setDisplayEdit] = useState(false);
  const [visibleInfo, setVisibleInfo] = useState(false);

  const resetCliente = () => {
    setNome("");
    setMorada("");
    setEmail("");
    setContacto("");
    setIban("");
    setNif("");
};


  useEffect(() => {
    getClientes();
  }, []);

  async function getClientes() {
    setClientes([]);

    const querySnapshot = await getDocs(collection(db, "clientes"));
    querySnapshot.forEach((doc) => {
      setClientes((clientes) => [...clientes, doc.data()]);
      setGetCliente(doc.data());
    });
  }

 //check if cliente already exists in database and if exists dont let it to create a new one
  const clienteExists = (nome) => {
    let exists = false;
    clientes.map((cliente) => {
      if (cliente.nome === nome) {
        exists = true;
      }
    });
    return exists;
    
  };


  const registerCliente = () => {

    if (nome === "" || morada === "" || email === "" || contacto === "" || iban === "" || nif === "") {
      toast.current.show({
          severity: "error",
          summary: "Erro",
          detail: "Preencha todos os campos.",
          life: 3000,
      });
      return;
      
  }


  if (!email.includes("@")) {
    toast.current.show({
      severity: "error",
      summary: "Erro",
      detail: "Email inválido.",
      life: 3000,
    });
    return;
  }
  //if cliente already exists in database dont add it and show error message
    if (clienteExists(nome)) {
      toast.current.show({
        severity: "error",
        summary: "Erro",
        detail: "Cliente já existe.",
        life: 3000,
      });
      return;
    }
     
    // register cliente in database
    addDoc(collection(db, "clientes"), {
      key: Math.random().toString(36),
      nome: nome,
      morada: morada,
      email: email,
      contacto: contacto,
      iban: iban,
      nif: nif,
    }).then(() => {
      toast.current.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Cliente adicionado com sucesso.",
        life: 3000,
      });
      setClientesDialog(false);
      resetCliente();
      getClientes([]);
    }
    );
  };

  const [cliente, setCliente] = useState(false);

  const apagarCliente = (clientes) => {
    confirmDialog({
      message: "Tem a certeza que deseja apagar este cliente?",
      header: "Confirmação",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        deleteCliente(clientes);
        

      },
    });
  };

  const deleteCliente = async (clientes) => {
    try{
      deleteProjects(clientes);

      const clienteRef = collection(db, "clientes");
      const q = query(clienteRef, where("key", "==", clientes));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref).then(() => {
          toast.current.show({
            severity: "success",
            summary: "Apagado",
            detail: "Cliente apagado com sucesso.",
            life: 3000,
          });
          setVisible(false);
        });
      });
      getClientes();
    }catch(error){
      console.log(error)
    }

  };
  // get clientes clicked and open dialog

  const [ clienteInfoGet, setClienteInfoGet ] = useState([])

  const getClienteinfo = (clientes) => {

    //alert(clientes)
    setDisplayEdit(true);
    setClienteInfoGet([])

    const clienteRef = collection(db, "clientes");
    const q = query(clienteRef, where("key", "==", clientes));
    const querySnapshot = getDocs(q)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setClienteInfoGet(doc.data());
        });
      })


    
  };

  const handleSubmit = () => {
    const newcliente = {
      ...clientes,
      morada: morada || cliente.morada,
      email: email || cliente.email,
      contacto: contacto || cliente.contacto,
      iban: iban || cliente.iban,
      nif: nif || cliente.nif,
    };

    const q = query(
      collection(db, "clientes"),
      where("nome", "==", getCliente.nome)
    );
    const querySnapshot = getDocs(q)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, newcliente);
        });
      })
      .then(() => {
        toast.current.show({
          severity: "success",
          summary: "Atualizado",
          detail: "Campos atualizados com sucesso.",
          life: 3000,
        });
      });

    setClientes([]);
    getClientes();
    setDisplayEdit(false);
    

  };

 //delete all projects from database that have the cliente that is being deleted
  const deleteProjects = async (clientes) => {
    const projectRef = collection(db, "projetos");
    const getProject = query(projectRef, where("cliente", "==", clientes));
    const ProjectSnapShot = await getDocs(getProject);
    ProjectSnapShot.forEach((doc) => {
      console.log(doc.data());
       deleteDoc(doc.ref);
    });
  };





  return (
    <div>
      <Toast ref={toast} />
      <div className="page-title">
        <div className="title-left-side">
          <h1>Clientes</h1>
        </div>
        <div className="title-right-side">
          <button
            className="button button-add"
            onClick={() => setClientesDialog(true)}
          >
            <i className="pi pi-plus-circle"></i>
            <span>Adicionar Cliente</span>
          </button>
        </div>
      </div>

      <div className="title-right-side">
        <Dialog
          header="Adicionar Cliente"
          visible={clientesDialog}
          onHide={() => setClientesDialog(false)}
        >
          <form className="form-dialog">
            <div className="form-flex">
              <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <InputText
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
            </div>

            <div className="form-flex">
              <div className="form-group">
                <label htmlFor="morada">Morada</label>
                <InputTextarea
                  autoResize
                  value={morada}
                  onChange={(e) => setMorada(e.target.value)}
                  rows={5}
                  cols={30}
                />
              </div>
            </div>

            <div className="form-flex">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <InputText
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="form-flex">
              <div className="form-group">
                <label htmlFor="contacto">Contacto</label>
                <InputNumber
                  value={contacto}
                  onValueChange={(e) => setContacto(e.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="nif">Nif</label>
                <InputNumber
                  value={nif}
                  onValueChange={(e) => setNif(e.value)}
                />
              </div>
            </div>
            <div className="form-flex">
              <div className="form-group">
                <label htmlFor="iban">Iban</label>
                <InputMask
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  mask="PT50-9999-9999-9999-9999-9999-9"
                />
              </div>
            </div>
            <div className="form-flex-buttons">
              <div className="form-buttons">
                <button
                  type="button"
                  onClick={registerCliente}
                  className="button button-save"
                >
                  <i className="pi pi-plus-circle"></i>
                  <span>Adicionar</span>
                </button>
              </div>
            </div>
          </form>
        </Dialog>
        <Dialog
          header="Editar Cliente"
          visible={displayEdit}
          onHide={() => setDisplayEdit(false)}
        >
          <form className="form-dialog">
            <div className="form-flex">
              <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <InputText
                  defaultValue={clienteInfoGet.nome}
                  disabled
                />
              </div>
            </div>
            <div className="form-flex">
              <div className="form-group">
                <label htmlFor="morada">Morada</label>
                <InputTextarea
                  autoResize
                  defaultValue={clienteInfoGet.morada}
                  onChange={(e) => setMorada(e.target.value)}
                  rows={5}
                  cols={30}
                />
              </div>
            </div>
            <div className="form-flex">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <InputText
                  type="email"
                  defaultValue={clienteInfoGet.email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="form-flex">
              <div className="form-group">
                <label htmlFor="contacto">Contacto</label>
                <InputNumber
                  
                  defaultValue={clienteInfoGet.contacto}
                  onValueChange={(e) => setContacto(e.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="nif">Nif</label>
                <InputNumber
                  
                  defaultValue={clienteInfoGet.nif}
                  onValueChange={(e) => setNif(e.target.value)}
                />
              </div>
            </div>
            <div className="form-flex">
              <div className="form-group">
                <label htmlFor="iban">Iban</label>
                <InputMask
                  
                  defaultValue={clienteInfoGet.iban}
                  onChange={(e) => setIban(e.value)}
                  mask="PT50-9999-9999-9999-9999-9999-9"
                />
              </div>
            </div>
            <div className="form-flex-buttons">
              <div className="form-buttons">
                <button
                  type="button"
                  className="button button-save"
                  onClick={handleSubmit}
                >
                  <i className="pi pi-save"></i>
                  <span>Guardar</span>
                </button>
              </div>
            </div>
          </form>
        </Dialog>
      </div>

      <ConfirmDialog />

      <div className="page-content">
        <div className="search-box">
          <i className="pi pi-search"></i>
          <input
            type="text"
            placeholder="Pesquisar Cliente"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="grid">
        <div className="grid-box">
          <div className="grid-template-column">
            {clientes
              .filter((item) => {
                return search.toLowerCase() === ""
                  ? item
                  : item.nome.toLowerCase().includes(search) ||
                      item.email.toLowerCase().includes(search);
              })
              .map((clientes, key) => (
                <div className="grid-template-card" key={key}>
                  <div className="grid-template-card-top">
                    <div className="grid-card-image-text">
                      <img
                        src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png"
                        alt="Projeto"
                      />
                      <div className="grid-card-project">
                        <h3>{clientes.nome}</h3>
                        <p>
                          <i className="pi pi-at"></i>
                          <span>{clientes.email}</span>
                        </p>
                      </div>
                    </div>
                    <div className="grid-card-actions">
                      <button
                        type="button"
                        className="button button-edit"
                        onClick={() => getClienteinfo(clientes.key)}
                      >
                        <i className="pi pi-pencil"></i>
                      </button>
                      <button
                        type="button"
                        className="button button-delete"
                        onClick={() => apagarCliente(clientes.key)}
                      >
                        <i className="pi pi-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div className="grid-template-card-middle">
                    <div className="card-middle">
                      <p>
                        <i className="pi pi-phone"></i>
                        <span>{clientes.contacto}</span>
                      </p>
                      <p>
                        <i className="pi pi-id-card"></i>
                        <span>{clientes.nif}</span>
                      </p>
                      <p>
                        <i className="pi pi-credit-card"></i>
                        <span>{clientes.iban}</span>
                      </p>
                      <p>
                        <i className="pi pi-map-marker"></i>
                        <span>{clientes.morada}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default clientes;
