import { useContext, useEffect, useState } from 'react';
import BaseLayout from '../components/ui/BaseLayout'
import axios from 'axios';
import Link from 'next/link'
import Head from 'next/head'
import {Icon} from '@mdi/react'
import {mdiAccount,mdiLock} from '@mdi/js'
import {useRouter} from 'next/router'
import clsx from 'clsx'
import { buildUser } from '../components/Util/Session';
import {CONSTANTS} from  '../components/Util/Constants'
import { AuthorizationContext } from '../components/Util/AuthContext';
import loadCustomRoutes from 'next/dist/lib/load-custom-routes';
const qs = require('qs')

export default function Login({isLoggedIn,role,onLoginChange}){
    const router = useRouter();

    const [credentials,setCredentials] = useState({emailId:'',password:''}); 
    const [loginStatus,setLoginStatus] = useState({isLoggedIn:false,id:-1,role:'GUEST'});
    const [loginAttempts,setLoginAttempts] = useState(0);
    const user = useContext(AuthorizationContext)
    const loginUrl = '/hopsapi/user/login'
    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            
            const response = await axios.post(loginUrl,qs.stringify({emailId:credentials.emailId,password:credentials.password}));
            //const response = await axios.post(loginUrl,params)
            if(response.data.status==='FAIL'){
                setLoginAttempts(loginAttempts+1);
            }else{
                var user = buildUser(response.data.data.userId,response.data.data.role,response.data.data.preferences)
                onLoginChange(user);
                
               
            }

        }catch(e){
            console.error(e)
        }
    }
   useEffect(()=>{
        if(user.isLoggedIn===true){
           
            router.push('/');
        }
    },[user.isLoggedIn,loginAttempts])

    function validateLogin(){

        if(credentials.emailId.length>0 && credentials.passWord.length>0){
            return true;
        }
        return false;  
    }
    console.log('Login-status:'+(isLoggedIn?'logged in':'logged out')+' role:'+role)
    return (<BaseLayout use="default">
        
        <div>
            <Head>
                <title>HopSquare</title>
                <link rel="icon" href="/tinylogo.png" />
            </Head>
        </div>
        
        <div className={clsx('columns','min-screen-fill')}>
           
            <div className={clsx('column','is-one-third','is-offset-one-third','centeralignment')}>
                <section className="section">
                <div className="box">
             
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
                          <input className="input is-rounded " value={credentials.emailId} placeholder="Email Id" onChange={(e)=>setCredentials({...credentials,emailId:e.target.value})}/>
                            <span class={clsx("icon", "is-left", "centeralignment")} >
                                <Icon path={mdiAccount} size={1}></Icon>

                            </span>
                          </p>
                        </div> 
                        <div className="field">
                            <p className="control has-icons-left">
                                <input className="input is-rounded" value={credentials.password} placeholder="Password" type="password" onChange={(e)=>setCredentials({...credentials,password:e.target.value})}/>    
                                <span class={clsx('icon','is-left','centeralignment')}>
                                    <Icon path={mdiLock} size={1}></Icon>
                                </span>
                            </p>
                         </div>
                         <div className={clsx('is-full','column','centeralignment','mb-4')}>
                              <div className="button is-rounded is-info is-align-self-stretch" onClick={handleSubmit}><strong>Login</strong></div>
                         </div>

                        <div className={clsx('level mb-1')}>
                            <div className="level-item "><Link href='/user_signup'><a className="is-size-6"><span className="is-link">Sign up</span></a></Link></div>
                            <div className="level-item "><Link href='/reset_password'><a className="is-size-6">Forgot Password?</a></Link></div>
                            
                        </div>
                        <div>
                            {loginAttempts>0&&<div className="field"><label >Your login attempt failed. Please check your credentials and try again.</label></div>}
                        </div>
                    </form>
        
                   
                </div> 
                </section>
                
            </div>
            </div>
        </BaseLayout>);
}