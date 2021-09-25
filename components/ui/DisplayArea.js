
import { useState,useEffect } from 'react';
import {CONSTANTS} from './../Util/Constants'
import axios from 'axios';
import Paginator from './Paginator';
import { useContext } from 'react';
import { Router,useRouter } from 'next/router';
import clsx from 'clsx';
import { AuthorizationContext } from '../Util/AuthContext';
export default function DisplayArea({command,isLoggedIn, children}){



    let dataUrl = '/hopsapi/resources';
    const [page,setPage]=useState({pageIndex:0,transition:true})
    const [data,setData] = useState();
    const [requestTimeOut,setRequestTimeOut] = useState(false)
    const user = useContext(AuthorizationContext)
    let fetchUrl = '';
    const router = useRouter();
    let resultHeader = <div></div>
     
    function handleFetch(isNext){
        console.log('retrieve:'+(isNext?'next':'prev'))
        isNext?setPage({pageIndex:page.pageIndex+1,transition:true}):setPage({pageIndex:page.pageIndex-1,transition:false})
        
    }

    function handleSelection(id){
        if(user.isLoggedIn){
            router.push(`/usrview/square?id=${24}&pageIndex=${page.pageIndex}`)
        }else{
            window.location.href=`http://localhost:3000/view_square?id=24&pageIndex=${page.pageIndex}`
        }
    }
    console.log('rendering parent')

    useEffect(async ()=>{
        console.log('trying to fetch:'+fetchUrl)
        if(!fetchUrl) return;
        try{
            console.log('fetching here')
            const response = await axios.get(fetchUrl,{timeout:CONSTANTS.REQUEST_TIMEOUT});
            setData(response.data)
        }catch(error){
            console.log('timing out..')
            setRequestTimeOut(true)
        
        }
       
    },[command.mode])

    console.log('command:'+CONSTANTS.messageTypes.SUCCESS)
    //Select the url and header based on the command - search/popular/trending.
    if(command.mode===CONSTANTS.commandModes.SEARCH){
       fetchUrl= dataUrl + '?cmd='+command.mode+(page.pageIndex>0?'&page='+page.pageIndex:'')
       resultHeader = <div className="is-size-5 has-text-info"><i>Search results for <strong>'{command.param}'</strong></i></div>
    }else if(command.mode===CONSTANTS.commandModes.POPULAR){
        fetchUrl = dataUrl  + '?cmd='+command.mode+(page.pageIndex>0?'&page='+page.pageIndex:'')
        resultHeader = <div className="title is-5 has-text-grey">{CONSTANTS.commandModes.POPULAR}</div>
    }else if(command.mode === CONSTANTS.commandModes.TRENDING){
        fetchUrl =dataUrl + '?cmd='+command.mode+(page.pageIndex>0?'&page='+page.pageIndex:'')
        resultHeader = <div className="title is-5 has-text-grey">{CONSTANTS.commandModes.TRENDING}</div>
    }else if(command.mode===CONSTANTS.commandModes.MYFEED){
        fetchUrl = dataUrl  + '?cmd='+command.mode+(page.pageIndex>0?'&page='+page.pageIndex:'')
        resultHeader = <div className="title is-5 has-text-grey">{command.param}'s feed</div>
    }else if(command.mode===CONSTANTS.commandModes.CATEGORY){
        fetchUrl = dataUrl + '?cmd='+command.mode+(page.pageIndex>0?'&page='+page.pageIndex:'');
        resultHeader = <div className='title is-5 has-text-grey'>{command.param}</div>
    }else if(command.mode===CONSTANTS.commandModes.MYLISTS){
        fetchUrl = dataUrl + '?cmd='+command.mode+(page.pageIndex>0?'&page='+page.pageIndex:'');
        resultHeader = <div className='title is-5 has-text-grey'>{CONSTANTS.commandModes.MYLISTS}</div>
    }else if(command.mode===CONSTANTS.commandModes.BOOKMARKED){
        fetchUrl = dataUrl + '?cmd='+command.mode+(page.pageIndex>0?'&page='+page.pageIndex:'');
        resultHeader = <div className='title is-5 has-text-grey'>{CONSTANTS.commandModes.BOOKMARKED}</div>
    }else if(command.mode===CONSTANTS.commandModes.SAVED){
        fetchUrl = dataUrl + '?cmd='+command.mode+(page.pageIndex>0?'&page='+page.pageIndex:'');
        resultHeader = <div className='title is-5 has-text-grey'>{CONSTANTS.commandModes.SAVED}</div>
    }
    else{
        return  <div className="auto title is-6 is-danger">Unable to find results for this operation!!</div>
    }
    


   
    if(requestTimeOut){
        return <div className={clsx('min-screen-fill','container','centeralignment')}>
           
        <div>
        
        <div className={clsx('is-size-4','mt-4')}>Your request has timed out. Check your network connection and <a>Try Again</a></div>
        </div>
       
        
      
        </div>
    }

   
    if(!data){
        console.log('loading...')
        
        return <div className={clsx('min-screen-fill','container','centeralignment')}>
           
            <div>
                <div className={clsx('loader','centeralignment')}></div>
                <div className={clsx('is-size-4','mt-4')}>Loading...</div>
            </div>
           
            
          
            </div>
    }

  
    const rowCount = data.resources.length;
    const noOfPages = Math.ceil(rowCount / CONSTANTS.PAGE_SIZE);
    
   
    return (
        
        <div>
                {<div className="box is-shadowless is-radiusless p-3 mb-0">
                    
                    {resultHeader}
                    </div>
                }
            
            <Paginator isLoggedIn={isLoggedIn} onSelection={handleSelection} pageIndex={page.pageIndex} pageCount={noOfPages} data={data} onNextFetch={handleFetch} transition={page.transition} />
        </div>
       
    );

}