

import { useContext, useEffect, useState } from 'react';
import BaseLayout from '../components/ui/BaseLayout'
import axios from 'axios';
import Link from 'next/link'
import {Icon} from '@mdi/react'
import {mdiCheckboxBlankOutline,mdiCheck, mdiClose, mdiAccountQuestion} from '@mdi/js'
import {useRouter} from 'next/router'
import Head from 'next/head'
import clsx from 'clsx'
import { buildUser } from '../components/Util/Session';
import { AuthorizationContext } from '../components/Util/AuthContext'
import { CONSTANTS } from '../components/Util/Constants';
import Terms from '../components/ui/Terms';
import PrivacyPolicy from '../components/ui/PrivacyPolicy';
const qs = require('qs')

export default function SignUp({onError,onLoginChange}){
    const router = useRouter();
    const user = useContext(AuthorizationContext)
    const [termsAndConditions,setTermsAndConditions] = useState(false);
    const [privacyPolicy, setPrivacyPolicy] = useState(false);
    const[isAgreed,setIsAgreed] = useState(false)
    const socialLoginUrl = CONSTANTS.HOPS_SOCIAL_URL;
    const [credentials,setCredentials] = useState({emailId:'',username:'',password:'',passwordshadow:''}); 
    const [isSigningUp,setIsSigningUp] = useState(false)
    const [validations,setValidations] = useState({emailLengthFail:false,passwordLengthFail:false,validEmailFail:false,validPasswordFail:false,emailInUse:false,signUpAttempFail:false,validCopyPasswordFail:false})
    const [isAvailable,setIsAvailable] = useState('MAYBE')//Maintain three states YES/NO/MAYBE
    const [isAvailabilityCheck,setIsAvailabilityCheck] = useState(false)

    const signupUrl = CONSTANTS.SIGN_UP_URL
    const availabilityUrl = CONSTANTS.USER_NAME_AVAILABLE_URL;



    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(validations.signUpAttempFail){
            let newObj  = Object.assign({},validations)
            newObj.signUpAttempFail = false;
            setValidations(newObj)
        }
   
        // if(validations.validUserNameFail){
            await handleUserNameQuery(e);
            if(validations.validUserNameFail){
               return;
            }
        // }
        
        if(validateSignUp()){
            try{
            
                const response = await axios.post(signupUrl,qs.stringify({emailId:credentials.emailId.toLowerCase(),username:credentials.username,password:credentials.password}));
                //const response = await axios.post(loginUrl,params)

                if(response.status===CONSTANTS.POST_SUCCESS){
                    if(response.data.result&&response.data.result.signup==='SUCCESS'&&response.data.result.email==='SUCCESS'){
                        var user = buildUser(response.data.data.userId,response.data.data.role,response.data.data.preferences,response.data.data.username)
                        onLoginChange(user)
                        router.push('/')
                    }else if(response.data.result.email==='FAIL'){
                        if(response.data.error.code==='014'){
                            let newObj  = {}
                            newObj.emailInUse = true;
                            setValidations(newObj)
                        }else{
                            let newObj  = {}
                            newObj.signUpAttempFail = true;
                            setValidations(newObj)
                        }
                    }else{
                        //let newObj  = Object.assign({},validations);
                        let newObj  = {}
                        newObj.signUpAttempFail = true;
                        setValidations(newObj)
                    }
                }else{
                    onError(CONSTANTS.FAILED_TO_CONNECT)
                }
               
    
            }catch(e){

                let newObj = {}
                newObj.signUpAttempFail = true;
                setValidations(newObj)
            }
        }else{
            //Do nothing
        }
       

    }


    async function handleUserNameQuery(e){
        e.preventDefault();
        if(credentials.username.trim()==='') //Return without any action in case of empty string.
        return;


        if(!isUserNameValid()){                 
            let newObj  = Object.assign({},validations);
            newObj.validUserNameFail = true;
            setValidations(newObj)
            return;
        }
        if(validations.validUserNameFail){
            let newObj  = Object.assign({},validations);
            newObj.validUserNameFail = false;
            setValidations(newObj)
        }
        try{
            setIsAvailabilityCheck(true)
            const response = await axios.get(availabilityUrl+credentials.username,{timeout:CONSTANTS.REQUEST_TIMEOUT});
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
                        let newObj  = Object.assign({},validations);
                        newObj.validUserNameFail = true;
                        setValidations(newObj)
                    }
                }else{
                    setValidations({serverError:true})
                }
            }else{
                setValidations({serverError:true})
            }
           
           

        }catch(e){
            setValidations({serverError:true})
        }finally{
            setIsAvailabilityCheck(false)
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

    function isCopyPasswordValid(){
        if(credentials.password===credentials.passwordshadow)
        return true;
        return false;
    }

    function isUserNameValid(){
        const pattern = CONSTANTS.USERNAME_VALIDATION_PATTERN;
        if(pattern.test(credentials.username))
        return true;
        return false;
    }

    

    function handleAgreement(){
        setIsAgreed(!isAgreed);
    }

    function handleTermsAndConditions(e){
         e.preventDefault();
        // setTermsAndConditions(true);
        window.open('/tos','_blank')
    }

   

    function handlePrivacyPolicy(e){
        e.preventDefault();
       // setPrivacyPolicy(true);
        window.open('/p_pol','_blank')
    }
   useEffect(()=>{
        if(user.isLoggedIn){
           
            router.push('/');
        }
    },[user.isLoggedIn])

    //Validate and set/clear the flags for the form. 
    function validateSignUp(){
        let validationObject = {};
        
        //Validations for email id field.
        validationObject.emailLengthFail = credentials.emailId.length===0?true:false;

        validationObject.validEmailFail = !validationObject.emailLengthFail&&!isEmailValid()?true:false

        

        //Validations for password field. 
        validationObject.passwordLengthFail = credentials.password.length===0?true:false;

        validationObject.validPasswordFail = !validationObject.passwordLengthFail&&!isPasswordValid()?true:false;
       

        //Validation for copy password field
        validationObject.validCopyPasswordFail = !isCopyPasswordValid()?true:false;


        //Validtion for username
        validationObject.userNameLengthFail = credentials.username.length==0?true:false;

        validationObject.validUserNameFail = !validationObject.userNameLengthFail&&!isUserNameValid()?true:false;

       

        setValidations(validationObject);

        for(const property in validationObject){
            if(validationObject[property])
            return false;
        }
      
        if(isAgreed)
        return true;
        else
        return false;
    }
    
    return (<BaseLayout use="default">
         <div>
            <Head>
                <title>HopSquare</title>
                <link rel="icon" href="/tinylogo.png" />
                <script src={'https://accounts.google.com/gsi/client'} ></script>
            </Head>
        </div>
        
        <div className={clsx('columns','is-narrow','min-screen-fill')}>
            <div className={clsx('column','is-narrow','is-one-third','is-offset-one-third','centeralignment')}>
                <section className="section is-small">
                <div className="box pt-4 pb-4 pl-6 pr-6">
                   
                    <form>
                    <div className="block columns is-mobile level mb-8">
                            <div className="level-left column is-narrow">
                                <figure className = {clsx('image','is-24x24','mr-2','level-item') }> 
                                    <img src="/headerlogo.png"/>
                                </figure>
                                <p className="level-item title is-5 is-grouped is-grouped-centered">HopSquare</p>
                            </div>
                            <div className={clsx('column','is-auto')}></div>
                        </div>
                        <div className="field mt-4">
                        <p className="control has-icons-left">
                            <input className={clsx('is-size-6','stylized-input')} value={credentials.emailId} placeholder="Email Id" onChange={(e)=>setCredentials({...credentials,emailId:e.target.value})}/>
                       
                
                        </p>
                        </div> 
                        <div className="field mt-4">
                        <p className="control has-icons-left">
                            <input className={clsx('is-size-6','stylized-input')} value={credentials.passWord} placeholder="Password" type="password" onChange={(e)=>setCredentials({...credentials,password:e.target.value})}/>    
                     
                        </p>
                        </div>
                        <div className="field mt-4">
                        <p className="control has-icons-left">
                            <input className={clsx('stylized-input','is-size-6')} value={credentials.passWord} placeholder="Confirm password" type="password" onChange={(e)=>setCredentials({...credentials,passwordshadow:e.target.value})}/>    
                           
                        </p>
                        </div>

                        <hr className={clsx('solid','mt-4','mb-4')}/>

                        <p className="control has-icons-left">
                            <input className={clsx('stylized-input','is-size-6')} value={credentials.username} placeholder="Choose a user name"  onChange={(e)=>{setIsAvailable('MAYBE');setCredentials({...credentials,username:e.target.value})}}/>    
                                         
                        </p>
                        <p className={clsx('mb-6')}>
                        <button className={clsx('mt-1','is-light','button',isAvailable==='MAYBE'?'is-info':isAvailable==='YES'?'is-success':'is-danger','is-small',isAvailabilityCheck?'is-loading':'')}  onClick={handleUserNameQuery}>{isAvailable==='YES'?<span><Icon path={mdiCheck} size={0.75}></Icon></span>:''}<strong>
                            {isAvailable==='MAYBE'?'Available?':isAvailable==='YES'?'YES!':'Try another..'}</strong></button>
                        </p>
                        
                        <div>
                            {validations.emailLengthFail&&<p className={'is-light','has-text-danger'}>&#8226;Email field is empty.</p>}
                            {validations.passwordLengthFail&&<p className={'is-light','has-text-danger'}>&#8226;Password field is empty.</p>}
                            {validations.validEmailFail&&<p className={'is-light','has-text-danger'}>&#8226;Email id is not valid.</p>}
                            {validations.validPasswordFail&&<p className={'is-light','has-text-danger'}>&#8226;Password should consist of Capital letter,<br/>special character and a number.<br/></p>}
                            {validations.validCopyPasswordFail&&<p className={'is-light','has-text-danger'}>&#8226;The confirmation field does not match the password.</p>}
                            {validations.userNameLengthFail&&<p className={'is-light','has-text-danger'}>&#8226;Username is empty</p>}
                            {validations.validUserNameFail&&<p className={'is-light','has-text-danger'}>&#8226;Username is not valid.</p>}
                            {validations.emailInUse&&<p className={'is-light','has-text-danger'}>&#8226;This email id is not available.</p>}
                            {validations.signUpAttempFail&&<p className={'is-light','has-text-danger'}>&#8226;Attempt to sign up failed.Try again.</p>}
                            {validations.serverError&&<p className={'is-light','has-text-danger'}>&#8226;An error occured on the server.</p>}
                        </div>
                  
                   
                   
                   
                    
                    
                        <div className={clsx('buttons','centeralignment','mt-2')}>
                   
                        <div className={clsx('is-full','column','centeralignment','mt-2','mb-0')}>
                              <div className="button is-rounded is-info is-fullwidth" onClick={handleSubmit}><strong>Sign up</strong></div>
                         </div>
                    
                  
                  </div>
                  <hr className={clsx('divider')}></hr>
                        <div>
                            
                         <div className={clsx('mb-6','mt-4','centeralignment')}>
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
                       
                               </div>
                               <div className={clsx('mt-6')}>
                          <div className={clsx('level')}>
                            
                            {/* <Icon onClick={handleAgreement} className={clsx('level-item','mr-2')} path={isAgreed?mdiCheck:mdiCheckboxBlankOutline} size={1}></Icon> */}
                            <p className={clsx('has-text-grey',)} >
                           
                            By continuing, I agree to HopSquare's <br/> <a href="#" onClick={handleTermsAndConditions}>  &nbsp;Terms of service  &nbsp; </a> &nbsp;& <a href="#" onClick={handlePrivacyPolicy}>  &nbsp;Privacy policy. &nbsp; </a>  .
                            </p>
                           
                          </div>
                        
                    </div>
                               <div className={clsx('buttons','centeralignment','mt-2')}>
                               <Link href='/'>
                      <a className={clsx('button','is-info','is-light','hoverzoom')}>
                        <strong>Home</strong>
                      </a>
                    </Link>
                    </div>
                    </form>
        
                   
                </div> 
                </section>
                <Terms visible={termsAndConditions} onDeactivate={value=>setTermsAndConditions(value)}/>
                <PrivacyPolicy visible={privacyPolicy} onDeactivate={value =>setPrivacyPolicy(value)}/>
                </div>
            </div>
        </BaseLayout>);
}