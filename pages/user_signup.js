

import { useEffect, useState } from 'react';
import BaseLayout from '../components/ui/BaseLayout'
import axios from 'axios';
import Link from 'next/link'
import {Icon} from '@mdi/react'
import {mdiAccount,mdiLock} from '@mdi/js'
import {useRouter} from 'next/router'
import clsx from 'clsx'
export default function SignUp({permissions}){
    const router = useRouter();
    const [credentials,setCredentials] = useState({emailId:'',passWord:''}); 
    const [loginStatus,setLoginStatus] = useState(undefined);
    const [loginAttempts,setLoginAttempts] = useState(0);
    const handleSubmit = (e)=>{
        e.preventDefault();
      
        //axios.post('http://localhost:3000/user/login',{emailId:credentials.emailId,password:credentials.passWord}).then((response)=>console.log(response)).catch(error=>console.log(error));
        
        setLoginStatus(true)
        //setLoginAttempts(loginAttempts+1);

    }
   useEffect(()=>{
        if(loginStatus===true){
            console.log(onLoginChange);
            onLoginChange(true);
            router.push('/');
        }
    },[loginStatus,loginAttempts])
    function validateLogin(){

        if(credentials.emailId.length>0 && credentials.passWord.length>0){
            return true;
        }
        return false;
    }
    
    return (<BaseLayout use="default">
        <div className="columns">
            <div className="column is-one-third is-offset-one-third">
                <section className="section is-small">
                <div className="box">
                   
                    <form>
                        <p className="title is-5 is-grouped is-grouped-centered">HopSquare</p>
                        <div className="field">
                        <p className="control has-icons-left">
                            <input className="input is-rounded" value={credentials.emailId} placeholder="Email Id" onChange={(e)=>setCredentials({...credentials,emailId:e.target.value})}/>
                            <span class={clsx("icon", "is-left", "centeralignment")} >
                                <Icon path={mdiAccount} size={1}></Icon>

                            </span>
                
                        </p>
                        </div> 
                        <div className="field">
                        <p className="control has-icons-left">
                            <input className="input is-rounded" value={credentials.passWord} placeholder="Password" type="password" onChange={(e)=>setCredentials({...credentials,passWord:e.target.value})}/>    
                            <span class={clsx("icon", "is-left", "centeralignment")} >
                                <Icon path={mdiLock} size={1}></Icon>

                            </span>
                
                        </p>
                        </div>
                        <div className="field">
                        <p className="control has-icons-left">
                            <input className="input is-rounded" value={credentials.passWord} placeholder="Confirm password" type="password" onChange={(e)=>setCredentials({...credentials,passWord:e.target.value})}/>    
                            <span class={clsx("icon", "is-left", "centeralignment")} >
                                <Icon path={mdiLock} size={1}></Icon>

                            </span>
                
                        </p>
                        </div>
                        <label class="field checkbox">
                            <input type="checkbox"/>
                                 I agree to the <a href="#">terms and conditions</a>
                               
                        </label>
                        <div className={clsx('is-full','column','is-flex','is-flex-direction-row','is-justify-content-center','centeralignment')}>
                              <div className="button is-rounded is-info is-align-self-stretch" onClick={handleSubmit}>Signup</div>
                         </div>

                        <div className="field is-grouped is-grouped-centered">
                            <div className="field"><Link href='/'><a className="button is-light">Go Home</a></Link></div>                            
                        </div>
                        <div>
                            {permissions}

                            {loginAttempts>0&&<div className="field"><label >Your login attempt failed. Please check your credentials and try again.</label></div>}
                        </div>
                    </form>
        
                   
                </div> 
                </section>
                
            </div>
            </div>
        </BaseLayout>);
}