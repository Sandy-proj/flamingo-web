
import {useState} from 'react'
import {useRouter} from 'next/router'
import Error from '../../pages/_error'

export default function withAuthorization(Component){
    const router = useRouter();
    return function({error,...props}){
            if(error==0){
                return(
                    <Component {...props}/>
                )
            }
            return <Error statusCode={error}/>
    }
}