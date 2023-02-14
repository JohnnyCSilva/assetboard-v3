import React from 'react'

import FuncItem from './FuncItem'

function FuncList(props) {
  return (
    <div className="funcionario_container">
      <table className='funcionario_table_row'>
        <thead className='tablehead-funcionarios'>
          <tr>
            <th>Nome</th>
            <th>Cargo</th>
            <th>Área</th>
            <th>Contacto</th>
            <th>IBAN</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody className='tablebody-funcionarios'>
          {props.funcionarios.map(funcionarios => {
            return (
              <FuncItem funcionarios={funcionarios} key={funcionarios.uid}/>
            )
          })}
          </tbody>
      </table>
    </div>
  )
}

export default FuncList