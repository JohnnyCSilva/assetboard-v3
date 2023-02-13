import React from 'react'

import FuncItem from './FuncItem'

function FuncList(props) {
  return (
    <div className="funcionario_container">
      <table className='funcionario_table_row'>
        <tr>
          <th>Nome</th>
          <th>Email</th>
          <th>Cargo</th>
          <th>Contacto</th>
          <th>Ações</th>
        </tr>

      {props.funcionarios.map(funcionarios => {
        return (
          <FuncItem funcionarios={funcionarios} />
        )
      })}

      </table>
    </div>
  )
}

export default FuncList