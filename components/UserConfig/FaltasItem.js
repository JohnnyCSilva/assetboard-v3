import React from 'react'

function FaltasItem(props) {

  // Format date to dd/mm/yyyy
  const date = new Date(props.faltas.diasFalta.seconds * 1000).toLocaleDateString('pt-PT')

  return (
    <tr>
        <td>{props.faltas.motivo}</td>
        <td>{date}</td>
        <td>{props.faltas.estado}</td>
    </tr>

  )
}

export default FaltasItem