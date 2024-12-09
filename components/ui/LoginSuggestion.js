import { mdiAccount, mdiAccountCircle } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";





export default function LoginSuggestion({visible,onDeactivate,onAgree,onOk,onCancel}) {



    return <div className={clsx('modal',visible?'is-active':'')}>
            <div class="modal-background" onClick={onCancel}></div>
            <div className={clsx('modal-card','login-suggestion')}>
           
    <section className="modal-card-body p-4">
      <div className={clsx('columns')}>
          <div className={clsx('column','is-full')}>
              <div className={'header'}>
                  <div className={'level'}>
                      <div className={'level-left'}>
                      <span className={clsx('level-item','has-text-warning')}><Icon path={mdiAccountCircle} size={1}></Icon></span>
                      <span className={'level-item'}>Hello there !</span>
                      </div>
                      <hr className={clsx('seperator')}/>
                </div>
            </div>
             <p className={clsx('title','is-6','ml-4','mt-4')}>Login to continue.</p>  
            <footer>
      <button className={clsx('button','is-info','mr-4','ml-4','is-rounded')} onClick={onOk}>Login</button>
      <button className={clsx('button','is-info','is-inverted','is-rounded')} onClick={onCancel}>Cancel</button>
    </footer>
          </div>
        </div>
   
    </section>
  
  </div>

</div>
    
}