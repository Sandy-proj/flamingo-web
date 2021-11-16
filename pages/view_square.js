

import { useEffect, useState } from 'react';
import UseSquare from './../components/ui/UseSquare';
import { CONSTANTS } from './../components/Util/Constants';
import {useRouter} from 'next/router'
import axios from 'axios'
import BaseLayout from '../components/ui/BaseLayout';
import UseSquarePublic from '../components/ui/UseSquarePublic';
import CommentBox from '../components/ui/CommentBox';

export default function ViewSquare({isLoggedIn,role,user,onLoginChange,resource}) {
    const [mode,setMode] = useState(CONSTANTS.modes.USE)
    //const [resource,setResource] = useState([])
    const router = useRouter();
    const[id,setId] = useState(router.query.id?router.query.id:-1)
 

    
    function onEdit(){
        setMode(CONSTANTS.modes.EDIT);
    }
    function onSave(){
        setMode(CONSTANTS.modes.VIEW)
    }

    var pageBody;
    pageBody = <UseSquarePublic onEdit={onEdit} resource={resource} isLoggedIn={isLoggedIn} isEditable={false}/>
     
    return (
        <BaseLayout>
            {pageBody}
            <CommentBox getComments={true} resourceId={resource.id}/>
        </BaseLayout>
        
    );
    }


    export async function getServerSideProps(context){

      
        //Read the login status of the request and return either the resource requested or redirect to a client page with the id.


        const id = context.query.id;
        var data={}
        try{
            const response = await axios.get(`${CONSTANTS.HOPS_GET_SERVER_RESOURCE}?res=${id}`,{timeout:10000});
            data = { resource:response.data.data}

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