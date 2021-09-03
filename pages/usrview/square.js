import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import Link from 'next/link'
import { useEffect, useState } from 'react';
import EditSquare from '../../components/ui/EditSquare';
import UseSquare from '../../components/ui/UseSquare';
import { CONSTANTS } from '../../components/Util/Constants';
import {useRouter} from 'next/router'
import axios from 'axios'

export default function Square({isLoggedIn,handshake,role,user,onLoginChange}) {
    const [mode,setMode] = useState(CONSTANTS.modes.USE)
    const [resource,setResource] = useState([])
    const router = useRouter();
    const[id,setId] = useState(router.query.id?router.query.id:-1)
    console.log('is_loggedin:'+ isLoggedIn+'path:'+id)

    // if(!isLoggedIn){

    //     router.push('/view_square')
    // }
    function onEdit(){
        setMode(CONSTANTS.modes.EDIT); 
    }
    function onSave(){
        console.log('setting view mode')
        setMode(CONSTANTS.modes.USE)
    }
    
    useEffect(async ()=>{
        if(handshake==false){
            return;
        }
        if(!isLoggedIn){
            window.location.href='http://localhost:3000/view_square?id=24'
        }else{
            if(isLoggedIn&&id&&id>0){
                try{
                    
                    console.log('retrieval ...........')
                   
                    const response = await axios.get(`/hopsapi/resources/resource?id=${id}`,{timeout:10000});
                   
                    setResource(response.data.resource)
                  }catch(error){
                    console.error(error)
                  } 
            }else{
                setMode(CONSTANTS.modes.EDIT)
            }
        }
        
    },[id])
    var pageBody;
    if(mode===CONSTANTS.modes.USE){
        pageBody = <UseSquare onEdit={onEdit} resource={resource} isLoggedIn={isLoggedIn} isEditable={true}/>
    }else{
        pageBody = <EditSquare onSave={onSave} resource={resource} isLoggedIn={isLoggedIn}/>
    }
    return (
        <div>
            {pageBody}
        </div>
        
    );
}