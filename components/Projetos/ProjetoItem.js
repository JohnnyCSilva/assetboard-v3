import React from 'react'
import { ProgressBar } from 'primereact/progressbar';
import Router from 'next/router';

function ProjetoItem(props) {


    //open new page with project details
    const openProjectDetails = () => {
        alert(props.projetos.key);
        Router.push('/details/' + props.projetos.key);
    }

    const dataInicioProjeto = new Date(props.projetos.dataInicio.seconds * 1000).toLocaleDateString('pt-PT');
    const dataPrevisaoEntrega = new Date(props.projetos.previsaoEntrega.seconds * 1000).toLocaleDateString('pt-PT');
    

    //nrTarefasTotais is random number between 1 and 10
    const nrTarefasTotais = Math.floor(Math.random() * 10) + 1; //max = 6

    //nrTarefasRealizadas is random number between 0 and nrTarefasTotais
    const nrTarefasRealizadas = Math.floor(Math.random() * nrTarefasTotais); //decorrer = 1

    const valueProgressBar = ((nrTarefasRealizadas / nrTarefasTotais) * 100).toFixed(0);


    const contactProjectOwner = () => {
        location.href = 'mailto:' 
        + props.projetos.cliente + 
        '?subject=Projeto: ' 
        + props.projetos.nome + 
        '&body=Olá, gostaria de falar sobre o projeto: ' 
        + props.projetos.nome + ' que está a decorrer.';
    }

    


  return (
    <div>
        <div className="grid-template-card">
            <div className="grid-template-card-top">
                <div className="grid-card-image-text">
                    <img src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png" alt="Projeto" />
                    <div className="grid-card-project">
                        <h3>{props.projetos.nome}</h3>
                        <p onClick={contactProjectOwner}>{props.projetos.cliente}</p>
                    </div>
                </div>
                <button className="button button-actions"><i className="pi pi-ellipsis-v"></i></button>
            </div>
            <div className="grid-template-card-middle">
                <div className="card-middle">
                    <p><i className="pi pi-user"></i><span>{props.projetos.gestor}</span></p>
                    <p><i className="pi pi-clock"></i><span>{dataPrevisaoEntrega}</span></p>
                    <p><i className="pi pi-calendar-times"></i><span>{nrTarefasRealizadas} / {nrTarefasTotais} Tarefas</span></p>
                </div>
            </div>
            <div className="grid-template-card-bottom">
                <div className="card-bottom">
                    <button type='button' className='button button-more' onClick={openProjectDetails}><i className="pi pi-eye"></i><span>Ver Projeto</span></button>
                </div>  
            </div>

            <div className="grid-template-card-progress">
                <div className="card-progress">
                    <ProgressBar value={valueProgressBar}></ProgressBar>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ProjetoItem