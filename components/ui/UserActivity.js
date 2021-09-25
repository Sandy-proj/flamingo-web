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
      
      onFetch(activity)
  }

 console.log('resource id:'+resourceId)

  useEffect(async ()=>{
    if(resourceId<=0)
    return;
    const fetchUrl = dataUrl+'?res='+resourceId;
    try{
        console.log('fetching here')
        const response = await axios.get(fetchUrl,{timeout:CONSTANTS.REQUEST_TIMEOUT});
        handleFetch(response.data)
    }catch(error){
       console.log(error)
    
    }
  },[resourceId])
  
    return (
       <div></div>
    );

}