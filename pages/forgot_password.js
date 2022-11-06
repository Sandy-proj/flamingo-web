import BaseLayout from "../components/ui/BaseLayout";
import Head from 'next/head'
import clsx from "clsx";
import { useContext, useState } from "react";
import { AuthorizationContext } from "../components/Util/AuthContext";
import { useRouter } from "next/router";
import { CONSTANTS } from "../components/Util/Constants";
import axios from 'axios'
import { CommonErrorCodes } from "../components/Util/ErrorCodes";

export default function ForgotPassword({props}){
    const [emailInput,setEmailInput] = useState('')
    const [isProcessing,setIsProcessing] = useState(false)
    const [processed,setIsProcessed] = useState(false);
    const [error,setError] = useState({})
    const user = useContext(AuthorizationContext);
    const router = useRouter();
    let requestPasswordResetUrl = CONSTANTS.FORGOT_PASSWORD_URL;

    function handleChange(e){
        if(Object.keys(error).length>0){
            setError({})
        }
        setEmailInput(e.target.value)
    }
    async function handleReset(e){
        e.preventDefault();
        if(processed){
            router.replace('/')
            return;
        }
        try{
           
            setIsProcessing(true)
            
            const response = await axios.post(requestPasswordResetUrl,{emailId:emailInput},{timeout:CONSTANTS.REQUEST_TIMEOUT})

            if(response.status===CONSTANTS.POST_SUCCESS){
                if(response.data.result===CONSTANTS.SUCCESS){
                    setIsProcessed(true);
                    setError({})
                }else{
                    setIsProcessed(false);
                    if(response.data.result==='FAIL'&&response.data.error.code===CommonErrorCodes.USER.INVALID_EMAIL_ID){
                      
                        setError({BAD_EMAIL:true});
                    }else if(response.data.result==='FAIL'&&response.data.error.code===CommonErrorCodes.USER.TOO_MANY_REQUESTS){
                        setError({TOO_MANY_REQUESTS:true})
                    }else{
                        setError({SERVER_ERROR:true})
                    }
                }
               
            }else{
                
                setError({SERVER_ERROR:true})
            }
            

        }catch(error){
            setError({SERVER_ERROR:true})
            setIsProcessed(false)

        }finally{
            setIsProcessing(false)
        }

    }

    if(user.isLoggedIn){
        router.replace('/')
    }
    return<BaseLayout use="default">
        
    <div>
        <Head>
            <title>KandyBag</title>
            <link rel="icon" href="/tinylogo.png" />
        </Head>
        </div>
        <div className={clsx('columns','min-screen-fill')}>
           
            <div className={clsx('column','is-one-third','is-offset-one-third','centeralignment')}>
                {/* <section className="section"> */}
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
                 
                         <div className={clsx("field",'has-addons','centeralignment')} >
                            <p className="control">
                                {!processed&&<input className={clsx('is-size-6','stylized-input')} value={emailInput} type="text" placeholder="Enter email id" onChange={handleChange} />}
             
                            </p>
                            <p className="control">
                                <button className={clsx('button','is-info',isProcessing?'is-loading':'')} onClick={handleReset}>
                                    <strong>{processed?'Go Home':'Reset Password'}</strong>
                                </button>
                            </p>
                        </div> 
                    </form>
                    <div className={'mt-4'}>
                        {error.SERVER_ERROR&&<p className={'has-text-danger'}>An error occured on the server</p>}</div>
                        <div>{error.BAD_EMAIL&&<p className={'has-text-danger'}>The email id is invalid</p>}</div>
                        <div>{error.TOO_MANY_REQUESTS&&<p className={'has-text-danger'}>Exceeded maximum requests for reset.</p>}</div>

                        <div>{processed&&<p className={'has-text-success'}>A reset link has been sent to your email id.</p>}</div>

                </div> 
                
                {/* </section> */}
                
            </div>
            
            </div>
        
        </BaseLayout>
}