import clsx from 'clsx';
import { isValidElement, useState } from 'react';
import {Icon} from '@mdi/react'
import {mdiCheckBold} from '@mdi/js'
import { CONSTANTS } from '../Util/Constants';

export default function ConfirmationDialog({message,onCancel,onClose,isVisible,onConfirm,children}){
    const [modalStatus,setStatus] = useState(isVisible);
    function handleClose(){
        setStatus(false);
    }
    let modalBody=<div>{message}</div>;
   

    return (



<div className={clsx('modal',isVisible?'is-active':false)}>
  <div class="modal-background"></div>
  <div class="card">
    <header class="modal-card-head has-background-white">
      <p class="modal-card-title"><strong>Confirmation</strong></p>
      <button class="delete ml-3 is-info" aria-label="close" onClick={onClose}></button>
    </header>
    <section class="modal-card-body is-loading">
        {modalBody}
     </section>
    <footer class="modal-card-foot">
      <button class="button is-success" onClick={onConfirm}>Yes</button>
      <button class="button"aria-label="close" onClick={onCancel}>No</button>
    </footer>
  </div>
</div>
    );

}