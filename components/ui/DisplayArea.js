
import { useState,useEffect, useRef } from 'react';
import {CONSTANTS} from './../Util/Constants'
import axios from 'axios';
import Paginator from './Paginator';
import { useContext } from 'react';
import { Router,useRouter } from 'next/router';
import clsx from 'clsx';
import Icon from '@mdi/react'
import { mdiAccount, mdiGoogle,mdiPlusCircle, mdiPlus } from '@mdi/js'
import { AuthorizationContext } from '../Util/AuthContext';
import Loader from './LoadingOverlay';
export default function DisplayArea({command}){



    let dataUrl = '/hopsapi/resources';
    const [page,setPage]=useState({pageIndex:0,transition:true})
    const [data,setData] = useState();
    const [isVisible,setIsVisible] = useState(false)
    const readyToFetch = useRef(true)
    const [requestTimeOut,setRequestTimeOut] = useState(false)
    const user = useContext(AuthorizationContext)
    let fetchUrl = '';
    const router = useRouter();
    let resultHeader = <div></div>
     
    function handleFetch(isNext){
        readyToFetch.current=true;
        isNext?setPage({pageIndex:page.pageIndex+1,transition:true}):setPage({pageIndex:page.pageIndex-1,transition:false})
        
    }

    function handleSelection(id){
        setIsVisible(true)
        if(user.isLoggedIn){
            router.push(`/usrview/square?id=${id}&pageIndex=${page.pageIndex}`)
        }else{
            //window.location.href=`hops/view_square?id=${id}&pageIndex=${page.pageIndex}`
            window.location.href = CONSTANTS.HOPS_WEB_SERVER_BASE+`view_square?id=${id}`;
        }
    }
    
    useEffect(()=>{

        readyToFetch.current=true;
        setPage({pageIndex:0,transition:true})
    },[command,command.param])


    useEffect(async ()=>{

        if(user.handshake===true){
             //Fetch the resource header's here. 
        //Check if a refresh is in progress and set the waiting flag. 
        if(user.handshakeInProgress){
           readyToFetch.current = true;
        }else{
            if(readyToFetch.current){
                   try{
                        setData()
                        const response = await axios.get(fetchUrl,{timeout:CONSTANTS.REQUEST_TIMEOUT});
                     
                        if(response.data&&response.data.data&&response.data.data.action==='REFRESH'){
                            readyToFetch.current = true
                            user.initiateHandshake();

                        }else{
                        
                            setData(response.data.data)//Statement causing warning.
                            
                            readyToFetch.current = false;
                          
                        }
                        
                    }catch(error){
          
                    setRequestTimeOut(true)
                    readyToFetch.current = false;
                    }
            }
        }
        }
       
       
    },[command.mode,command.param,user.handshakeInProgress,page.pageIndex])

  


    
    
    //Select the url and header based on the command - search/popular/trending.
    if(command.mode===CONSTANTS.commandModes.SEARCH){
       fetchUrl= dataUrl + '?cmd='+command.mode+'&param='+command.param+(page.pageIndex>0?'&page='+page.pageIndex:'')
       resultHeader = <div className="is-size-5 has-text-info ml-4">Search results for <span className={clsx('has-text-weight-bold')}>'{command.param}'</span></div>
    }else if(command.mode===CONSTANTS.commandModes.POPULAR){
        fetchUrl = dataUrl  + '?cmd='+command.mode+(page.pageIndex>0?'&page='+page.pageIndex:'')
        resultHeader = <span className="title is-5 has-text-info has-text-weight-bold ml-4">{CONSTANTS.commandModes.POPULAR}</span>
    }else if(command.mode===CONSTANTS.commandModes.FRESH){
        fetchUrl = dataUrl  + '?cmd='+command.mode+(page.pageIndex>0?'&page='+page.pageIndex:'')
        resultHeader = <div className="title is-5 has-text-info ml-4">{CONSTANTS.commandModes.FRESH}</div>
    }else if(command.mode === CONSTANTS.commandModes.TRENDING){
        fetchUrl =dataUrl + '?cmd='+command.mode+(page.pageIndex>0?'&page='+page.pageIndex:'')
        resultHeader = <div className="title is-5 has-text-info ml-4">{CONSTANTS.commandModes.TRENDING}</div>
    }else if(command.mode===CONSTANTS.commandModes.MYFEED){
        fetchUrl = dataUrl  + '?cmd='+command.mode+(page.pageIndex>0?'&page='+page.pageIndex:'')
        resultHeader = <div className="title is-5 has-text-info ml-4">My posts</div>
    }else if(command.mode===CONSTANTS.commandModes.CATEGORIES){
        fetchUrl = dataUrl + '?cmd='+command.mode+'&param='+command.param+(page.pageIndex>0?'&page='+page.pageIndex:'');
        resultHeader = <div className="title is-5 has-text-info ml-4">{command.param}</div>
    }else if(command.mode===CONSTANTS.commandModes.MYLISTS){
        fetchUrl = dataUrl + '?cmd='+command.mode+(page.pageIndex>0?'&page='+page.pageIndex:'');
        resultHeader = <div className="title is-5 has-text-info ml-4">{CONSTANTS.commandModes.MYLISTS}</div>
    }else if(command.mode===CONSTANTS.commandModes.BOOKMARKED){
        fetchUrl = dataUrl + '?cmd='+command.mode+(page.pageIndex>0?'&page='+page.pageIndex:'');
        resultHeader = <div className="title is-5 has-text-info ml-4">{CONSTANTS.commandModes.BOOKMARKED}</div>
    }else if(command.mode===CONSTANTS.commandModes.SAVED){
        fetchUrl = dataUrl + '?cmd='+command.mode+(page.pageIndex>0?'&page='+page.pageIndex:'');
        resultHeader = <div className="title is-5 has-text-info ml-4">{CONSTANTS.commandModes.SAVED}</div>
    }
    else{
        return  <div className="auto title is-6 is-danger">Unable to find results for this operation!!</div>
    }
    


   
    if(requestTimeOut){
        return <div className={clsx('min-screen-fill','container','centeralignment')}>
           
        <div>
        
        <div className={clsx('is-size-4','mt-4')}>Your request has timed out. Check your network connection and <Link><a href="/">Try Again</a></Link></div>
        </div>
       
        
      
        </div>
    }

   
    if(!data||!user.handshake){
        
        //console.log('loading...')
        
        return <div className={clsx('min-screen-fill','container','centeralignment')}>
           
            <div>
                <div className={clsx('loader','centeralignment')}></div>
                <div className={clsx('is-size-4','mt-4')}>Loading...</div>
            </div>
           
            
          
            </div>
    }else if(data&&data.length===0){
        return <div className={clsx('min-screen-fill','container','centeralignment')}>
           
            <div>
                
                <div className={clsx('is-size-4','mt-4')}>No results found for this operation.</div>
            </div>
        </div>
           
    }

    

  
    const rowCount = data.length;
    const noOfPages = Math.ceil(rowCount / CONSTANTS.PAGE_SIZE);
    
   
    return (
        
        <div>
            <Loader visible={isVisible}/>
                {<div className="box has-background-white is-shadowless is-radiusless p-3 mb-1 mt-1">
                    <span>{resultHeader}</span>
                    </div>
                }
       
            <Paginator displayFlag={!(page.pageIndex==0&&noOfPages==1)} onSelection={handleSelection} pageIndex={page.pageIndex} pageCount={noOfPages} data={data} onNextFetch={handleFetch} transition={page.transition} />
        </div>
       
    );

}