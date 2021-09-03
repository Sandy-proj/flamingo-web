
import {useState} from 'react'

export default function withAuthorization(Component){
    return function({loginStatus,setLogin,...remainingProps}){
        
             return(
            <Component user={{id:loginStatus.userId}} handshake={loginStatus.handshake} role={loginStatus.role} isLoggedIn={loginStatus.isLoggedIn} onLoginChange ={setLogin} {...remainingProps}/>
        )
    }
}