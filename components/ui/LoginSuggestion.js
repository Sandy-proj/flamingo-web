import { mdiAccount, mdiAccountCircle } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";





export default function LoginSuggestion({visible,onDeactivate,onAgree,onOk,onCancel}) {



    return <div className={clsx('modal',visible?'is-active':'')}>
            <div class="modal-background" onClick={onCancel}></div>
            <div className={clsx('modal-card','login-suggestion')}>
           
    <section className="modal-card-body">
      <div className={clsx('columns','is-mobile')}>
          <div className={clsx('column','is-full')}>
              <div className={clsx('header')}>
                  <div className={clsx('level')}>
                      <div className={'level-left'}>
                      <span className={clsx('level-item','has-text-link')}><Icon path={mdiAccountCircle} size={1}></Icon></span>
                      <span className={clsx('level-item','is-6','title')}>Hello there !</span>
                      </div>
                      <hr className={clsx('seperator')}/>
                </div>
            </div>
             <p className={clsx('is-6','ml-4','mt-4')}>Login to continue.</p>  
            <footer className="mt-5">
      <button className={clsx('button','is-info','is-small','mr-4','ml-2','is-rounded')} onClick={onOk}>Login</button>
      <button className={clsx('button','is-info','is-inverted','is-small','is-rounded')} onClick={onCancel}>Cancel</button>
    </footer>
          </div>
        </div>
   
    </section>
  
  </div>

</div>
    
}