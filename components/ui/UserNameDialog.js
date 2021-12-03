import clsx from "clsx";
import { useContext, useEffect, useState } from "react";
import { AuthorizationContext } from "../Util/AuthContext";
import axios from 'axios'
import {Icon} from '@mdi/react'
import {mdiCheckboxBlankOutline,mdiCheck, mdiClose, mdiAccountQuestion} from '@mdi/js'
import { CONSTANTS } from "../Util/Constants";





export default function UserNameDialog({visible,onDeactivate}) {

    const [isVisible,setIsVisible] = useState(false);
    const [username,setUsername] = useState('');
    const [validation,setValidation] = useState(false);
    const user = useContext(AuthorizationContext);
    const [isAvailable,setIsAvailable] = useState('MAYBE')//Maintain three states YES/NO/MAYBE
    const [isAvailabilityCheck,setIsAvailabilityCheck] = useState(false)
    const [serverError,setServerError] = useState(false);
    const availabilityUrl = CONSTANTS.USER_NAME_AVAILABLE_URL;
    const updateUsernameUrl = CONSTANTS.USERNAME_UPDATE_URL;
    async function  handleSubmit(e){
         
        if(username.trim()==='') //Return without any action in case of empty string.
        return;
        await handleUserNameQuery(e);
        //console.log(isAvailable+"-"+validation+'-'+serverError)
        if(!validation&&!serverError&&(isAvailable==='YES')){
            const response = await axios.post(updateUsernameUrl,{username:username},{timeout:CONSTANTS.REQUEST_TIMEOUT});
            
            if(response.data.result&&response.data.result==='SUCCESS'){
                if(response.data.data&&response.data.data.username){
                  // localStorage.setItem(CONSTANTS.HOPS_USERNAME_KEY,response.data.data.username)
                  user.initiateHandshake(true)
                }
            }else {
               
            }
        }
    }

    useEffect(()=>{
        //console.log('username:'+user&&user.username)
        if(user&&user.isLoggedIn&&user.username.trim()!=''){
            setIsVisible(false)
        }
    },[user.username])

    function isUserNameValid(){
        const pattern = CONSTANTS.USERNAME_VALIDATION_PATTERN;
        if(pattern.test(username))
        return true;
        return false;
    }

    async function handleUserNameQuery(e){
        e.preventDefault();
        setValidation(false);
        setServerError(false);
        
        if(username.trim()==='') //Return without any action in case of empty string.
        return;


        if(!isUserNameValid()){                 
            setValidation(true);
            return;
        }

        try{
            setIsAvailabilityCheck(true)
            const response = await axios.get(availabilityUrl+username,{timeout:CONSTANTS.REQUEST_TIMEOUT});
            //const response = await axios.post(loginUrl,params)
            if(response.status===CONSTANTS.GET_SUCCESS){
                if(response.data.result&&response.data.result==='SUCCESS'){
                    if(response.data.data&&response.data.data.available){
                        setIsAvailable('YES');
                    }else{
                        setIsAvailable('NO')
                    }
                }else if(response.data.result&&response.data.result==='FAIL'){
                    if(response.data.error&&response.data.error.code==='017'){
                        setValidation(true)
                    }
                }else{
                    setServerError(true)
                }
            }else{
                setServerError(true)
            }
           
           

        }catch(e){
            //console.log(e)
            setServerError(true)
        }finally{
            setIsAvailabilityCheck(false)
        }

    }




    useEffect(()=>{
        if(user.isLoggedIn&&localStorage.getItem(CONSTANTS.HOPS_USERNAME_KEY)==='')
            setIsVisible(true);
    },[user.isLoggedIn,user.username])

    return <div className={clsx('modal',isVisible?'is-active':'')}>
            <div class="modal-background" onClick={()=>onDeactivate(false)}></div>
            <div class="modal-content">
                <div className={clsx('box')}>
                <article>
                        
                        <div className={clsx('content')}>
                          
                        <form>
                        <div className="block level mb-8">
                            <div className="level-left">

                                <p className="level-item title is-5 is-grouped is-grouped-centered">Choose a username.</p>
                            </div>
                        </div>
                       

                        <hr className={clsx('solid','mt-4','mb-4')}/>

                        <p className="control has-icons-left">
                            <input className={clsx('stylized-input','is-size-6')} value={username} placeholder="Choose a user name"  onChange={(e)=>{setIsAvailable('MAYBE');setUsername(e.target.value)}}/>    
                                         
                        </p>
                        <p className={clsx('mb-6')}>
                        <button className={clsx('mt-1','is-light','button',isAvailable==='MAYBE'?'is-info':isAvailable==='YES'?'is-success':'is-danger','is-small',isAvailabilityCheck?'is-loading':'')}  onClick={handleUserNameQuery}>{isAvailable==='YES'?<span><Icon path={mdiCheck} size={0.75}></Icon></span>:''}<strong>
                            {isAvailable==='MAYBE'?'Available?':isAvailable==='YES'?'YES!':'Try another..'}</strong></button>
                        </p>
                        
                        <div>
                            {validation&&<p className={'is-light','has-text-danger'}>&#8226;Invalid user name.</p>}
                            {serverError&&<p className={'is-light','has-text-danger'}>&#8226;An error occured on the server.</p>}
                        </div>
                  
                   
                   
                   
                    

                        <div className={clsx('buttons','centeralignment','mt-2')}>
                   
                      <a className={clsx('button','is-info')} disabled={isAvailable==='YES'?false:true} onClick={handleSubmit}>
                        <strong>Confirm</strong>
                      </a>
                    
                   
                  </div>
                      
                        <div>
                            

                               </div>
                    </form>
     

                        </div>

                     </article>
                </div>
           
            </div>
            <button class="modal-close is-large" aria-label="close" onClick={()=>onDeactivate(false)}>Ok</button>
        </div>
    



    


}


