import ResourceCard from './ResourceCard'
import clsx from 'clsx';
import useSWR from 'swr';
import { useState } from 'react';
import {CONSTANTS} from './../Util/Constants'
import axios from 'axios';
import Paginator from './Paginator';
export default function DisplayArea({command, children}){

   
    //fetcher function to retrieve resource data.
    const fetcher = url=> axios.get(url).then(res=>res.data);
   // const [pageIndex,setPageIndex] = useState(0)
    const [page,setPage]=useState({pageIndex:0,transition:true})
    let dataUrl = '/hopsapi/resources';
    let resultHeader = <div></div>
    console.log('command:'+CONSTANTS.messageTypes.SUCCESS)
    //Select the url and header based on the command - search/popular/trending.
    if(command.mode===CONSTANTS.commandModes.SEARCH){
       dataUrl = dataUrl + '?cmd='+command.co+(page.pageIndex>0?'&page='+page.pageIndex:'')
       resultHeader = <div className="is-size-5 has-text-info"><i>Search results for <strong>'{command.param}'</strong></i></div>
    }else if(command.mode===CONSTANTS.commandModes.POPULAR){
        dataUrl = dataUrl  + '?cmd='+command.mode+(page.pageIndex>0?'&page='+page.pageIndex:'')
        resultHeader = <div className="title is-5 has-text-success">{CONSTANTS.commandModes.POPULAR}</div>
    }else if(command.mode === CONSTANTS.commandModes.TRENDING){
        dataUrl =dataUrl + '?cmd='+command.mode+(page.pageIndex>0?'&page='+page.pageIndex:'')
        resultHeader = <div className="title is-5 has-text-warning">{CONSTANTS.commandModes.TRENDING}</div>
    }else if(command.mode===CONSTANTS.commandModes.MYFEED){
        dataUrl = dataUrl  + '?cmd='+command.mode+(page.pageIndex>0?'&page='+page.pageIndex:'')
        resultHeader = <div className="title is-5 has-text-success">{command.param}'s feed</div>
    }else{
        return  <div className="auto title is-6 is-danger">Unable to find results for this operation!!</div>
    }
    
    
    function handleFetch(isNext){
        console.log('retrieve:'+(isNext?'next':'prev'))
        isNext?setPage({pageIndex:page.pageIndex+1,transition:true}):setPage({pageIndex:page.pageIndex-1,transition:false})
        
    }
    console.log('rendering parent')
    const {data,error} = useSWR(dataUrl,fetcher);
   

    if(error){
       
        return <div className="auto title is-6 is-danger">An error occured on the server!!{error.title}</div>
    }
    if(!data){
        console.log('loading...')
        return <div className="auto title is-5 is-info">Loading...</div>
    }

  
    const rowCount = data.resources.length;
    const noOfPages = Math.ceil(rowCount / CONSTANTS.PAGE_SIZE);
    
    
    return (
    
        <div>

                {<div className="box is-shadowless is-radiusless p-3 mb-0">
                    
                    {resultHeader}
                    </div>
                }
            
            <Paginator pageIndex={page.pageIndex} pageCount={noOfPages} data={data} onNextFetch={handleFetch} transition={page.transition} />
        
        </div>
       
    );

}