import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


 function clientes() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        //ProductService.getProductsMini().then(data => setProducts(data));
    }, []);

    return (
        <div className="table">
            <DataTable value={products} resizableColumns showGridlines>
                <Column field="nome" header="Nome"></Column>
                <Column field="morada" header="Morada"></Column>
                <Column field="email" header="Email"></Column>
                <Column field="contacto" header="Contacto"></Column>
                <Column field="iban" header="Iban"></Column>
                <Column field="iban" header="Iban"></Column>
            </DataTable>
        </div>
    );
}
export default clientes