import clsx from 'clsx';
import { useState } from 'react';
import {Icon} from '@mdi/react'
import {mdiCheckBold} from '@mdi/js'
import { CONSTANTS } from '../Util/Constants';

export default function Popup({status,message,error,onClose,isVisible,children}){
    const [modalStatus,setStatus] = useState(status);
    function handleClose(){
        setStatus(0);
    }
    let modalBody=<div></div>;
    if(status===CONSTANTS.messageTypes.PROGRESS){
        modalBody= <progress class="progress is-small is-primary" max="100"></progress>
    }else if(status===CONSTANTS.messageTypes.SUCCESS){
        modalBody=<div className='centeralignment'>
                        <span className={clsx('icon','is-borderless')}>
                            <Icon path={mdiCheckBold} size={1}></Icon>
                        </span>
                    </div>
    }else if(status===CONSTANTS.messageTypes.ERROR){
        modalBody=<div>Error</div>
    }

    return (



<div className={clsx('modal',isVisible?'is-active':false)}>
  <div class="modal-background"></div>
  <div class="card">
    <header class="modal-card-head has-background-white">
      <p class="modal-card-title">{message}</p>
      <button class="delete ml-3 is-info" aria-label="close" onClick={onClose}></button>
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