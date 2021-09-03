

import { useEffect, useState } from 'react';
import UseSquare from './../components/ui/UseSquare';
import { CONSTANTS } from './../components/Util/Constants';
import {useRouter} from 'next/router'
import axios from 'axios'

export default function ViewSquare({isLoggedIn,role,user,onLoginChange,resource}) {
    const [mode,setMode] = useState(CONSTANTS.modes.USE)
    //const [resource,setResource] = useState([])
    const router = useRouter();
    const[id,setId] = useState(router.query.id?router.query.id:-1)
    console.log('path: '+id)

    
    function onEdit(){
        setMode(CONSTANTS.modes.EDIT);
    }
    function onSave(){
        setMode(CONSTANTS.modes.VIEW)
    }

    var pageBody;
    pageBody = <UseSquare onEdit={onEdit} resource={resource} isLoggedIn={isLoggedIn} isEditable={false}/>
     
    return (
        <div>
            {pageBody}
        </div>
        
    );
    }


    export async function getServerSideProps(context){

      
        //Read the login status of the request and return either the resource requested or redirect to a client page with the id.

        console.log('on the server '+context.query.id)
        const id = context.query.id;
        var data={}
        try{
            const response = await axios.get(`http://localhost:3001/resources/resource?id=${id}`,{timeout:10000});
            data = { resource:response.data.resource}
            console.log('server data:'+data)
        }catch(error){
            console.error(error)
            data = { error:'FAIL'}
        }
        
               
        
        return {
            props:data
        }

          // return {
        //     redirect:{
        //         destination:'/usrview/square?id=24'
        //     }
        // }

    }