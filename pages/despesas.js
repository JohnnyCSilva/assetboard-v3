import React, { useState, useEffect, useContext, useRef, use} from 'react'

import { db } from '../config/Firebase'
import { collection, query, getDocs, updateDoc, where, addDoc, orderBy } from "firebase/firestore";
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { AuthContext } from '../config/AuthContext';
import { Dialog } from 'primereact/dialog';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function despesas() {

    const { currentUser } = useContext(AuthContext);
    const [ displayBasic, setDisplayBasic ] = useState(false);
    const [ tipoDespesa, setTipoDespesa ] = useState('Pessoal');
    const [ filters, setFilters ] = useState(null);
    const [ selectedDespesa, setSelectedDespesa ] = useState([]);
    const [ description, setDescription ] = useState([]);
    const toast = useRef(null);
    const [ globalFilterValue, setGlobalFilterValue ] = useState('');
    const [ valor, setValor ] = useState([]);
    const [ projeto, setProjeto ] = useState([]);
    

    // if tipoDespesa === Pessoal values of dropdown "combustivel, alimentacao, etc"
    
    const despesasPessoais = [
        {label: 'Alojamento', value: 'alojamento'},
        {label: 'Alimentação', value: 'alimentacao'},
        {label: 'Saude', value: 'saude'},
        {label: 'Outros', value: 'outros'},
    ]

    // if tipoDespesa === Profissional values of dropdown "combustivel, alimentacao, etc"
    const despesasProfissionais = [
        {label: 'Combustivel', value: 'combustivel'},
        {label: 'Alimentação', value: 'alimentacao'},
        {label: 'Transporte', value: 'transporte'},
        {label: 'Alojamento', value: 'alojamento'},
        {label: 'Material', value: 'material'},
        {label: 'Outros', value: 'outros'},
    ]

    const [ funcionarios, setFuncionarios ] = useState([]);
    const [ selectedFuncionario, setSelectedFuncionario ] = useState([]);
    const [ despesas, setDespesas ] = useState([]);
    
    const [ depesasPessoais, setDespesasPessoais ] = useState(0);
    const [ depesasProfissionais, setDespesasProfissionais ] = useState(0);
    const [ despesasTotal, setDespesasTotal ] = useState(0);

    //get all despesas from db
    const getDespesas = async () => {
        const despesas = [];
        const q = query(collection(db, "despesas"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            despesas.push(doc.data());
        });
        setDespesas(despesas);

        let totalDespesas = 0;
        despesas.map((despesa) => {
            totalDespesas += despesa.valor;
        })
        totalDespesas = Math.round(totalDespesas * 100) / 100;
        setDespesasTotal(totalDespesas);

        let totalDespesasPessoais = 0;
        despesas.map((despesa) => {
            if(despesa.tipoDespesa === 'Pessoal') {
                totalDespesasPessoais += despesa.valor;
            }
        })
        totalDespesasPessoais = Math.round(totalDespesasPessoais * 100) / 100;
        setDespesasPessoais(totalDespesasPessoais);

        let totalDespesasProfissionais = 0;
        despesas.map((despesa) => {
            if(despesa.tipoDespesa === 'Profissional') {
                totalDespesasProfissionais += despesa.valor;
            }
        })
        totalDespesasProfissionais = Math.round(totalDespesasProfissionais * 100) / 100;
        setDespesasProfissionais(totalDespesasProfissionais);


    }

    useEffect(() => {
        getDespesas();

    }, [])


    useEffect(() => {
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
        getFuncionarios();
    }, [])

    const toggleInsightBox = () => {
        const insightBox = document.getElementById('insight-box');
        const eyeBox = document.getElementById('eye-box');

        insightBox.classList.toggle('hidden');
        eyeBox.classList.toggle('pi-eye-slash');
        eyeBox.classList.toggle('pi-eye');

    }

    //add despesa to db with funcionario uid 
    const addDespesa = async () => {
        await addDoc(collection(db, "despesas"), {
            funcionario: selectedFuncionario,
            tipoDespesa: tipoDespesa,
            selectedDespesa: selectedDespesa,
            despesa: description,
            valor: valor,
            projeto: projeto,
            createdAt: new Date(),         
        });
        toast.current.show({severity:'success', summary: 'Registado', detail:'Falta registada com sucesso.', life: 3000});
        setDisplayBasic(false);

        setSelectedFuncionario('');
        setTipoDespesa('Pessoal');
        setDescription('');
        setValor('');
        setProjeto('');


        getDespesas();
    }

    useEffect(() => {
        initFilters();
    }, []);

    const initFilters = () => {
        setFilters({
            'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
            'funcionario': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'projeto': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
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
                <button type='button' className='button button-edit'><i className='pi pi-pencil'></i></button>
                <button type='button' className='button button-delete'><i className='pi pi-trash'></i></button>
            </React.Fragment>
        );
    };



  return (
    <div>
        <Toast ref={toast} />

        <div className='page-title'>
            <div className='title-left-side'>
                <h1>Despesas</h1>    
            </div>
            <div className='title-right-side'>
                <button className='button button-excel'><i className='pi pi-file-excel'></i><span>Exportar</span></button>
                <button className='button button-see' onClick={toggleInsightBox}><i className='pi pi-eye-slash' id="eye-box"></i></button>
                <button className='button button-vaccation' onClick={() => setDisplayBasic(true)}><i className='pi pi-calculator'></i><span>Despesa</span></button>
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
                value={despesas} 
                paginator 
                rows={10} 
                rowsPerPageOptions={[10,20,50]} 
                emptyMessage="Sem dados para mostrar" 
                className="table-pedidos"
                filters={filters}
                responsiveLayout="scroll"
                globalFilterFields={['funcionario', 'projeto']}
                >   
                    <Column field="funcionario" header="Funcionário"/>
                    <Column field="projeto" header="Projeto"/>
                    <Column field="tipoDespesa" header="Tipo de Despesa"/>
                    <Column field="selectedDespesa" header="Despesa"/>
                    <Column field="valor" header="Valor" body={priceBodyTemplate} sortable/>
                    <Column body={actionBodyTemplate} exportable={false} style={{ maxWidth: '5rem'}}></Column>
                </DataTable>
            </div>
            
        </div>

        <Dialog header="Adicionar Despesa" visible={displayBasic} style={{ width: '50vw' }} onHide={() => setDisplayBasic(false)}>
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
                        <InputText id='projeto' type='text' className="inputText" onChange={(e) => setProjeto(e.target.value)} />
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
                        <label>Funcionário</label>
                        <Dropdown optionLabel="label" optionValue="value" value={selectedFuncionario} options={funcionarios} onChange={(e) => setSelectedFuncionario(e.value)} placeholder="Selecione o Funcionário" />
                    </div>
                    <div className='form-group'>
                        <label>Valor da Despesa</label>
                        <InputNumber id="valor" value={valor} onValueChange={(e) => setValor(e.value)} mode="currency" currency="EUR" locale="de-DE" />
                    </div>
                </div>

                <div className='form-flex'>
                    <div className='form-group'>
                        <label>Inserir Ficheiro</label>
                        <FileUpload name="demo[]" url="./upload.php" multiple={true} accept="image/*" maxFileSize={1000000} />
                    </div>
                </div>

                <div className='form-flex-buttons'>
                    <div className="form-buttons">
                        <button type="button" className='button button-save' onClick={addDespesa}><i className='pi pi-check-circle'></i>Adicionar Despesa</button>
                    </div>
                </div>
            </form>
        </Dialog> 

    </div>
  )
}

export default despesas