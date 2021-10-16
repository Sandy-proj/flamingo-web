import { mdiCheck, mdiCheckCircle, mdiCloseCircle } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";
import Link  from "next/dist/client/link";




export default function Verification({visible,progress,error}) {


    let body = <div></div>
    if(progress){
        body=<div>
                 <div>
                    <div className={clsx('loader','centeralignment')}></div>
                    <div className={clsx('is-size-4','mt-4')}>Verification in progress...  </div>
                </div>
            </div>
    }else if(Object.keys(error).length>0){
        body=<div >
        <div>
             <div className={'has-text-danger'}><Icon path={mdiCloseCircle} size={2}></Icon></div> 
             {error.SERVER_ERROR&&<div>An error occured on the server</div>}
             {error.EXPIRED&&<div>The verification request has expired.<br/>Please <Link href="/"><a>try again.</a></Link></div>} 
                                   
       </div>   
   </div>
    }else{
        body=<div>
        <div>
             <div className={'has-text-success'}><Icon path={mdiCheckCircle} size={3}></Icon></div> 
            <div className={'title','is-4'}>Account verification is done.<br/>Please wait while we redirect you.</div>
                                   
       </div>
   </div>
    }

    return <div className={clsx('modal',visible?'is-active':'')}>
            <div class="modal-background"></div>
            <div class="modal-content">
                <div className={clsx('box','centeralignment')}>
                    {body}
                </div>

            </div>
        <button class="modal-close is-large" aria-label="close">Ok</button>
    </div>
}


