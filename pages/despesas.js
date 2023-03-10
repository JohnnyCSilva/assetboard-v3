import React, { useState, useEffect, useContext, useRef} from 'react'

import { db } from '../config/Firebase'
import { collection, query, getDocs, updateDoc, where, addDoc, orderBy, deleteDoc } from "firebase/firestore";
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { AuthContext } from '../config/AuthContext';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'; 
import { Calendar } from 'primereact/calendar';       

function despesas() {

    const dt = useRef(null);
    const toast = useRef(null);
    const { currentUser } = useContext(AuthContext);
    const [ despesas, setDespesas ] = useState([]);
    const [ displayBasic, setDisplayBasic ] = useState(false);
    const [ tipoDespesa, setTipoDespesa ] = useState('Pessoal');
    const [ filters, setFilters ] = useState(null);
    const [ selectedDespesa, setSelectedDespesa ] = useState([]);
    const [ description, setDescription ] = useState([]);
    const [ globalFilterValue, setGlobalFilterValue ] = useState('');
    const [ valor, setValor ] = useState([]);
    const [ projetos, setProjetos ] = useState([]);
    const [ selectedProjeto, setSelectedProjeto ] = useState([]);
    const [ displayEdit, setDisplayEdit ] = useState(false);
    const [ selectedEstado, setSelectedEstado ] = useState(null);
    const [ role, setRole ] = useState('');
    const [ date, setDate ] = useState(null);    
    const [ dataDespesa, setDataDespesa ] = useState(null);
    
    const maxDate = new Date();

    const despesasPessoais = [
        {label: 'Alojamento', value: 'alojamento'},
        {label: 'Alimentação', value: 'alimentacao'},
        {label: 'Saude', value: 'saude'},
        {label: 'Outros', value: 'outros'},
    ]
    const despesasProfissionais = [
        {label: 'Combustivel', value: 'combustivel'},
        {label: 'Alimentação', value: 'alimentacao'},
        {label: 'Transporte', value: 'transporte'},
        {label: 'Alojamento', value: 'alojamento'},
        {label: 'Material', value: 'material'},
        {label: 'Outros', value: 'outros'},
    ]
    const estados = [
        { name: 'Aprovado', code: 'Aprovado' },
        { name: 'Rejeitado', code: 'Rejeitado' },
        { name: 'Pendente', code: 'Pendente' }
    ];

    const [ funcionarios, setFuncionarios ] = useState([]);
    const [ selectedFuncionario, setSelectedFuncionario ] = useState([]);
    
    const [ depesasPessoais, setDespesasPessoais ] = useState(0);
    const [ depesasProfissionais, setDespesasProfissionais ] = useState(0);
    const [ despesasTotal, setDespesasTotal ] = useState(0);
    const [ despesa, setDespesa ] = useState(false);

    const getDespesas = async () => {
        //get despesas from db and map project id to project name
        const despesas = [];
        const q = query(collection(db, "despesas"), orderBy("dataDespesa", "desc"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            despesas.push(doc.data());
        });

        setDespesas(despesas);

        let totalDespesas = 0;
        //if despesa is approved add to total despesas
        despesas.map((despesa) => {
            if(despesa.estado === 'Aprovado') {
                totalDespesas += despesa.valor;
            }
        })
        totalDespesas = Math.round(totalDespesas * 100) / 100;
        setDespesasTotal(totalDespesas);

        let totalDespesasPessoais = 0;
        //if despesa is approved and despesa is pessoal add to total despesasPessoais
        despesas.map((despesa) => {
            if(despesa.estado === 'Aprovado' && despesa.tipoDespesa === 'Pessoal') {
                totalDespesasPessoais += despesa.valor;
            }
        })
        totalDespesasPessoais = Math.round(totalDespesasPessoais * 100) / 100;
        setDespesasPessoais(totalDespesasPessoais);

        let totalDespesasProfissionais = 0;
        despesas.map((despesa) => {
            if(despesa.estado === 'Aprovado' && despesa.tipoDespesa === 'Profissional') {
                totalDespesasProfissionais += despesa.valor;
            }
        })
        totalDespesasProfissionais = Math.round(totalDespesasProfissionais * 100) / 100;
        setDespesasProfissionais(totalDespesasProfissionais);

    }
    const getUserRole = async () => {
        const q = query(collection(db, "users"), where("email", "==", currentUser.email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            setRole(doc.data().userRole);
        });
    }
    const getFuncionarios = async () => {
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
    const getProjetos = async () => {
        const projetos = [];
        const q = query(collection(db, "projetos"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            projetos.push({label: doc.data().nome, value: doc.data().nome})
        });
        setProjetos(projetos);
    }
    useEffect(() => {
        getFuncionarios();
        getDespesas();
        getUserRole();
        initFilters();
        getProjetos();
    }, [])

    const toggleInsightBox = () => {
        const insightBox = document.getElementById('insight-box');
        const eyeBox = document.getElementById('eye-box');

        insightBox.classList.toggle('hidden');
        eyeBox.classList.toggle('pi-eye-slash');
        eyeBox.classList.toggle('pi-eye');
    }
    
    const addDespesa = async () => {

        if(tipoDespesa === '' || selectedDespesa === '' || valor === '' || selectedProjeto === '' || dataDespesa === '') {
            toast.current.show({severity:'error', summary: 'Erro', detail:'Por favor preencha todos os campos.', life: 3000});
            return;
        }

        const q = query(collection(db, "users"), where("displayName", "==", selectedFuncionario));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.docs.length > 0) {
            const doc = querySnapshot.docs[0];
            const data = doc.data();

            const despesa = {
                key: Math.random().toString(36),
                funcionario: selectedFuncionario,
                funcionarioUid: data.uid,
                tipoDespesa: tipoDespesa,
                selectedDespesa: selectedDespesa,
                outroSelected: description,
                valor: valor,
                projetoId: selectedProjeto,
                estado: 'Aprovado',
                dataDespesa: dataDespesa,
            }

            await addDoc(collection(db, "despesas"), despesa);
        }

        setDisplayBasic(false);

        getDespesas();
        setTipoDespesa('');
        setSelectedDespesa('');
        setDescription('');
        setValor('');
        setSelectedFuncionario('');
        
        toast.current.show({severity:'success', summary: 'Registado', detail:'Despesa registada com sucesso.', life: 3000});
        
    }

    const initFilters = () => {
        setFilters({
            'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
            'funcionario': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'projeto': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'date': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        });
        setGlobalFilterValue('');
    }
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }
    const priceBodyTemplate = (despesas) => {
        return formatCurrency(despesas.valor);
    };
    const formatCurrency = (value) => {
        return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <button type='button' className='button button-edit' onClick={() => editProduct(rowData)}><i className='pi pi-pencil'></i></button>
                <button type='button' className='button button-delete' onClick={() => deleteDespesa(rowData)}><i className='pi pi-trash'></i></button>
            </React.Fragment>
        );
    };
    const editProduct = (rowData) => {
        setDespesa(rowData);
        setDisplayEdit(true);
    }
    const deleteDespesa = async (rowData) => {
        setDespesa(rowData);
        //show confirmation dialog
        confirmDialog({
            message: 'Tem a certeza que deseja apagar esta despesa?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => {
                deletePedido(rowData);
            },
        });

    };
    const exportExcel = () => {
        dt.current.exportCSV();
    };
    const statusBodyTemplate = (rowData) => {

        return (rowData.estado === 'Aprovado' ? <span className='estado-aprovado-pedidos'>{rowData.estado}</span> 
        : rowData.estado === 'Rejeitado' ? <span className='estado-rejeitado-pedidos'>{rowData.estado}</span>
        : rowData.estado === 'Pendente' ? <span className='estado-pendente-pedidos'>{rowData.estado}</span>
        : null
        );
        
    };
    //update despesa to db with estado 
    const updateDespesa = async () => {

        const despesaRef = collection(db, "despesas");
        const q = query(despesaRef, where("key", "==", despesa.key));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            updateDoc(doc.ref, {
                estado: selectedEstado,
            });
        });
        toast.current.show({severity:'success', summary: 'Registado', detail:'Despesa atualizada com sucesso.', life: 3000});
        setDisplayEdit(false);

        getDespesas();
    }
    const deletePedido = async (rowData) => {
        const despesaRef = collection(db, "despesas");
        const q = query(despesaRef, where("key", "==", rowData.key));
        const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                deleteDoc(doc.ref);
            });

        toast.current.show({severity:'success', summary: 'Registado', detail:'Despesa apagada com sucesso.', life: 3000});
        
        setDespesas([]);
        getDespesas();
    }

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
    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy"/>;
    };
    //Role Funcionario ------------------------------------------ 

    const [ displayFuncionarioAdd , setDisplayFuncionarioAdd ] = useState(false)
    const [ despesasIndividuais , setDespesasIndividuais ] = useState([]);
    const [ editDespesaIndividual , setEditDespesaIndividual ] = useState(false);
    const [ projetosCurrentUser , setProjetosCurrentUser ] = useState([]);

    const [ despesasIndividualPessoais, setDespesasIndividualPessoais ] = useState(0);
    const [ despesasIndividualProfissionais, setDespesasIndividualProfissionais ] = useState(0);

    const getDespesasIndividuais = async () => {

        setDespesasIndividuais([]);

        const despesaRef = collection(db, "despesas");
        const q = query(despesaRef, where("funcionarioUid", "==", currentUser.uid, orderBy("dataDespesa", "desc")));
        const querySnapshot = await getDocs(q);
        const despesas = querySnapshot.docs.map(doc => doc.data());

        setDespesasIndividuais(despesas);


        let totalDespesasPessoais = 0;
        //if despesa is approved and despesa is pessoal add to total despesasPessoais
        despesas.map((despesa) => {
            if(despesa.estado === 'Aprovado' && despesa.tipoDespesa === 'Pessoal') {
                totalDespesasPessoais += despesa.valor;
            }
        })
        totalDespesasPessoais = Math.round(totalDespesasPessoais * 100) / 100;
        setDespesasIndividualPessoais(totalDespesasPessoais);

        let totalDespesasProfissionais = 0;
        //if despesa is approved and despesa is pessoal add to total despesasPessoais
        despesas.map((despesa) => {
            if(despesa.estado === 'Aprovado' && despesa.tipoDespesa === 'Profissional') {
                totalDespesasProfissionais += despesa.valor;
            }
        })
        totalDespesasProfissionais = Math.round(totalDespesasProfissionais * 100) / 100;
        setDespesasIndividualProfissionais(totalDespesasProfissionais);

        //transform timestamp to date   
        despesas.map((despesa) => {
            despesa.dataDespesa = formatDate(despesa.dataDespesa);
        })

    }
    useEffect(() => {
        getDespesasIndividuais();
        getProjetosUser();
    }, [])

    //get projetos where user is in
    const getProjetosUser = async () => {
        const projetos = [];
        const q = query(collection(db, "projetos"), where("funcionarios", "array-contains", currentUser.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            projetos.push({label: doc.data().nome, value: doc.data().nome})
        });

        setProjetosCurrentUser(projetos);
    }
    const addDespesaFuncionario = async () => {

        //if fields are empty show error
        if(tipoDespesa === '' || selectedDespesa === '' || valor === '' || selectedProjeto === '' || dataDespesa === '') {
            toast.current.show({severity:'error', summary: 'Erro', detail:'Por favor preencha todos os campos.', life: 3000});
            return;
        }
       
        const despesa = {
            key: Math.random().toString(36),
            funcionario: currentUser.displayName || currentUser.name ,
            funcionarioUid: currentUser.uid,
            tipoDespesa: tipoDespesa,
            selectedDespesa: selectedDespesa,
            outroSelected: description,
            valor: valor,
            projetoId: selectedProjeto,
            estado: 'Pendente',
            dataDespesa: dataDespesa,
        }

        //add despesa to project in firestore   

        await addDoc(collection(db, "despesas"), despesa);

        setDisplayFuncionarioAdd(false);

        getDespesas();
        setTipoDespesa('');
        setSelectedDespesa('');
        setDescription('');
        setValor('');
        setSelectedFuncionario('');
        
        getDespesasIndividuais();

        toast.current.show({severity:'success', summary: 'Registado', detail:'Despesa registada com sucesso.', life: 3000});

    }
    const editRowDespesa = (rowData) => {
        return (
            //if estado is pendente show edit button and delete button
            rowData.estado === 'Pendente' ? 
            <React.Fragment>
                <button type='button' className='button button-edit' onClick={() => editDespesaIndi(rowData)}><i className='pi pi-pencil'></i></button>
                <button type='button' className='button button-delete' onClick={() => deleteDespesaIndividual(rowData)}><i className='pi pi-trash'></i></button>
            </React.Fragment> : null
        );  
    };
    const editDespesaIndi = (rowData) => {
        setDespesa(rowData);
        setEditDespesaIndividual(true);
    }
    const updateDespesaIndividual = async () => {
        const despesaRef = collection(db, "despesas");
        const q = query(despesaRef, where("key", "==", despesa.key));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            updateDoc(doc.ref, {
                valor: valor,
            });
        });

        toast.current.show({severity:'success', summary: 'Registado', detail:'Despesa atualizada com sucesso.', life: 3000});
        setEditDespesaIndividual(false);

        getDespesasIndividuais();

    }
    const deleteDespesaIndividual = async (rowData) => {
        setDespesa(rowData);
        //show confirmation dialog
        confirmDialog({
            message: 'Tem a certeza que deseja apagar esta despesa?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => {
                deletePedido(rowData);
            },
        });

        
        getDespesasIndividuais();

    }

    // role === "gestor"

    const [projetosFromGestor, setProjetosFromGestor] = useState([]);
    const [despesasFromProjeto, setDespesasFromProjeto] = useState([]);
    const [despesasGestor, setDespesasGestor] = useState([]);
    const [despesasJoin, setDespesasJoin] = useState([]);
    
    
    useEffect(() => {
        const fetchData = async () => {
          const projetos = await getProjetosGestor();
          const despesasFromProjeto = await getDespesasFromProjeto(projetos);
          const despesasGestor = await getDespesasGestor();
          joinDespesas(despesasFromProjeto, despesasGestor);
        };
        fetchData();
      }, []);
      
      const getProjetosGestor = async () => {
        const projetos = [];
        const q = query(collection(db, "projetos"), where("gestor", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          projetos.push({ label: doc.data().nome, value: doc.data().nome });
        });
        setProjetosFromGestor(projetos);
        return projetos;
      };
      
      const getDespesasFromProjeto = async (projetosFromGestor) => {
        if (!projetosFromGestor || !projetosFromGestor.nome) {
            return;
        }
        const despesas = [];
        const q = query(collection(db, "despesas"), where("projetoId", "==", projetosFromGestor.nome));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          despesas.push(doc.data());
        });
        setDespesasFromProjeto(despesas);
        return despesas;
      };
      
      const getDespesasGestor = async () => {
        const despesas = [];
        const q = query(collection(db, "despesas"), where("funcionarioUid", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          despesas.push(doc.data());
        });
        setDespesasGestor(despesas);
        return despesas;
      };
      
      const joinDespesas = () => {
        if (despesasFromProjeto && despesasGestor) {
          const despesas = despesasFromProjeto.concat(despesasGestor);
          setDespesasJoin(despesas);
        }
      };
      
    if (role === 'admin') {

    return (
    <div>
        <Toast ref={toast} />

        <div className='page-title'>
            <div className='title-left-side'>
                <h1>Despesas</h1>    
            </div>
            <div className='title-right-side'>
                <button className='button button-excel' onClick={exportExcel}><i className='pi pi-file-excel'></i><span>Exportar</span></button>
                <button className='button button-see' onClick={toggleInsightBox}><i className='pi pi-eye-slash' id="eye-box"></i></button>
                <button className='button button-add' onClick={() => setDisplayBasic(true)}><i className='pi pi-plus-circle'></i><span>Adicionar Despesa</span></button>
            </div>
        </div>

        <div className='page-insight' id="insight-box">
            <div className='page-insight-left'>
                <div className='insight-box'>
                    <div className='insight-box-left'>
                        <h3>Despesas Pessoais</h3>
                        <h1>{depesasPessoais}€</h1>
                    </div>
                    <div className='insight-box-right'>
                        <div className="icon-box">
                            <i className="pi pi-shopping-cart"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className='page-insight-center'>
                <div className='insight-box'>
                    <div className='insight-box-left'>
                        <h3>Despesas Profissionais</h3>
                        <h1>{depesasProfissionais}€</h1>
                    </div>
                    <div className='insight-box-right'>
                        <div className="icon-box">
                            <i className="pi pi-wrench"></i>
                        </div>
                    </div>
                   
                </div>
            </div>
            <div className='page-insight-right'>
                <div className='insight-box'>
                    <div className='insight-box-left'>
                        <h3>Total de Despesas</h3>
                        <h1>{despesasTotal}€</h1>
                    </div>
                    <div className='insight-box-right'>
                        <div className="icon-box">
                            <i className="pi pi-money-bill"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className='page-content'>

            <div className='search-box'>
                <i className='pi pi-search'></i>
                <input type="text" placeholder='Pesquisar Funcionario ou Projeto' value={globalFilterValue} onChange={onGlobalFilterChange} />
            </div>

            <div className='table-box'>
                <DataTable 
                ref={dt}
                value={despesas} 
                paginator 
                rows={10} 
                rowsPerPageOptions={[10,20,50]} 
                emptyMessage="Sem dados para mostrar" 
                className="table-pedidos"
                filters={filters}
                responsiveLayout="scroll"
                globalFilterFields={['funcionario', 'projetoId']}
                >   
                    <Column field="funcionario" header="Funcionário"/>
                    <Column field="projetoId" header="Projeto"/>
                    <Column field="tipoDespesa" header="Tipo de Despesa"/>
                    <Column field="selectedDespesa" header="Despesa"/>
                    <Column field="valor" header="Valor" body={priceBodyTemplate} sortable/>
                    <Column field="estado" header="Estado" body={statusBodyTemplate}/>
                    <Column field="dataDespesa" header="Data da Despesa" body={dateBodyTemplate} filterField="date" dataType="date" filter filterElement={dateFilterTemplate}/>
                    <Column body={actionBodyTemplate} exportable={false} style={{ maxWidth: '5rem'}}></Column>
                </DataTable>
            </div>
            
        </div>

        <Dialog header="Adicionar Despesa" visible={displayBasic} className='dialog-faltas' onHide={() => setDisplayBasic(false)}>
            <form className='form-dialog'>
                <label>Tipo de Despesa</label>
                <div className='form-flex'>
                    <div className='form-group-radio'>
                        <RadioButton inputId="despesa1" name="tipoDespesa" value="Pessoal" onChange={(e) => setTipoDespesa(e.value)} checked={tipoDespesa === 'Pessoal'} />
                        <p htmlFor="despesa1">Pessoal</p>
                    </div>
                    <div className='form-group-radio'>
                        <RadioButton inputId="despesa2" name="tipoDespesa" value="Profissional" onChange={(e) => setTipoDespesa(e.value)} checked={tipoDespesa === 'Profissional'}  />
                        <p htmlFor="despesa2">Profissional</p>
                    </div>
                </div>
                <div className='form-flex'>
                {
                 // if tipoDespesa === Pessoal values of dropdown "combustivel, alimentacao, etc"
                    tipoDespesa === 'Pessoal' ? (
                            <div className='form-group'>
                                <label>Tipo de Despesa Pessoal</label>
                                <Dropdown optionLabel="label" optionValue="value" value={selectedDespesa} options={despesasPessoais} onChange={(e) => setSelectedDespesa(e.value)} placeholder="Selecione a Despesa" />
                            </div>
                    ) : (
                            <div className='form-group'>
                                <label>Tipo de Despesa Profissional</label>
                                <Dropdown optionLabel="label" optionValue="value" value={selectedDespesa} options={despesasProfissionais} onChange={(e) => setSelectedDespesa(e.value)} placeholder="Selecione a Despesa" />
                            </div>
                        
                    )
                }

                    <div className='form-group'>
                        <label>Projeto</label>
                        <Dropdown optionLabel="label" optionValue="value" value={selectedProjeto} options={projetos} onChange={(e) => setSelectedProjeto(e.value)} placeholder="Selecione o Projeto" required/>
                    </div>
                </div>

                {

                    //if despesa === outros show input text

                    selectedDespesa === 'outros' ? (
                        <div className='form-flex'>
                            <div className='form-group'>
                                <label>Descrição</label>
                                <InputText id='desc' type='text' className="inputText" value={description} onChange={(e) => setDescription (e.target.value)} />
                            </div>
                        </div>
                    ) : (
                        <></>
                    )

                }
                <div className='form-flex'>
                    <div className='form-group'>
                        <label>Dia da Despesa</label>
                        <Calendar value={date} dateFormat="dd/mm/yy" maxDate={maxDate} onChange={(e) => setDataDespesa(e.value)} showIcon />
                    </div>
                </div>
                
                <div className='form-flex'>
                    <div className='form-group'>
                        <label>Funcionário</label>
                        <Dropdown optionLabel="label" optionValue="value" value={selectedFuncionario} options={funcionarios} onChange={(e) => setSelectedFuncionario(e.value)} placeholder="Selecione o Funcionário" />
                    </div>
                    <div className='form-group'>
                        <label>Valor da Despesa</label>
                        <InputNumber id="valor" value={valor} onValueChange={(e) => setValor(e.value)} mode="currency" currency="EUR" locale="de-DE" />
                    </div>
                </div>

                <div className='form-flex-buttons'>
                    <div className="form-buttons">
                        <button type="button" className='button button-save' onClick={addDespesa}><i className='pi pi-check-circle'></i><span>Registar</span></button>
                    </div>
                </div>
            </form>
        </Dialog> 

        <ConfirmDialog />

        <Dialog header="Editar Despesa" visible={displayEdit} className='dialog-faltas' onHide={() => setDisplayEdit(false)}>
            <form className='form-dialog'>
                <div className='form-flex'>
                    <div className='form-group'>
                        <label>Tipo de Despesa</label>
                        <InputText id='prjeto' type='text' className="inputText" defaultValue={despesa.tipoDespesa} disabled/>
                    </div>
                    <div className='form-group'>
                        <label>Despesa</label>
                        <InputText id='projeto' type='text' className="inputText" defaultValue={despesa.selectedDespesa} disabled/>
                    </div>
                </div>
                <div className='form-flex'>
                    <div className='form-group'>
                        <label>Projeto</label>
                        <InputText id='projeto' type='text' className="inputText" defaultValue={despesa.projeto} disabled/>
                    </div>
                    <div className='form-group'>
                        <label>Funcionário</label>
                        <InputText id='projeto' type='text' className="inputText" defaultValue={despesa.funcionario} disabled/>
                    </div>
                </div>
                <div className='form-flex'>
                    <div className='form-group'>
                        <label>Valor da Despesa</label>
                        <InputText id='projeto' typeo='text' className="inputText" defaultValue={despesa.valor} disabled/>
                    </div>
                    <div className='form-group'>
                        <label>Dia da Despesa</label>
                        <InputText id='projeto' type='text' className="inputText" defaultValue={despesa.dataDespesa} disabled/>
                    </div>
                </div>
                {
                    despesa.despesa != '' ? (
                        <div className='form-flex'>
                            <div className='form-group'>
                                <label>Observações</label>
                                <InputText id='projeto' type='text' className="inputText" defaultValue={despesa.despesa} disabled/>
                            </div>
                        </div>
                    ) : (	
                        <></>
                    )
                }
                <div className='form-flex'>
                    <div className='form-group'>
                        <label>Estado</label>
                        <Dropdown optionLabel="name" optionValue="code" value={selectedEstado} options={estados} onChange={(e) => setSelectedEstado(e.value)} placeholder="Selecione o Estado" />
                    </div>
                </div>
                <div className='form-flex-buttons'>
                    <div className="form-buttons">
                        <button type="button" className='button button-save' onClick={updateDespesa}><i className='pi pi-check-circle'></i><span>Atualizar</span></button>
                    </div>
                </div>
            </form>
        </Dialog>
    </div>
    )
    } else if (role === 'funcionario'){
        return (

            <div>
                <Toast ref={toast} />

                <div className='page-title'>
                    <div className='title-left-side'>
                        <h1>Despesas</h1>    
                    </div>
                    <div className='title-right-side'>
                        <button className='button button-see' onClick={toggleInsightBox}><i className='pi pi-eye-slash' id="eye-box"></i></button>
                        <button className='button button-add' onClick={() => setDisplayFuncionarioAdd(true)}><i className='pi pi-plus-circle'></i><span>Adicionar Despesa</span></button>
                    </div>
                </div>

                <div className='page-insight' id="insight-box">
                    <div className='page-insight-left'>
                        <div className='insight-box'>
                            <div className='insight-box-left'>
                                <h3>Despesas Pessoais</h3>
                                <h1>{despesasIndividualPessoais}€</h1>
                            </div>
                            <div className='insight-box-right'>
                                <div className="icon-box">
                                    <i className="pi pi-shopping-cart"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='page-insight-right'>
                        <div className='insight-box'>
                            <div className='insight-box-left'>
                                <h3>Despesas Profissionais</h3>
                                <h1>{despesasIndividualProfissionais}€</h1>
                            </div>
                            <div className='insight-box-right'>
                                <div className="icon-box">
                                    <i className="pi pi-wrench"></i>
                                </div>
                            </div>
                        
                        </div>
                    </div>
                    
                </div>

                <div className='page-content'>

                    <div className='search-box'>
                        <i className='pi pi-search'></i>
                        <input type="text" placeholder='Pesquisar Projeto' value={globalFilterValue} onChange={onGlobalFilterChange} />
                    </div>

                    <div className='table-box'>
                    <DataTable 
                    ref={dt}
                    value={despesasIndividuais} 
                    paginator 
                    rows={10} 
                    rowsPerPageOptions={[10,20,50]} 
                    emptyMessage="Sem dados para mostrar" 
                    className="table-pedidos"
                    filters={filters}    
                    responsiveLayout="scroll"
                    globalFilterFields={['projeto', 'dataDespesa']}
                    >   
                        <Column field="projetoId" header="Projeto"/>
                        <Column field="tipoDespesa" header="Tipo de Despesa"/>
                        <Column field="selectedDespesa" header="Despesa"/>
                        <Column field="valor" header="Valor" body={priceBodyTemplate} sortable/>
                        <Column field="estado" header="Estado" body={statusBodyTemplate}/>
                        <Column field="dataDespesa" header="Data da Despesa" filterField="date" dataType="date" filter filterElement={dateFilterTemplate}/>
                        <Column body={editRowDespesa} exportable={false} style={{ maxWidth: '5rem'}}></Column>
                    </DataTable>
                    </div>
                </div>

                <Dialog header="Adicionar Despesa" visible={displayFuncionarioAdd} className='dialog-faltas'  onHide={() => setDisplayFuncionarioAdd(false)}>
                    <form className='form-dialog'>
                        <label>Tipo de Despesa</label>
                        <div className='form-flex'>
                            <div className='form-group-radio'>
                                <RadioButton inputId="despesa1" name="tipoDespesa" value="Pessoal" onChange={(e) => setTipoDespesa(e.value)} checked={tipoDespesa === 'Pessoal'} required/>
                                <p htmlFor="despesa1">Pessoal</p>
                            </div>
                            <div className='form-group-radio'>
                                <RadioButton inputId="despesa2" name="tipoDespesa" value="Profissional" onChange={(e) => setTipoDespesa(e.value)} checked={tipoDespesa === 'Profissional'} required/>
                                <p htmlFor="despesa2">Profissional</p>
                            </div>
                        </div>
                        <div className='form-flex'>
                        {
                        // if tipoDespesa === Pessoal values of dropdown "combustivel, alimentacao, etc"
                            tipoDespesa === 'Pessoal' ? (
                                    <div className='form-group'>
                                        <label>Tipo de Despesa Pessoal</label>
                                        <Dropdown optionLabel="label" optionValue="value" value={selectedDespesa} options={despesasPessoais} onChange={(e) => setSelectedDespesa(e.value)} placeholder="Selecione a Despesa" required/>
                                    </div>
                            ) : (
                                    <div className='form-group'>
                                        <label>Tipo de Despesa Profissional</label>
                                        <Dropdown optionLabel="label" optionValue="value" value={selectedDespesa} options={despesasProfissionais} onChange={(e) => setSelectedDespesa(e.value)} placeholder="Selecione a Despesa" required/>
                                    </div>
                                
                            )
                        }

                            <div className='form-group'>
                                <label>Projeto</label>
                                <Dropdown optionLabel="label" optionValue="value" value={selectedProjeto} options={projetosCurrentUser} onChange={(e) => setSelectedProjeto(e.value)} placeholder="Selecione o Projeto" required/>
                            </div>
                        </div>

                        {

                            //if despesa === outros show input text

                            selectedDespesa === 'outros' ? (
                                <div className='form-flex'>
                                    <div className='form-group'>
                                        <label>Descrição</label>
                                        <InputText id='desc' type='text' className="inputText" value={description} onChange={(e) => setDescription (e.target.value)}/>
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )

                        }
                        
                        <div className='form-flex'>
                            <div className='form-group'>
                                <label>Dia da Despesa</label>
                                <Calendar value={date} dateFormat="dd/mm/yy" maxDate={maxDate} onChange={(e) => setDataDespesa(e.value)} showIcon required/>
                            </div>
                            <div className='form-group'>
                                <label>Valor da Despesa</label>
                                <InputNumber id="valor" value={valor} onValueChange={(e) => setValor(e.value)} mode="currency" currency="EUR" locale="de-DE" required/>
                            </div>
                        </div>

                        <div className='form-flex-buttons'>
                            <div className="form-buttons">
                                <button type="button" className='button button-save' onClick={addDespesaFuncionario}><i className='pi pi-check-circle'></i><span>Registar</span></button>
                            </div>
                        </div>
                    </form>
                </Dialog> 

                <ConfirmDialog />

                <Dialog header="Editar Despesa" visible={editDespesaIndividual} className='dialog-faltas' onHide={() => setEditDespesaIndividual(false)}>
                    <form className='form-dialog'>
                        <div className='form-flex'>
                            <div className='form-group'>
                                <label>Tipo de Despesa</label>
                                <InputText id='projeto' type='text' className="inputText" defaultValue={despesa.tipoDespesa} disabled/>
                            </div>
                            <div className='form-group'>
                                <label>Despesa</label>
                                <InputText id='projeto' type='text' className="inputText" defaultValue={despesa.selectedDespesa} disabled/>
                            </div>
                        </div>
                        <div className='form-flex'>
                            <div className='form-group'>
                                <label>Projeto</label>
                                <InputText id='projeto' type='text' className="inputText" defaultValue={despesa.projeto} disabled/>
                            </div>
                            <div className='form-group'>
                                <label>Dia da Despesa</label>
                                <InputText id='despesa' type='text' className="inputText" defaultValue={despesa.dataDespesa} disabled/>
                            </div>
                        </div>
                        
                        {
                            despesa.despesa != '' ? (
                                <div className='form-flex'>
                                    <div className='form-group'>
                                        <label>Observações</label>
                                        <InputText id='projeto' type='text' className="inputText" defaultValue={despesa.despesa} disabled/>
                                    </div>
                                </div>
                            ) : (	
                                <></>
                            )
                        }

                        <div className='form-flex'>
                            <div className='form-group'>
                                <label>Valor da Despesa</label>
                                <InputNumber id="valor" value={valor} onValueChange={(e) => setValor(e.value)} mode="currency" currency="EUR" locale="de-DE" required/>
                            </div>
                        </div>
                        <div className='form-flex-buttons'>
                            <div className="form-buttons">
                                <button type="button" className='button button-save' onClick={updateDespesaIndividual}><i className='pi pi-check-circle'></i><span>Atualizar</span></button>
                            </div>
                        </div>
                    </form>
                </Dialog>
        </div>
        )

    } else if (role === 'gestor'){
        return (
            <div>
                <Toast ref={toast} />
        
                <div className='page-title'>
                    <div className='title-left-side'>
                        <h1>Despesas</h1>    
                    </div>
                    <div className='title-right-side'>
                        <button className='button button-excel' onClick={exportExcel}><i className='pi pi-file-excel'></i><span>Exportar</span></button>
                        <button className='button button-see' onClick={toggleInsightBox}><i className='pi pi-eye-slash' id="eye-box"></i></button>
                        <button className='button button-add' onClick={() => setDisplayBasic(true)}><i className='pi pi-plus-circle'></i><span>Adicionar Despesa</span></button>
                    </div>
                </div>
        
                <div className='page-insight' id="insight-box">
                    <div className='page-insight-left'>
                        <div className='insight-box'>
                            <div className='insight-box-left'>
                                <h3>Despesas Pessoais</h3>
                                <h1>{depesasPessoais}€</h1>
                            </div>
                            <div className='insight-box-right'>
                                <div className="icon-box">
                                    <i className="pi pi-shopping-cart"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='page-insight-center'>
                        <div className='insight-box'>
                            <div className='insight-box-left'>
                                <h3>Despesas Profissionais</h3>
                                <h1>{depesasProfissionais}€</h1>
                            </div>
                            <div className='insight-box-right'>
                                <div className="icon-box">
                                    <i className="pi pi-wrench"></i>
                                </div>
                            </div>
                           
                        </div>
                    </div>
                    <div className='page-insight-right'>
                        <div className='insight-box'>
                            <div className='insight-box-left'>
                                <h3>Total de Despesas</h3>
                                <h1>{despesasTotal}€</h1>
                            </div>
                            <div className='insight-box-right'>
                                <div className="icon-box">
                                    <i className="pi pi-money-bill"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        
                <div className='page-content'>
        
                    <div className='search-box'>
                        <i className='pi pi-search'></i>
                        <input type="text" placeholder='Pesquisar Funcionario ou Projeto' value={globalFilterValue} onChange={onGlobalFilterChange} />
                    </div>
        
                    <div className='table-box'>
                        <DataTable 
                        ref={dt}
                        value={despesasJoin} 
                        paginator 
                        rows={10} 
                        rowsPerPageOptions={[10,20,50]} 
                        emptyMessage="Sem dados para mostrar" 
                        className="table-pedidos"
                        filters={filters}
                        responsiveLayout="scroll"
                        globalFilterFields={['funcionario', 'projetoId']}
                        >   
                            <Column field="funcionario" header="Funcionário"/>
                            <Column field="projetoId" header="Projeto"/>
                            <Column field="tipoDespesa" header="Tipo de Despesa"/>
                            <Column field="selectedDespesa" header="Despesa"/>
                            <Column field="valor" header="Valor" body={priceBodyTemplate} sortable/>
                            <Column field="estado" header="Estado" body={statusBodyTemplate}/>
                            <Column field="dataDespesa" header="Data da Despesa" body={dateBodyTemplate} filterField="date" dataType="date" filter filterElement={dateFilterTemplate}/>
                            <Column body={actionBodyTemplate} exportable={false} style={{ maxWidth: '5rem'}}></Column>
                        </DataTable>
                    </div>
                    
                </div>
        
                <Dialog header="Adicionar Despesa" visible={displayBasic} className='dialog-faltas' onHide={() => setDisplayBasic(false)}>
                    <form className='form-dialog'>
                        <label>Tipo de Despesa</label>
                        <div className='form-flex'>
                            <div className='form-group-radio'>
                                <RadioButton inputId="despesa1" name="tipoDespesa" value="Pessoal" onChange={(e) => setTipoDespesa(e.value)} checked={tipoDespesa === 'Pessoal'} />
                                <p htmlFor="despesa1">Pessoal</p>
                            </div>
                            <div className='form-group-radio'>
                                <RadioButton inputId="despesa2" name="tipoDespesa" value="Profissional" onChange={(e) => setTipoDespesa(e.value)} checked={tipoDespesa === 'Profissional'}  />
                                <p htmlFor="despesa2">Profissional</p>
                            </div>
                        </div>
                        <div className='form-flex'>
                        {
                         // if tipoDespesa === Pessoal values of dropdown "combustivel, alimentacao, etc"
                            tipoDespesa === 'Pessoal' ? (
                                    <div className='form-group'>
                                        <label>Tipo de Despesa Pessoal</label>
                                        <Dropdown optionLabel="label" optionValue="value" value={selectedDespesa} options={despesasPessoais} onChange={(e) => setSelectedDespesa(e.value)} placeholder="Selecione a Despesa" />
                                    </div>
                            ) : (
                                    <div className='form-group'>
                                        <label>Tipo de Despesa Profissional</label>
                                        <Dropdown optionLabel="label" optionValue="value" value={selectedDespesa} options={despesasProfissionais} onChange={(e) => setSelectedDespesa(e.value)} placeholder="Selecione a Despesa" />
                                    </div>
                                
                            )
                        }
        
                            <div className='form-group'>
                                <label>Projeto</label>
                                <Dropdown optionLabel="label" optionValue="value" value={selectedProjeto} options={projetos} onChange={(e) => setSelectedProjeto(e.value)} placeholder="Selecione o Projeto" required/>
                            </div>
                        </div>
        
                        {
        
                            //if despesa === outros show input text
        
                            selectedDespesa === 'outros' ? (
                                <div className='form-flex'>
                                    <div className='form-group'>
                                        <label>Descrição</label>
                                        <InputText id='desc' type='text' className="inputText" value={description} onChange={(e) => setDescription (e.target.value)} />
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )
        
                        }
                        <div className='form-flex'>
                            <div className='form-group'>
                                <label>Dia da Despesa</label>
                                <Calendar value={date} dateFormat="dd/mm/yy" maxDate={maxDate} onChange={(e) => setDataDespesa(e.value)} showIcon />
                            </div>
                        </div>
                        
                        <div className='form-flex'>
                            <div className='form-group'>
                                <label>Funcionário</label>
                                <Dropdown optionLabel="label" optionValue="value" value={selectedFuncionario} options={funcionarios} onChange={(e) => setSelectedFuncionario(e.value)} placeholder="Selecione o Funcionário" />
                            </div>
                            <div className='form-group'>
                                <label>Valor da Despesa</label>
                                <InputNumber id="valor" value={valor} onValueChange={(e) => setValor(e.value)} mode="currency" currency="EUR" locale="de-DE" />
                            </div>
                        </div>
        
                        <div className='form-flex-buttons'>
                            <div className="form-buttons">
                                <button type="button" className='button button-save' onClick={addDespesa}><i className='pi pi-check-circle'></i><span>Registar</span></button>
                            </div>
                        </div>
                    </form>
                </Dialog> 
        
                <ConfirmDialog />
        
                <Dialog header="Editar Despesa" visible={displayEdit} className='dialog-faltas' onHide={() => setDisplayEdit(false)}>
                    <form className='form-dialog'>
                        <div className='form-flex'>
                            <div className='form-group'>
                                <label>Tipo de Despesa</label>
                                <InputText id='prjeto' type='text' className="inputText" defaultValue={despesa.tipoDespesa} disabled/>
                            </div>
                            <div className='form-group'>
                                <label>Despesa</label>
                                <InputText id='projeto' type='text' className="inputText" defaultValue={despesa.selectedDespesa} disabled/>
                            </div>
                        </div>
                        <div className='form-flex'>
                            <div className='form-group'>
                                <label>Projeto</label>
                                <InputText id='projeto' type='text' className="inputText" defaultValue={despesa.projeto} disabled/>
                            </div>
                            <div className='form-group'>
                                <label>Funcionário</label>
                                <InputText id='projeto' type='text' className="inputText" defaultValue={despesa.funcionario} disabled/>
                            </div>
                        </div>
                        <div className='form-flex'>
                            <div className='form-group'>
                                <label>Valor da Despesa</label>
                                <InputText id='projeto' typeo='text' className="inputText" defaultValue={despesa.valor} disabled/>
                            </div>
                            <div className='form-group'>
                                <label>Dia da Despesa</label>
                                <InputText id='projeto' type='text' className="inputText" defaultValue={despesa.dataDespesa} disabled/>
                            </div>
                        </div>
                        {
                            despesa.despesa != '' ? (
                                <div className='form-flex'>
                                    <div className='form-group'>
                                        <label>Observações</label>
                                        <InputText id='projeto' type='text' className="inputText" defaultValue={despesa.despesa} disabled/>
                                    </div>
                                </div>
                            ) : (	
                                <></>
                            )
                        }
                        <div className='form-flex'>
                            <div className='form-group'>
                                <label>Estado</label>
                                <Dropdown optionLabel="name" optionValue="code" value={selectedEstado} options={estados} onChange={(e) => setSelectedEstado(e.value)} placeholder="Selecione o Estado" />
                            </div>
                        </div>
                        <div className='form-flex-buttons'>
                            <div className="form-buttons">
                                <button type="button" className='button button-save' onClick={updateDespesa}><i className='pi pi-check-circle'></i><span>Atualizar</span></button>
                            </div>
                        </div>
                    </form>
                </Dialog>
            </div>
            )
    } 
}

export default despesas