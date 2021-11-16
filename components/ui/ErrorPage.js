import clsx from 'clsx';
import { useEffect, useState } from 'react';
import {Icon} from '@mdi/react'
import {mdiAlertCircle, mdiCheckBold, mdiDeleteAlert} from '@mdi/js'
import { CONSTANTS } from '../Util/Constants';

export default function ErrorPage({error,onClose}){
    const [modalStatus,setStatus] = useState(error===CONSTANTS.NO_ERROR);
    function handleClose(){
        onClose(CONSTANTS.NO_ERROR)
    }
    let modalBody=<div></div>;
    modalBody = <div className={clsx('none')}>
        <div className={clsx('mt-1','mb-6')}>An error occured on the server!</div>
        <div className="button is-info" onClick={handleClose}><strong>OK</strong></div>
    </div>

console.log(error+','+modalStatus)


useEffect(()=>{
    setStatus(error===CONSTANTS.NO_ERROR)
},[error])

    return (



<div className={clsx('modal',modalStatus?'':'is-active')}>
  <div class="modal-background"></div>
  <div class="card">
    <header class="modal-card-head has-background-white">
        <div className={clsx("level")}><div className={clsx('level-left')}>
      <p class="modal-card-title title is-6 level-item"><span className={clsx('has-text-danger','level-item')}><Icon path={mdiAlertCircle} size={1}></Icon></span>Error</p>
      </div></div>
    </header>
    <section class="modal-card-body is-loading">
        {modalBody}
     </section>
    {/* <footer class="modal-card-foot">
      <button class="button is-success">Save changes</button>
      <button class="button"aria-label="close" onClick={onClose}>Cancel</button>
    </footer> */}
  </div>
</div>
    );

}