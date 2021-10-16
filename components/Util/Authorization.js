
import {useContext, useState} from 'react'
import {useRouter} from 'next/router'
import Error from '../../pages/_error'
import VerifyAccount from '../../pages/verify_account';
import { AuthorizationContext } from './AuthContext';

export default function withAuthorization(Component){
    const router = useRouter();

    return function({error,...props}){
            // if(error===0){
            //     if(props.role==='REGISTERED'){
            //         return <VerifyAccount {...props}/>
            //     }
            //     return(
            //         <Component {...props}/>
            //     )
            // }
            // return <Error statusCode={error}/>
            return <Component {...props}/>
    }
}