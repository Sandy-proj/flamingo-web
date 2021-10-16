import { mdiCloseCircle } from "@mdi/js";
import clsx from "clsx";





export default function Error({visible,onOk}) {


    return <div className={clsx('modal',visible?'is-active':'')}>
    <div class="modal-background" onClick={onCancel}></div>
    <div class="modal-card">
   
<section class="modal-card-body p-4">s
<div className={clsx('columns')}>
  <div className={clsx('column','is-full')}>
      <div className={'header'}>
          <div className={'level'}>
              <div className={'level-left'}>
              <span className={clsx('level-item','has-text-danger')}><Icon path={mdiCloseCircle} size={1}></Icon></span>
              <span className={'level-item'}>Error</span>
              </div>
        </div>
    </div>
     <p className={clsx('title','is-6','ml-4','mt-4')}>An error occured on the server.</p>  
    <footer>
<button className={clsx('button','is-info','is-inverted','is-rounded')} onClick={onOk}>Ok</button>
</footer>
  </div>
</div>

</section>

</div>

</div>
    
}