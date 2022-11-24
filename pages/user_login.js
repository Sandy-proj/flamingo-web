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
import ForgotPassword from '../components/ui/ForgotPassword';
import { CommonErrorCodes } from '../components/Util/ErrorCodes';
const qs = require('qs')

export default function Login({isLoggedIn,role,onLoginChange}){
    const router = useRouter();

    const [credentials,setCredentials] = useState({emailId:'',password:''}); 
    const [loginStatus,setLoginStatus] = useState({isLoggedIn:false,id:-1,role:'GUEST'});
    const [loginAttempts,setLoginAttempts] = useState(0);
    const user = useContext(AuthorizationContext)
    const loginUrl = CONSTANTS.LOGIN_URL;
    const socialLoginUrl = CONSTANTS.HOPS_SOCIAL_URL;
    const [validations,setValidations] = useState({emailLengthFail:false,passwordLengthFail:false,validEmailFail:false,validPasswordFail:false,loginFail:false,notUser:false,serverError:false})
    const forgotPasswordUrl= CONSTANTS.FORGOT_PASSWORD_URL
    const handleSubmit = async (e)=>{
        //e.preventDefault();
        if(validateLogin()){
            try{

                const response = await axios.post(loginUrl,qs.stringify({emailId:credentials.emailId,password:credentials.password}));


                if(response.data.result===CONSTANTS.SUCCESS&&response.data.data){
                    var user = buildUser(response.data.data.userId,response.data.data.role,response.data.data.preferences,response.data.data.username)
                    localStorage.setItem(CONSTANTS.HOPS_USERNAME_KEY,response.data.data.username)
                    onLoginChange(user);
                }else{
                    if(response.data.result==='FAIL'&&response.data.error.code===CommonErrorCodes.AUTH.UNAUTHORIZED){
                        setLoginAttempts(loginAttempts+1);
                        setCredentials({...credentials,password:''})
                        setValidations({loginFail:true})
                    }else if(response.data.result==='FAIL'&&response.data.error.code===CommonErrorCodes.AUTH.USER_NOT_FOUND){

                        setValidations({notUser:true})
                    }
                    else{
                        setValidations({serverError:true})
                    }
                }
               
    
            }catch(e){

                setValidations({serverError:true})
            }
        }
        
    }
   useEffect(()=>{
        if(user.isLoggedIn===true){
           
            router.push('/');
        }
    },[user.isLoggedIn,loginAttempts])

   
    async function handleKeyPress(e){
        if(e.key==='Enter'){
          await handleSubmit();
        }
      }
      function isEmailValid(){
        const pattern = CONSTANTS.EMAIL_VALIDATION_PATTERN;
        if (pattern.test(credentials.emailId))
        return true;
        return false;
    }

    function isPasswordValid(){
        const pattern = CONSTANTS.PASSWORD_VALIDATION_PATTERN;
        if(pattern.test(credentials.password))
        return true;
        return false;
    }

    function validateLogin(){

        let validationObject = {};
        
        //Validations for email id field.
        validationObject.emailLengthFail = credentials.emailId.length===0?true:false;

        validationObject.validEmailFail = !validationObject.emailLengthFail&&!isEmailValid()?true:false

        

        //Validations for password field. 
        validationObject.passwordLengthFail = credentials.password.length===0?true:false;

        validationObject.validPasswordFail = !validationObject.passwordLengthFail&&!isPasswordValid()?true:false;

        setValidations(validationObject)

        for(const property in validationObject){
            if(validationObject[property])
            return false;
        }

        return true;
    }

    return (<BaseLayout use="default">
        
        <div>
            <Head>
                <title>KandyBag</title>
                <link rel="icon" href="/tinylogo.png" />
                <script src={'https://accounts.google.com/gsi/client'} ></script>
            </Head>
        </div>
        
        <div className={clsx('columns','min-screen-fill')}>
           
            <div className={clsx('column','is-one-third','is-offset-one-third','centeralignment')}>
                <section className="section">
                <div className="box pt-4 pb-4 pl-6 pr-6">
             
                    <form>
                        <div className="columns is-mobile block level mb-8">
                            <div className="level-left column is-narrow">
                                <span><figure className = {clsx('image','is-24x24','mr-2') }> 
                                    <img src="/headerlogo.png"/>
                                </figure></span>
                                <span><p className="title is-5 is-grouped is-grouped-centered">KandyBag</p></span>
                            </div>
                            <div className={clsx('column','is-auto')}></div>
                        </div>

                        <div className="field">
                          <p className="control">
                          <input className={clsx('stylized-input','is-size-6','mt-4')} value={credentials.emailId} placeholder="Email Id" onChange={(e)=>setCredentials({...credentials,emailId:e.target.value})}/>
                            {/* <span class={clsx("icon", "is-left", "centeralignment")} >
                                <Icon path={mdiAccount} size={1}></Icon>

                            </span> */}
                          </p>
                        </div> 
                        <div className="field">
                            <p className={clsx('control')}>
                                <input className={clsx('stylized-input','is-size-6')} value={credentials.password} placeholder="Password" type="password" onChange={(e)=>setCredentials({...credentials,password:e.target.value})} onKeyPress={handleKeyPress}/>    
                                {/* <span class={clsx('icon','is-left','centeralignment')}>
                                    <Icon path={mdiLock} size={1}></Icon>
                                </span> */}
                            </p>
                         </div>
                          
                        <div>
                            {validations.emailLengthFail&&<p className={'is-light','has-text-danger'}>&#8226;Email field is empty.</p>}
                            {validations.passwordLengthFail&&<p className={'is-light','has-text-danger'}>&#8226;Password field is empty.</p>}
                            {validations.validEmailFail&&<p className={'is-light','has-text-danger'}>&#8226;Invalid emailId</p>}
                            {validations.validPasswordFail&&<p className={'is-light','has-text-danger'}>&#8226;Invalid password.<br/></p>}
                            {validations.loginFail&&<p className={'is-light','has-text-danger'}>&#8226;Incorrect credentials.<br/></p>}
                            {validations.serverError&&<p className={'is-light','has-text-danger'}>&#8226;An error occured while processing<br/>your request.</p>}
                            {validations.notUser&&<p className={'is-light','has-text-danger'}>&#8226;emailId is invalid.</p>}
                            {loginAttempts>3&&<p className={'is-light','has-text-danger'}>&#8226;Exceeded maximum attempts, try <br/>to reset your password.<br/></p>}
                        </div>
                         <div className={clsx('is-full','column','centeralignment','mt-2','mb-0')}>
                              <div className="button is-rounded is-info is-fullwidth" onClick={handleSubmit}><strong>Login</strong></div>
                         </div>
                        <hr className={clsx('divider','mb-4')}></hr>
                        <div className={clsx('mb-6','mt-4')}>
                        <div id="g_id_onload"
                       data-client_id={CONSTANTS.OAUTH_CLIENT_ID}
                       data-context="signin"
                       data-ux_mode="popup"
                       data-login_uri={socialLoginUrl}
                       data-auto_prompt="false">
                  </div>

                  <div class="g_id_signin"
                       data-type="standard"
                       data-shape="pill"
                       data-theme="outline"
                       data-text="continue_with"
                       data-size="large"
                       data-logo_alignment="left">
                  </div>
                
                        </div>
                        <div className={clsx('level mb-1 mt-4')}>
                            <div className="level-left"><Link href='/user_signup'><a className="is-size-6"><p className="is-link is-light is-small">Sign up</p></a></Link></div>
                            <div className="level-right"><Link href='/forgot_password'><a className="is-size-6"><span className="is-link is-light is-small">Forgot password?</span></a></Link></div>
                            
                        </div>
                        <div className={clsx('buttons','centeralignment','mt-4')}>
                               <Link href='/'>
                      <a className={clsx('button','is-info','is-light','hoverzoom','is-rounded')}>
                        <strong>Home</strong>
                      </a>
                    </Link>
                    </div>
                    </form>
        
                   
                </div> 
                </section>
                
            </div>
            
            </div>
        </BaseLayout>);
}