import React from 'react'
import FaltasItem from './FaltasItem'

const FaltasList = (props) => {
  return (
    <div>
        <table className='faltas-table-row'>
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
                        <FaltasItem faltas={faltas} key={faltas.key}/>
                    )
                })}
            </tbody>
        </table>
    </div>
  )
}

export default FaltasList