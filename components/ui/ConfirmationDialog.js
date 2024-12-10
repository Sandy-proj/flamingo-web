import clsx from 'clsx';
import { isValidElement, useState } from 'react';
import {Icon} from '@mdi/react'
import {mdiChatQuestion, mdiCheckBold, mdiFileQuestion, mdiHeadQuestion} from '@mdi/js'
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
  <div className={clsx('card')}>
    <header class="modal-card-head has-background-white">
      <span className={clsx('has-text-link')}><Icon path={mdiFileQuestion} size={1}></Icon></span><span className={clsx('title','is-5','ml-3')}>Confirmation</span>
     
    </header>
    <section class="modal-card-body is-loading">
        {modalBody}
     </section>
    <footer class="modal-card-foot has-background-white">
      <button className={clsx('button','is-inverted','is-rounded','is-info')} onClick={onConfirm}><strong>Yes</strong></button>
      <button className={clsx('button','is-inverted','is-rounded','is-info')} aria-label="close" onClick={onCancel}><strong>No</strong></button>
    </footer>
  </div>
</div>
    );

}