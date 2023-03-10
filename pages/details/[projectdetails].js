import React, { useState, useEffect, useContext, useRef} from 'react'
import { useRouter } from 'next/router';

import { db } from '../../config/Firebase'
import { collection, query, getDocs, updateDoc, where, addDoc, orderBy, deleteDoc, doc, arrayUnion } from "firebase/firestore";
import { AuthContext } from '../../config/AuthContext';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { MultiSelect } from 'primereact/multiselect';
import FuncionariosProjeto from '../../components/Projetos/FuncionariosProjeto'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function productDetails() {

    const router = useRouter();
    const key = router.query.projectdetails;
    const { currentUser } = useContext(AuthContext);
    const toast = useRef(null);

    const [ detalhesProjeto, setDetalhesProjeto ] = useState([]);
    const [ funcionarios, setFuncionarios ] = useState([]);
    const [ adicionarFuncionario, setAdicionarFuncionario ] = useState(false);
    const [ funcionarioSelecionado, setFuncionarioSelecionado ] = useState([]);
    const [ funcionariosProjeto, setFuncionariosProjeto ] = useState([]);
    const [ despesas, setDespesas ] = useState([]);
    const [ totalDespesas, setTotalDespesas ] = useState(0);


    const getProjectDetails = async () => {

        setDetalhesProjeto([]);   

        const q = query(collection(db, "projetos"), where("nome", "==", key));
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
        });       
    }

    const getDespesas = async () => {

        //get all despesas from db with projectID = key
        const despesas = [];
        const q = query(collection(db, "despesas"), where("projetoId", "==", key));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const despesa = doc.data();
            despesas.push(despesa);
        }
        );

        //if despesa is profissional, add to despesa else dont add
        const despesasFiltradas = [];
        despesas.forEach((despesa) => {
            if(despesa.tipoDespesa === 'Profissional') {
                despesasFiltradas.push(despesa);
            }
        }
        );


        setDespesas(despesasFiltradas);        

        //get total despesas
        let total = 0;
        despesas.forEach((despesa) => {
            total += despesa.valor;
        }
        );
        setTotalDespesas(total);
        
    }
    const getAllFuncionarios = async () => {
        const funcionarios = [];
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            if(doc.data().userRole != 'admin') {
                funcionarios.push({label: doc.data().displayName, value: doc.data().uid})
            }
        });
        setFuncionarios(funcionarios);
    }
    const addFuncionarioToProject = async () => {

        const q = query(collection(db, "projetos"), where("nome", "==", key));
        const querySnapshot = getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                updateDoc(doc.ref, {
                    funcionarios: arrayUnion(...funcionarioSelecionado)
                });
            });
        });

        toast.current.show({severity:'success', summary: 'Sucesso', detail:'Funcionário adicionado com sucesso', life: 3000});
        setAdicionarFuncionario(false);
        getProjectDetails();


      
    }
    useEffect(() => {
        getProjectDetails();
        getAllFuncionarios();
        getDespesas();
    }, [])
    const formatDate = (value) => {
        if (value) {
            let date = new Date(value.seconds * 1000);
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            return day + '/' + month + '/' + year;
        }
    };
    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.dataDespesa);
    };
    const priceBodyTemplate = (despesas) => {
        return formatCurrency(despesas.valor);
    };
    const formatCurrency = (value) => {
        return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
    };
    const statusBodyTemplate = (rowData) => {

        return (rowData.estado === 'Aprovado' ? <span className='estado-aprovado-pedidos'>{rowData.estado}</span> 
        : rowData.estado === 'Rejeitado' ? <span className='estado-rejeitado-pedidos'>{rowData.estado}</span>
        : rowData.estado === 'Pendente' ? <span className='estado-pendente-pedidos'>{rowData.estado}</span>
        : null
        );
        
    };

    //if funcionariosProjeto is not empty, map through it and return funcionariosProjeto component

    const funcionariosProjetoMap = funcionariosProjeto?.map((label) => {
        return (
            <FuncionariosProjeto
                funcionario={label}
                key={label}
                detalhesProjetoKey={detalhesProjeto.key}
            />   
            )
        })

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
                            <div className='funcionarios-projeto-list'>
                                {funcionariosProjetoMap}
                            </div>
                        </div>
                    </div>
                    <div className='despesas-projeto'>
                        <div className='despesas-projeto-title'>
                            <h2>Despesas do Projeto</h2>
                        </div>

                        <div className='despesas-projeto-content'>
                            <DataTable value={despesas}
                             paginator rows={10} rowsPerPageOptions={[10, 20, 50]}
                             className="table-pedidos"
                             responsiveLayout="scroll"
                             emptyMessage="Sem despesas do projeto">
                                <Column field="funcionario" header="Funcionário"></Column>
                                <Column field="valor" header="Valor" body={priceBodyTemplate}></Column>
                                <Column field="data" header="Data" body={dateBodyTemplate}></Column>
                                <Column field="estado" header="Estado" body={statusBodyTemplate}></Column>
                            </DataTable>
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
                    <div className='financeiro-projeto'>   
                        <div className='financeiro-projeto-title'>
                            <h3>Dados Financeiros</h3>
                        </div>
                        <div className='financeiro-projeto-content'>
                            <div className='financeiro-projeto-content-item'>
                                <i className='pi pi-money-bill'></i>
                                <div className='financeiro-item-text'>
                                    <span>Total Despesas</span>
                                    <p>{totalDespesas} €</p>
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
                            <MultiSelect 
                            value={funcionarioSelecionado} 
                            options={funcionarios} 
                            onChange={(e) => setFuncionarioSelecionado(e.value)} 
                            optionLabel="label"
                            display="chip"/>
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