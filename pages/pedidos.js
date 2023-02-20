import React, { useEffect, useContext, useState } from 'react'
import { collection, query, getDocs, updateDoc, where, addDoc, orderBy } from "firebase/firestore";
import { FilterMatchMode, FilterOperator } from 'primereact/api';

import { db } from '../config/Firebase'
import { AuthContext } from '../config/AuthContext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';

function pedidos() {

    //get all faltas from database and order by date
    const { currentUser } = useContext(AuthContext);
    const [faltaDialog, setFaltaDialog] = useState(false);
    const [faltas, setFaltas] = React.useState([]);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

  
    useEffect(() => {
        const q = query(collection(db, "faltas"));
        const querySnapshot = getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                setFaltas(faltas => [...faltas, doc.data()]);
            });
        }
        )
    }, [])



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
                <button type='button' className='button button-edit' onClick={() => editarPedido(rowData)}><i className='pi pi-pencil'></i></button>
                <button type='button' className='button button-info' onClick={() => verPedido(rowData)}><i className='pi pi-info-circle'></i></button>
                <button type='button' className='button button-delete' onClick={() => apagarPedido(rowData)}><i className='pi pi-trash'></i></button>
            </React.Fragment>
        );
    };

    const editarPedido = (falta) => {
        setFaltaDialog(true);
        alert(faltaDialog);
    };

    const exportExcel = () => {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(faltas);
            const workbook = { Sheets: { data: worksheet }, SheetNames: ['pedidos'] };
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
                <h1>Pedidos</h1>
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
                <button className='button button-pdf'><i className='pi pi-file-pdf'></i></button>
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

        <Dialog visible={faltaDialog} 
                style={{ width: '70%' }} 
                breakpoints={{ '960px': '75vw', '641px': '90vw' }} 
                header="Detalhes da Falta" 
                modal
                onHide={() => setFaltaDialog(false)}>
                    <div className='dialog-content'>
                        <input type='text' placeholder='Nome' value={falta.nome} />
                    </div>
                </Dialog>

    </div>
  )
}

export default pedidos