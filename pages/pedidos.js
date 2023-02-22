import React, { useEffect, useContext, useState } from 'react'
import { collection, query, getDocs, updateDoc, where, addDoc, orderBy } from "firebase/firestore";
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { db } from '../config/Firebase'
import { AuthContext } from '../config/AuthContext'

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
        

function pedidos() {

    let emptyPedido = {
        key: null,
        name: '',
        estado: '',
        diasFalta: '',
        diasFaltaFim: '',
        motivo: '',
    };

    //get all faltas from database and order by date
    const { currentUser } = useContext(AuthContext);
    const [faltas, setFaltas] = React.useState([]);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const [pedidoDialog, setPedidoDialog] = useState(false);
    const [pedido, setPedido] = useState(emptyPedido);
    const [selectedEstado, setSelectedEstado] = useState(null);

    const estados = [
        { name: 'Aprovado', code: 'Aprovado' },
        { name: 'Rejeitado', code: 'Rejeitado' },
        { name: 'Pendente', code: 'Pendente' }
    ];
  
    useEffect(() => {
        getFaltas();
    }, [])

    const getFaltas = async () => {
        const q = query(collection(db, "faltas"));
        const querySnapshot = getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                setFaltas(faltas => [...faltas, doc.data()]);
            });
        }
        )
    }



    const expandSearchBox = () => {
        const searchBox = document.getElementById('search-box');

        searchBox.classList.toggle('expand-search-box');
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
        return formatDate(rowData.diasFalta);
    };

    const dateBodyTemplateFim = (rowData) => {
        return formatDate(rowData.diasFaltaFim);
    };
    useEffect(() => {
        initFilters();
    }, []);

    const initFilters = () => {
        setFilters({
            'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
            'nome': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
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

    const statusBodyTemplate = (rowData) => {

        return (rowData.estado === 'Aprovado' ? <span className='estado-aprovado-pedidos'>{rowData.estado}</span> 
        : rowData.estado === 'Rejeitado' ? <span className='estado-rejeitado-pedidos'>{rowData.estado}</span>
        : rowData.estado === 'Pendente' ? <span className='estado-pendente-pedidos'>{rowData.estado}</span>
        : null
        );
        
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <button type='button' className='button button-edit' onClick={() => editProduct(rowData)}><i className='pi pi-pencil'></i></button>
                <button type='button' className='button button-info' onClick={() => verPedido(rowData)}><i className='pi pi-info-circle'></i></button>
                <button type='button' className='button button-delete' onClick={() => apagarPedido(rowData)}><i className='pi pi-trash'></i></button>
            </React.Fragment>
        );
    };

    // get pedido clicked and open dialog
    const editProduct = (faltas) => {
        setPedido({ ...faltas });
        setPedidoDialog(true);
    };


    // update falta in database with selected estado
    const updatePedido = async () => {
        const pedidoRef = collection(db, "faltas");
        const q = query(pedidoRef, where("key", "==", pedido.key));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            updateDoc(doc.ref, {
                estado: selectedEstado.name,
            });
        });
        setPedidoDialog(false);
        setPedido(emptyPedido);
        setSelectedEstado(null);
        setFaltas([]);
        getFaltas();
    };

    
    

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(faltas);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['faltas'] };
            const excelBuffer = xlsx.write(workbook, {
                bookType: 'xlsx',
                type: 'array'
            });

            saveAsExcelFile(excelBuffer, 'faltas');
        });
    };

    

    const saveAsExcelFile = (buffer, fileName) => {
        import('file-saver').then((module) => {
            if (module && module.default) {
                let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                let EXCEL_EXTENSION = '.xlsx';
                const data = new Blob([buffer], {
                    type: EXCEL_TYPE
                });

                module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
            }
        });
    };


  return (

    <div>

        <div className='page-title'>
            <div className='title-left-side'>
                <h1>Pedidos de Ausência</h1>
            </div>
            <div className='title-right-side'>
                <div className='input-group-search' id='search-box'>
                    <div className='search-icon'>
                        <i className='pi pi-search' onClick={expandSearchBox}></i>
                    </div>
                    <div className='search-input'>
                        <input type='text' placeholder='Pesquisar' value={globalFilterValue} onChange={onGlobalFilterChange} />
                        <i className='pi pi-times'></i>
                    </div>
                </div>
                <button className='button button-excel'><i className='pi pi-file-excel' onClick={exportExcel}></i></button>
                <button className='button button-vaccation'><i className='pi pi-calendar'></i>Adicionar Falta</button>
            </div>
        </div>
        <div className='page-content'>
            <div className='page-content-table'>
                <DataTable value={faltas} paginator rows={10} rowsPerPageOptions={[10, 20, 50]}
                className="table-pedidos"
                filters={filters}
                responsiveLayout="scroll"
                globalFilterFields={['name']}
                emptyMessage="Nenhum pedido de falta encontrado">
                    <Column field="name" header="Nome" sortable></Column>
                    <Column field="diasFalta" header="Data Inicio" body={dateBodyTemplate} sortable></Column>
                    <Column field="diasFaltaFim" header="Data Fim" body={dateBodyTemplateFim} sortable></Column>
                    <Column field="motivo" header="Motivo" sortable></Column>
                    <Column field="estado" header="Estado" body={statusBodyTemplate} sortable></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ maxWidth: '8rem', minWidth: 'auto' }}></Column>
                </DataTable>
            </div>    
        </div>

        {/* Dialog to Edit faltaRow */}
        <Dialog visible={pedidoDialog} header="Detalhes da Falta" className='dialog-faltas' onHide={() => setPedidoDialog(false)}>
                    <form className='form-dialog'>
                        <div className='form-flex'>
                            <div className='form-group'>
                                <label htmlFor="name">Nome do Funcionário</label>
                                <InputText className="inputTextEdit" id="name" value={pedido.name} disabled />
                            </div>
                        </div>
                        <div className='form-flex'>
                            
                        </div>
                        <div className='form-flex'>
                            <div className='form-group'>
                                <label htmlFor="diasFalta">Data Inicio</label>
                                <InputText className="inputTextEdit" id="diasFalta" value={pedido.diasFalta} disabled />
                            </div>
                            <div className='form-group'>
                                <label htmlFor="diasFaltaFim">Data Fim</label>
                                <InputText className="inputTextEdit" id="diasFaltaFim" value={pedido.diasFaltaFim} disabled />
                            </div>
                        </div>
                        <div className='form-flex'>
                            <div className='form-group'>
                                <label htmlFor="observacoes">Observações</label>
                                <InputTextarea className="inputTextEdit" id="observacoes" value={pedido.obs} disabled />
                            </div>
                        </div>
                        <div className='form-flex'>
                            <div className='form-group'>
                                <label htmlFor="motivo">Motivo</label>
                                <InputText className="inputTextEdit" id="motivo" value={pedido.motivo} disabled />
                            </div>
                        </div>
                        <div className='form-flex'>
                            <div className='form-group'>
                                <label htmlFor="observacoes">Estado</label>
                                <Dropdown 
                                className="inputTextEdit" 
                                value={selectedEstado} 
                                optionLabel="name" 
                                options={estados}
                                placeholder="Alterar Estado"
                                onChange={(e) => setSelectedEstado(e.value)} />
                            </div>
                        </div>
                        <div className='form-flex-buttons'>
                            <div className="form-buttons">
                                <button type="button" className='button button-save' onClick={updatePedido}><i className='pi pi-calendar-plus'></i>Atualizar Falta</button>
                            </div>
                       </div>
                    </form>
                </Dialog>
    </div>
  )
}

export default pedidos