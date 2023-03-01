import React from 'react'
import ClientesItem from './ClientesItem'

function clienteslist(props) {
  return (
    <div>
        
            <div className='grid-template-column'>
                {props.clientes.map(clientes => {
                    return (
                        <ClientesItem clientes={clientes} key={clientes.key}/>
                    )
                })}

            </div>
 
       




    </div>
  )
}

export default clienteslist