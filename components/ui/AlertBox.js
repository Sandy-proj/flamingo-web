import clsx from 'clsx';
import { isValidElement, useState } from 'react';
import {Icon} from '@mdi/react'
import {mdiAlertCircle, mdiChatQuestion, mdiCheckBold, mdiHeadQuestion} from '@mdi/js'
import { CONSTANTS } from '../Util/Constants';

export default function Alert({message,onCancel,onClose,isVisible,onConfirm,children}){
    const [modalStatus,setStatus] = useState(isVisible);
    function handleClose(){
        setStatus(false);
    }
    let modalBody=<div>{message}</div>;
   

    return (



<div className={clsx('modal',isVisible?'is-active':false)}>
  <div class="modal-background"></div>
  <div className={clsx('card','is-radiusless')}>
    <header className={clsx('modal-card-head','has-background-white','entrystyle')}>
      <span className={clsx('has-text-warning')}><Icon path={mdiAlertCircle} size={1.5}></Icon></span><span className={clsx('title','is-5','ml-3')}>Attention</span>
     
    </header>
    <section class="modal-card-body is-loading">
        {modalBody}
     </section>
    <footer className={clsx('modal-card-foot','has-background-white','centeralignment','entrystyle')}>
     
      <button className={clsx('button','is-inverted','is-rounded','is-info')} aria-label="close" onClick={onCancel}><strong>OK</strong></button>
    </footer>
  </div>
</div>
    );

}