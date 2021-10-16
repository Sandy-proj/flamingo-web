

import { useContext, useEffect, useState } from 'react';
import BaseLayout from '../components/ui/BaseLayout'
import axios from 'axios';
import Link from 'next/link'
import {Icon} from '@mdi/react'
import {mdiAccount,mdiClockTimeSix,mdiLock} from '@mdi/js'
import {useRouter} from 'next/router'
import Head from 'next/head'
import clsx from 'clsx'
import { buildUser } from '../components/Util/Session';
import { AuthorizationContext } from '../components/Util/AuthContext'
const qs = require('qs')

export default function SignUp({onLoginChange}){
    const router = useRouter();
    const user = useContext(AuthorizationContext)
    const [credentials,setCredentials] = useState({emailId:'',username:'',password:'',passwordshadow:''}); 
    // const [loginStatus,setLoginStatus] = useState(undefined);
    // const [loginAttempts,setLoginAttempts] = useState(0);
    

    const signupUrl = '/hopsapi/user/sign_up'



    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(validateLogin()){
            try{
            
                const response = await axios.post(signupUrl,qs.stringify({emailId:credentials.emailId,username:credentials.emailId,password:credentials.password}));
                //const response = await axios.post(loginUrl,params)
                if(response.data.status==='FAIL'){
                   
                }else{
                    var user = buildUser(response.data.data.userId,response.data.data.role,response.data.data.preferences)
                    onLoginChange(user)
                }
    
            }catch(e){
                console.error(e)
            }
        }else{

        }
       

    }
   useEffect(()=>{
        if(user.isLoggedIn){
           
            router.push('/');
        }
    },[user.isLoggedIn])
    function validateLogin(){

        if(credentials.emailId.length>0 && credentials.password.length>0){
            return true;
        }
        return false;
    }
    
    return (<BaseLayout use="default">
         <div>
            <Head>
                <title>HopSquare</title>
                <link rel="icon" href="/tinylogo.png" />
            </Head>
        </div>
        
        <div className={clsx('columns','min-screen-fill')}>
            <div className={clsx('column','is-narrow','is-one-third','is-offset-one-third','centeralignment')}>
                <section className="section is-small">
                <div className="box pt-4 pb-4 pl-6 pr-6">
                   
                    <form>
                    <div className="block level mb-8">
                            <div className="level-left">
                                <figure className = {clsx('image','is-24x24','mr-2') }> 
                                    <img src="/headerlogo.png"/>
                                </figure>
                                <p className="title is-5 is-grouped is-grouped-centered">HopSquare</p>
                            </div>
                        </div>
                        <div className="field">
                        <p className="control has-icons-left">
                            <input className='stylized-input' value={credentials.emailId} placeholder="Email Id" onChange={(e)=>setCredentials({...credentials,emailId:e.target.value})}/>
                            {/* <span class={clsx("icon", "is-left", "centeralignment")} >
                                <Icon path={mdiAccount} size={1}></Icon>

                            </span> */}
                
                        </p>
                        </div> 
                        <div className="field">
                        <p className="control has-icons-left">
                            <input className="stylized-input" value={credentials.passWord} placeholder="Password" type="password" onChange={(e)=>setCredentials({...credentials,password:e.target.value})}/>    
                            {/* <span class={clsx("icon", "is-left", "centeralignment")} >
                                <Icon path={mdiLock} size={1}></Icon>

                            </span> */}
                
                        </p>
                        </div>
                        <div className="field">
                        <p className="control has-icons-left">
                            <input className="stylized-input" value={credentials.passWord} placeholder="Confirm password" type="password" onChange={(e)=>setCredentials({...credentials,passwordshadow:e.target.value})}/>    
                            {/* <span class={clsx("icon", "is-left", "centeralignment")} >
                                <Icon path={mdiLock} size={1}></Icon>

                            </span> */}
                
                        </p>
                        </div>

                        <hr className={clsx('solid','mt-4','mb-4')}/>

                        <p className="control has-icons-left">
                            <input className="stylized-input" value={credentials.username} placeholder="Choose a user name"  onChange={(e)=>setCredentials({...credentials,username:e.target.value})}/>    
                            {/* <span class={clsx("icon", "is-left", "centeralignment")} >
                                <Icon path={mdiLock} size={1}></Icon>

                            </span> */}
                
                        </p>
                        <p className={clsx('mb-6')}>
                        <button className={clsx('button','is-info','is-small')} value='Check availability'>Available?</button>
                        </p>
                        

                        <label className={clsx('field','mt-5')}>
                            <input type="checkbox"/>
                                 I agree to the <a href="#">terms and conditions</a>
                               
                        </label>

                        <div className={clsx('buttons','centeralignment')}>
                   
                      <a className={clsx('button','is-info', 'is-light','hoverzoom')} onClick={handleSubmit}>
                        <strong>Sign up</strong>
                      </a>
                    
                    <Link href='/'>
                      <a className={clsx('button','is-light','hoverzoom')}>
                        Home
                      </a>
                    </Link>
                  </div>
                        {/* <div className={clsx('is-full','column','is-flex','is-flex-direction-row','is-justify-content-center','centeralignment')}>
                              <div className="button is-rounded is-info is-align-self-stretch" onClick={handleSubmit}>Signup</div>
                         </div>

                        <div className="field is-grouped is-grouped-centered">
                            <div className="field"><Link href='/'><a className="button is-light">Go Home</a></Link></div>                            
                        </div> */}
                        <div>
                            

                               </div>
                    </form>
        
                   
                </div> 
                </section>
                
            </div>
            </div>
        </BaseLayout>);
}