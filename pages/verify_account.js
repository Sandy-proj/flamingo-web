import { mdiClockTimeSix } from '@mdi/js';
import axios from 'axios';
import clsx from 'clsx';
import { route } from 'next/dist/next-server/server/router';
import Link from 'next/link'
import Header from '../components/ui/Header'
import { useRouter } from 'next/router';
import { useEffect, useState,useContext } from 'react';
import Verification from '../components/ui/Verification';
import { CONSTANTS } from '../components/Util/Constants';
import BaseLayout from './../components/ui/BaseLayout'
import { AuthorizationContext } from '../components/Util/AuthContext'
import { CommonErrorCodes } from '../components/Util/ErrorCodes';
export default function VerifyAccount({}){
    const [processingToken,setProcessingToken] = useState(false)
    const [requestingVerification,setRequestingVerification] = useState(false);
    const [isVerified,setIsVerified] = useState(false);
    const [errorFlags,setErrorFlags] = useState({})
    const [verfiyErrorFlags,setVerifyErrorFlags] = useState({})
    const router = useRouter();
    const [token,setToken] = useState('')
    const user = useContext(AuthorizationContext)
    let verificationUrl = CONSTANTS.ACCOUNT_VERIFICATION_URL;
    let verificationRequestUrl = CONSTANTS.VERIFICATION_REQUEST_URL;
   

    //Extract the token if it exists.

    //const[id,setId] = useState(router.query.id?router.query.id:-1) 
    //const tokenParam = router.query.token;
  

    useEffect(()=>{
        if(user.role==='VERIFIED'){
            router.replace('/')
        }  
    },[user.role,user.handshake])

    useEffect(async()=>{
        
        if(!router.isReady){
            return;
        }
        //setToken(router.query.token)
            const mtoken = router.query.token;
            setToken(mtoken)
            if(!user.handshakeInProgress){
               
                if((mtoken)&&(!isVerified)){
                 
                    setIsVerified(true)
                    setProcessingToken(true);
                    try{
                        const response = await axios.get(verificationUrl+`/${mtoken}`,{timeout:CONSTANTS.REQUEST_TIMEOUT})
                  
                        if(response.data.result==='SUCCESS'){
                                user.initiateHandshake(true);
                        }else if(response.data.result==='FAIL'){
                            if(response.data.error.code===CommonErrorCodes.USER.VERIFICATION_EXPIRED){
                                setErrorFlags({EXPIRED:true})
                            }else{
                                setErrorFlags({SERVER_ERROR:true})
                            }
                        }
                    }catch(error){
                        setErrorFlags({SERVER_ERROR:true})
                        //setIsVerified(false)
                    }finally{
                        setProcessingToken(false)
                    }
                }
            }
            
        
        
        
    },[isVerified,user.handshakeInProgress,router.isReady])

   

    async function handleVerificationRequest(e){
        e.preventDefault();
        setRequestingVerification(true);
        try{
            const response = await axios.post(verificationRequestUrl,{},{timeout:CONSTANTS.REQUEST_TIMEOUT})

            if(response.data.result==='SUCCESS'){

            }else{
                if(response.data.result==='FAIL'&&response.data.error.code===CommonErrorCodes.TOO_MANY_REQUESTS){
                    setVerifyErrorFlags({TOO_MANY_REQUESTS:true})
                }else{
                    setVerifyErrorFlags({SERVER_ERROR:true})
                }
            }
        }catch(error){
            setVerifyErrorFlags({error:SERVER_ERROR})
        }finally{
            setRequestingVerification(false)
        }
    }
    
    return (<BaseLayout use="default">
        <Header/>
    <div className="columns min-screen-fill">
        <div className={clsx('column','centeralignment')}>
            <section className="section is-small">
            <div className={clsx('min-screen-fill','box')}>
               
            <form className={clsx('box','p-6')}>
                    <div className="block level mb-8">
                            <div className="level-left">
                                <figure className = {clsx('image','is-24x24','mr-2','level-item') }> 
                                    <img src="/headerlogo.png"/>
                                </figure>
                                <p className="level-item title is-5 is-grouped is-grouped-centered">Welcome to TrypSmart!!</p>
                            </div>
                        </div>
                        {(Object.keys(verfiyErrorFlags).length>0)?<div>
                            <div className="field mt-4">
                            {verfiyErrorFlags.SERVER_ERROR&&<p className={clsx('content','is-medium','has-text-danger')}>An error occured on the server. Please try after some time.<br/></p>}
                            {verfiyErrorFlags.TOO_MANY_REQUESTS&&<p className={clsx('content','is-medium','has-text-danger')}>Exceeded maximum requests for now.<br/></p>}
                            </div>
                        </div>:
                         <div className="field mt-4">
                         <p className={clsx('content','is-medium')}>Verification link has been sent to your registered email.<br/></p>
                         <p className="content">
                            
                           Did not receive the email? <button className={clsx('button','is-info','is-small','is-light',requestingVerification?'is-loading':'')} onClick={handleVerificationRequest}>Resend</button>
                         
 
                         </p>
                         </div> 
                        }
                       
            </form>
    
               
            </div> 
            </section>
            
        </div>
        <Verification visible={token} progress={processingToken} error={errorFlags}/>
        </div>
    </BaseLayout>);
}