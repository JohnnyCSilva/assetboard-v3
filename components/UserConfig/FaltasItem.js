import React, {useEffect, useState, useRef} from 'react'
import {Dialog} from 'primereact/dialog'

function FaltasItem(props) {

  // Format date to dd/mm/yyyy
  const dateInicio = new Date(props.faltas.diasFalta.seconds * 1000).toLocaleDateString('pt-PT');
  const dateFim = new Date(props.faltas.diasFaltaFim.seconds * 1000).toLocaleDateString('pt-PT');

  const [visibleInfo, setVisibleInfo] = useState(false);

  //change faltas-item__estado color depending on the state 
  const estadoRef = useRef(null);

  useEffect(() => {
    if (estadoRef.current) {
      const estado = estadoRef.current;
      if (estado.textContent === 'Pendente') {
        estado.classList.add('estado-pendente');
      } else if (estado.textContent === 'Aprovado') {
        estado.classList.add('estado-aprovado');
      } else if (estado.textContent === 'Rejeitado') {
        estado.classList.add('estado-rejeitado');
      }
    }
  }, []);


  return (
    <tr>
      <td>{props.faltas.motivo}</td>
      <td>{dateInicio}</td>
      <td ref={estadoRef} className="faltas-item__estado"><span className='chip-text'>{props.faltas.estado}</span></td>
      <td style={{ "width":"10%"}}><i className='pi pi-info-circle info'onClick={() => setVisibleInfo(true)}/></td>
      <Dialog className='dialog-box-info-falta' header={"Informação"}  visible={visibleInfo} onHide={() => setVisibleInfo(false)} draggable={false}>
        <div className='dialog-box-info-content'>
          <div className="dialog-box-info-content-item">
            <p className="dialog-box-info-content-item-title">Motivo:</p>
            <p className="dialog-box-info-content-item-text">{props.faltas.motivo}</p>
          </div>
          <div className="dialog-box-info-content-item">
            <p className="dialog-box-info-content-item-title">Data de início:</p>
            <p className="dialog-box-info-content-item-text">{dateInicio}</p>
          </div>
          <div className="dialog-box-info-content-item">
            <p className="dialog-box-info-content-item-title">Data de fim:</p>
            <p className="dialog-box-info-content-item-text">{dateFim}</p>
          </div>
          <div className="dialog-box-info-content-item">
            <p className="dialog-box-info-content-item-title">Estado:</p>
            <p className="dialog-box-info-content-item-text">{props.faltas.estado}</p>
          </div>
          <div className="dialog-box-info-content-item">
            <p className="dialog-box-info-content-item-title">Observações:</p>
            <p className="dialog-box-info-content-item-text">{props.faltas.obs}</p>
          </div>
        </div>
      </Dialog>
    </tr>
    
  )

}

export default FaltasItem
