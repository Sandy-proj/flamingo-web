import clsx from 'clsx';
import { useContext, useEffect, useState } from 'react';
import { AuthorizationContext } from '../Util/AuthContext';
import axios from 'axios'
import { CONSTANTS } from '../Util/Constants';

export default function UserActivity({onFetch,resourceId,children}){
  const user = useContext(AuthorizationContext)

  let dataUrl = '/hopsapi/resources/resource/activity';
  
  if(!user.isLoggedIn)
  return null;


  function handleFetch(activity){
      console.log('activity loading')
      console.log(activity)
      onFetch(activity.actions)
  }

 console.log('resource id:'+resourceId)

  useEffect(async ()=>{
   
    if(resourceId<=0)
    return;
    const fetchUrl = dataUrl+'?res='+resourceId;
    try{
        console.log('fetching here')
        const response = await axios.get(fetchUrl,{timeout:CONSTANTS.REQUEST_TIMEOUT});
        console.log('-----')
        console.log(response)
        if(response.data&&response.data.result==='SUCCESS'){
          handleFetch(response.data.data)
        }
        
    }catch(error){
       console.log(error)
    
    }
  },[resourceId])
  
    return (
       <div></div>
    );

}