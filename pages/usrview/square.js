import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import Link from 'next/link'
import { useContext, useEffect, useRef, useState } from 'react';
import EditSquare from '../../components/ui/EditSquare';
import UseSquare from '../../components/ui/UseSquare';
import { CONSTANTS } from '../../components/Util/Constants';
import {useRouter} from 'next/router'
import axios from 'axios'
import BaseLayout from '../../components/ui/BaseLayout';
import { AuthorizationContext } from '../../components/Util/AuthContext';
import UserActivity from '../../components/ui/UserActivity';

export default function Square({handshake,onLoginChange}) {
    const [mode,setMode] = useState(CONSTANTS.modes.USE)
    const [resourceObject,setResourceObject] = useState({resource:[],id:-1,title:''})
    const [serverError,setServerError] = useState(false)
    const [userActivity,setUserActivity]=useState({like:false,bookmark:false,download:false});
    const router = useRouter();
    const readyToFetch = useRef(true)
    const[id,setId] = useState(router.query.id?router.query.id:-1)
    const user = useContext(AuthorizationContext)
    //console.log('is_loggedin:'+ user.isLoggedIn+'userid:'+user.userId+'path:'+id)

    // if(!user.isLoggedIn){

    //     router.push('/')
    // }
    function onEdit(){
        setMode(CONSTANTS.modes.EDIT); 
    }
    function onSave(savedList){
        //console.log('setting view mode')
        //console.log(savedList)
        setId(savedList.id)
        setResourceObject({id:savedList.id,resource:savedList.data,title:savedList.title})
        setMode(CONSTANTS.modes.USE)
    }

    function onDialogOk(){

    }
    //console.log('list:'+ resourceObject)
    //console.log(user)

    function handleUserActivity(activity){
        setUserActivity(activity);
        
    }
    
    useEffect(async ()=>{
        if(user.handshake===false||user.handshakeInProgress===true){
            readyToFetch.current=true
            return;
        }
        if(user.isLoggedIn){

        
            if((user.isLoggedIn&&user.id&&user.id>0)&&id>0){
                try{
                    
                
                    if(readyToFetch.current){


                        readyToFetch.current=false;
                        const response = await axios.get(`/hopsapi/resources/resource?res=${id}`,{timeout:10000});
                        //Check if the access expired. 
                        if(response.data.data&&response.data.data.action==='REFRESH'){
                   
                            readyToFetch.current=true;
                            user.initiateHandshake();
                            return;
                        }

                  
                        if(response.status===CONSTANTS.GET_SUCCESS){
                            readyToFetch.current=false;
                            if(response.data&&response.data.result==='SUCCESS'){
                                setResourceObject(response.data.data)
                            }else if(response.data&&response.data.result==='FAIL'){
                                setServerError(true)
                            }
                        
                        }else{
                            setServerError(true);
                        }
                    }
                   
                }catch(error){
                    setServerError(true);
                }
             
            }else{
                setMode(CONSTANTS.modes.EDIT)
            }
        }
        
    },[id,mode,user.handshakeInProgress])
    var pageBody;
    //console.log('rendering with '+resourceObject)
    if(mode===CONSTANTS.modes.USE){
        pageBody = <UseSquare onEdit={onEdit} activity={userActivity} resource={resourceObject} onDownload={setId} isEditable={true}/>
    }else{
        pageBody = <EditSquare onSave={onSave} resource={resourceObject}/>
    }
    return (
        <BaseLayout>
        
         <UserActivity resourceId={resourceObject.id} onFetch={handleUserActivity}/> 
            {pageBody}
        </BaseLayout>
        
    );
}