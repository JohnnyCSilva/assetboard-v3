import React, { useState, useEffect, useContext, useRef} from 'react'
import { useRouter } from 'next/router';

import { db } from '../../config/Firebase'
import { collection, query, getDocs, updateDoc, where, addDoc, orderBy, deleteDoc } from "firebase/firestore";
import { AuthContext } from '../../config/AuthContext';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { MultiSelect } from 'primereact/multiselect';
import FuncionariosProjeto from '../../components/Projetos/FuncionariosProjeto'

function productDetails() {

    const router = useRouter();
    const key = router.query.projectdetails;
    const { currentUser } = useContext(AuthContext);
    const toast = useRef(null);

    const [ detalhesProjeto, setDetalhesProjeto ] = useState([]);
    const [ funcionarios, setFuncionarios ] = useState([]);
    const [ adicionarFuncionario, setAdicionarFuncionario ] = useState(false);
    const [ funcionarioSelecionado, setFuncionarioSelecionado ] = useState('');
    const [ funcionariosProjeto, setFuncionariosProjeto ] = useState([]);

    //get project details from db
    const getProjectDetails = async () => {

        

        const q = query(collection(db, "projetos"), where("key", "==", key));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const detalhesProjeto = doc.data();
            const dataInicio = new Date(detalhesProjeto.dataInicio.seconds * 1000);
            const dataPrevisaoEntrega = new Date(detalhesProjeto.previsaoEntrega.seconds * 1000);
            const funcionariosProjeto = doc.data().funcionarios;

            detalhesProjeto.dataInicio = dataInicio.toLocaleDateString();
            detalhesProjeto.previsaoEntrega = dataPrevisaoEntrega.toLocaleDateString();

            setDetalhesProjeto(detalhesProjeto);
            setFuncionariosProjeto(funcionariosProjeto);
            console.log(funcionariosProjeto)
        });       
    }

    //get all funcionarios from db to populate dropdown
    const getAllFuncionarios = async () => {
        const funcionarios = [];
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            if(doc.data().userRole != 'admin') {
                funcionarios.push({label: doc.data().displayName, value: doc.data().displayName})
            }
        });
        setFuncionarios(funcionarios);
    }

    //add funcionario to project
    const addFuncionarioToProject = async () => {

        const q = query(collection(db, "projetos"), where("key", "==", key));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            updateDoc(doc.ref, {
                funcionarios: funcionarioSelecionado
            });
        });

        toast.current.show({severity:'success', summary: 'Sucesso', detail:'Funcionário adicionado com sucesso', life: 3000});
        setAdicionarFuncionario(false);
        setDetalhesProjeto([]);
        getProjectDetails();
    }

    

    useEffect(() => {
        getProjectDetails();
        getAllFuncionarios();
    }, [])


    return (
        <div>
            <Toast ref={toast} />
            <div className='page-title'>
                <div className='title-left-side'>
                    <h1>Detalhes do Projeto</h1>    
                </div>
                <div className='title-right-side'>
                    <button className='button button-excel' ><i className='pi pi-pencil'></i><span>Editar Detalhes</span></button>
                </div>
            </div>

            <div className='page-content-details'>
                <div className='page-content-left-side'>
                    <div className='detalhes-projeto'>
                        <div className='detalhes-projeto-title'>
                            <h2>Detalhes do Projeto</h2>
                        </div>
                        <div className='detalhes-projeto-content'>
                            <p></p>
                        </div>
                    </div>
                    <div className='funcionarios-projeto'>
                        <div className='funcionarios-projeto-title'>
                            <h2>Funcionários do Projeto</h2>
                            <button className='button button-add' onClick={() => setAdicionarFuncionario(true)}><i className='pi pi-plus-circle'></i></button>
                        </div>
                        <div className='funcionarios-projeto-content'>
                        {
                            funcionariosProjeto && funcionariosProjeto.length > 0 ?
                            <div className='funcionarios-projeto-list'>
                            {funcionariosProjeto.map((label) => (
                                <FuncionariosProjeto
                                funcionario={label}
                                key={label}
                                //detalhesProjetoKey={detalhesProjeto.key}
                              />
                            ))}
                            </div>
                        :
                            <p>Nenhum funcionário adicionado</p>
                        }

                        </div>
                    </div>
                </div>
                <div className='page-content-right-side'>
                    <div className='detalhes-projeto'>
                        <div className="detalhes-projeto-title">
                            <h3>Informações do Projeto</h3>
                        </div>
                        <div className='detalhes-projeto-content'>
                            <div className='detalhes-projeto-content-item'>
                                <i className='pi pi-wrench'></i>
                                <div className='detalhes-item-text'>
                                    <span>Nome do Projeto</span>
                                    <p>{detalhesProjeto.nome}</p>
                                </div>
                            </div>
                            <div className='detalhes-projeto-content-item'>
                                <i className='pi pi-calendar'></i>
                                <div className='detalhes-item-text'>
                                    <span>Data de Inicio</span>
                                    <p>{detalhesProjeto.dataInicio}</p>
                                </div>
                            </div>
                            <div className='detalhes-projeto-content-item'>
                                <i className='pi pi-calendar'></i>
                                <div className='detalhes-item-text'>
                                    <span>Previsão de Entrefa</span>
                                    <p>{detalhesProjeto.previsaoEntrega}</p>
                                </div>
                            </div>
                            <div className='detalhes-projeto-content-item'>
                                <i className='pi pi-at'></i>
                                <div className='detalhes-item-text'>
                                    <span>Contacto</span>
                                    <p>{detalhesProjeto.cliente}</p>
                                </div>
                            </div>
                            <div className='detalhes-projeto-content-item'>
                                <i className='pi pi-user'></i>
                                <div className='detalhes-item-text'>
                                    <span>Gestor de Obra</span>
                                    <p>{detalhesProjeto.gestor}</p>
                                </div>
                            </div>
                        </div>
                    </div>        
                </div>
            </div>
            
            <Dialog header="Adicionar Funcionário" visible={adicionarFuncionario}  className='dialog-faltas' onHide={() => setAdicionarFuncionario(false)}>

                <form className='form-dialog'>
                    <div className='form-flex'>
                        <div className='form-group'>
                            <label htmlFor='obs'>Selecione os Funcionários</label>
                            <MultiSelect value={funcionarioSelecionado} options={funcionarios} onChange={(e) => setFuncionarioSelecionado(e.value)} optionLabel="label" />
                        </div>
                    </div>
                    <div className='form-flex-buttons'>
                        <div className="form-buttons">
                            <button type="button" className='button button-save' onClick={addFuncionarioToProject}><i className='pi pi-check-circle'></i><span>Registar</span></button>
                        </div>
                    </div>
                </form>

            </Dialog>
        </div>

    )
}

export default productDetails