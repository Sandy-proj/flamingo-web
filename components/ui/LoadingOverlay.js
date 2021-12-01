import clsx from "clsx";





export default function Loader({visible,onDeactivate,onAgree}) {



    return <div className={clsx('modal',visible?'is-active':'')}>
            <div className={clsx('modal-background','has-background-white','centeralignment')} onClick={()=>onDeactivate(false)}></div>
            <div className={clsx('modal-content')}>
               
                <article>
                         
                        <div className={clsx('content','centeralignment')}>
                        <div>
                <div className={clsx('loader','centeralignment')}></div>
                <div className={clsx('is-size-4','mt-4')}>Loading...</div>
            </div>
                        </div>
                        

                     </article>
             
            </div>
            <button class="modal-close is-large" aria-label="close" onClick={()=>onDeactivate(false)}>Ok</button>
        </div>
       }