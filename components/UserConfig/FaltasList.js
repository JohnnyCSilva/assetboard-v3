import React from 'react'
import FaltasItem from './FaltasItem'

const FaltasList = (props) => {
  return (
    <div>
        <table className='faltas_table_row'>
            <thead className='tablehead-faltas'>
                <tr>
                    <th>Motivo</th>
                    <th>Data</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody className='tablebody-faltas'>
                {props.faltas.map(faltas => {
                    return (
                        <FaltasItem faltas={faltas} key={faltas.uid}/>
                    )
                })}
            </tbody>
        </table>
    </div>
  )
}

export default FaltasList