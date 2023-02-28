import React from 'react'
import ProjetoItem from './ProjetoItem'

function ProjetoList(props) {
  return (
    <div>

        <div className="grid-template-column">
            {props.projetos.map(projetos => {
                return (<ProjetoItem projetos={projetos} key={projetos.key}/>)
             })}
        </div>

    </div>
  )
}

export default ProjetoList