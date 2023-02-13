import React from 'react'

function funcionario_edit() {


    // get the id from the url
    const id = window.location.pathname.split("/")[2];


  return (
    <div>
        <h1>Funcionario Edit</h1>
        <p>id: {id}</p>
    </div>
    
  )
}

export default funcionario_edit