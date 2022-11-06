import axios from 'axios';
import Link from 'next/link'
import { useRouter } from 'next/router';
import Head from 'next/head'
import { useContext, useEffect, useState } from 'react';
import { AuthorizationContext } from '../components/Util/AuthContext';
import { CONSTANTS } from '../components/Util/Constants';
import BaseLayout from './../components/ui/BaseLayout'
import clsx from 'clsx';
import { CommonErrorCodes } from '../components/Util/ErrorCodes';
export default function ResetPassword({permissions,props}){
    const [input,setInput] = useState(''); 
    const [password,setPassword] = useState('')
    const [copyPassword,setCopyPassword]  = useState('');
    const [resetInProgress,setResetInProgress] = useState(false);
    const [reset,setReset] = useState(false)
    const [error,setError] =useState({})
    const router = useRouter();
    
    const user = useContext(AuthorizationContext);
    let resetPasswordUrl = CONSTANTS.RESET_PASSWORD_URL;
    
    function validateInput(){
        if(!isPasswordValid()){

            setError({INVALID_PASSWORD:true})
            return false;
        }else{
            if(!isCopyPasswordValid()){
                setError({INVALID_COPY_PASSWORD:true})
                return false;
            }
        }
        return true;
    }


    function isPasswordValid(){
        const pattern = CONSTANTS.PASSWORD_VALIDATION_PATTERN;
        if(pattern.test(password))
        return true;
        return false;
    }

    function isCopyPasswordValid(){
        if(password===copyPassword)
        return true;
        return false;
    }

    function CompleteReset({visible}){
        return <div className={clsx('modal',visible?'is-active':'')}>
                    <div className={clsx('modal-background','has-background-white')}></div>
                    <div className={clsx('modal-content','centeralignment')}>
                    <div className="box pt-4 pb-6 pl-6 pr-6">
                    <div className="block level mb-8">
                        <div className="level-left">
                            <figure className = {clsx('image','is-24x24','mr-2','level-item') }> 
                                <img src="/headerlogo.png"/>
                            </figure>
                            <p className="level-item title is-5 is-grouped is-grouped-centered">KandyBag</p>
                        </div>
                    </div>
                <form className={clsx('centeralignment')}>
                <div className="mt-6">
                    <p className="has-icons-left">
                                        
                    </p>
                    <p className="mt-4 has-icons-left">
                        <p className={clsx('is-size-6')}>Password successfully reset.</p>    
                 
                    </p>

                    </div>
                     
                    
                </form>
                <button className={clsx('button','is-info','mt-6')} onClick={()=>router.replace('/user_login')}>Login</button>

                              
            </div> 
                    </div>
              </div>        
        
        
      
    }

    async function handleSubmit(e){
        e.preventDefault();
        if(password.trim===''){
            return
        }
        if(!validateInput()){
            return;
        }
        const token = router.query.token;
        if(!token){
            return;
            setError({SERVER_ERROR:true})
        }
        try{
            const response = await axios.post(resetPasswordUrl+'/'+token,{password:password},{timeout:CONSTANTS.REQUEST_TIMEOUT});
            if(response.status===CONSTANTS.POST_SUCCESS){
                if(response.data.result===CONSTANTS.SUCCESS){
                    setReset(true)
                }else{
                    if(response.data.result==='FAIL'&&response.data.error.code===CommonErrorCodes.USER.FAILED_VERIFICATION){
                      setError({FAILED_VERIFICATION:true});
                    }else if(response.data.result==='FAIL'&&response.data.error.code===CommonErrorCodes.USER.VERIFICATION_EXPIRED){
                        setError({EXPIRED_VERIFICATION:true})
                    }else{
                        setError({SERVER_ERROR:true})
                    }
                }
            }else{
                setError({SERVER_ERROR:true})
            }
        }catch(error){
            setError({SERVER_ERROR:true})
        }finally{

        }
       

    }

   

   

    return <BaseLayout use="default">
        
        <div>
        <Head>
            <title>Reset password</title>
            <link rel="icon" href="/tinylogo.png" />
        </Head>
        </div>
        <div className={clsx('columns','min-screen-fill')}>
           
            <div className={clsx('column','is-one-third','is-offset-one-third','centeralignment')}>
                <section className="section">
                <div className="box pt-4 pb-6 pl-6 pr-6">
                        <div className="block level mb-8">
                            <div className="level-left">
                                <figure className = {clsx('image','is-24x24','mr-2','level-item') }> 
                                    <img src="/headerlogo.png"/>
                                </figure>
                                <p className="level-item title is-5 is-grouped is-grouped-centered">KandyBag</p>
                            </div>
                        </div>
                    <form className={clsx('centeralignment')}>
                    <div className="mt-6">
                        <p className="has-icons-left">
                            <input className={clsx('is-size-6','stylized-input')} value={password} type='password' placeholder="Enter new password"  onChange={(e)=>{setError({});setPassword(e.target.value)}}/>    
                     
                        </p>
                        <p className="mt-4 has-icons-left">
                            <input className={clsx('is-size-6','stylized-input')} value={copyPassword} type='password' placeholder="Confirm password"  onChange={(e)=>{setError({});setCopyPassword(e.target.value)}}/>    
                     
                        </p>
                        </div>
                        
                        
                    </form>
                    <div className={'mt-4'}>
                    {error.INVALID_PASSWORD&&<div><p className={'has-text-danger'}><strong>The password is not valid</strong><br/>Use Capital and small letters.<br/>Atleast one number.<br/>Atleast one spl character.</p></div>}
                    {error.INVALID_COPY_PASSWORD&&<div><p className={'has-text-danger'}>The confirmation field <br/>does not match the password.</p></div>}
                    {error.FAILED_VERIFICATION&&<div><p className={'has-text-danger'}>Failed to verify the user identity.</p></div>}
                    {error.SERVER_ERROR&&<div><p className={'has-text-danger'}>An error occured on the server.</p></div>}
                    {error.EXPIRED_VERIFICATION&&<div><p className={'has-text-danger'}>Link has expired <Link href='/forgot_password'><a><strong>try again</strong></a></Link></p></div>}
                    </div>

                    <button disabled={error.EXPIRED_VERIFICATION} className={clsx('button','is-info','mt-6')} onClick={handleSubmit}>Change password</button>
                      
                </div> 
                </section>
                
            </div>
            
            </div>
            <CompleteReset visible={reset}/>
        
        </BaseLayout>
}