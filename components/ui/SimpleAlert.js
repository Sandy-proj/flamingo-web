import clsx from 'clsx';
import { isValidElement, useState } from 'react';
import {Icon} from '@mdi/react'
import {mdiAlert, mdiCheckBold} from '@mdi/js'
import { CONSTANTS } from '../Util/Constants';

export default function SimpleAlert({message,onCancel,onClose,isVisible,onConfirm,children}){
    const [modalStatus,setStatus] = useState(isVisible);
    function handleClose(){
        setStatus(false);
    }
    let modalBody=<div>{message}</div>;
   

    return (
<div className={clsx('modal',isVisible?'is-active':'')}>
            <div class="modal-background" onClick={onCancel}></div>
            <div class="modal-card">
           
    <section class="modal-card-body p-4">
      <div className={clsx('columns')}>
          <div className={clsx('column','is-full')}>
              <div className={'header'}>
                  <div className={'level'}>
                      <div className={'level-left'}>
                      <span className={clsx('level-item','has-text-warning')}><Icon path={mdiAlert} size={1}></Icon></span>
                      <span className={'level-item'}>Hello there !</span>
                      </div>
                </div>
            </div>
             <p className={clsx('title','is-6','ml-4','mt-4')}>Enter a title to save the data.</p>  
            <footer>
      <button className={clsx('button','is-info','mr-4','ml-4','is-rounded')} onClick={onConfirm}>OK</button>
     
    </footer>
          </div>
        </div>
   
    </section>
  
  </div>

</div>

    );

}