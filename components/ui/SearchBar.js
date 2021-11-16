import { mdiMagnify, mdiSearchWeb } from '@mdi/js';
import clsx from 'clsx';
import Icon from '@mdi/react'
import { useEffect, useState } from 'react';
export default function SearchBar({onSearch,reset,children}){
  const [searchString,setSearchString] = useState('')
  const [searchCommand,setSearchCommand] = useState(false);
  function updateSearchString(e){

      setSearchString(e.target.value)
  }

  function handleKeyPress(e){
    if(e.key==='Enter'){
      setSearchCommand(true);
      onSearch(searchString)
    }
  }

  useEffect(()=>{
    if(reset&&searchCommand){
      searchString&&setSearchString('');
      setSearchCommand(false)
    }
  })
  
    return (
      //   <div className={clsx("field",'has-addons','centeralignment')} >
      //   <p className="control">
      //         <input class="input is-rounded" value={searchString} type="text" placeholder="Find a post" onChange={updateSearchString} onKeyPress={handleKeyPress}/>
             
      //   </p>
      //   <p className="control">
      //     <button class="button is-info" onClick={(e)=>{setSearchCommand(true);onSearch(searchString)}}>
      //       Search
      //     </button>
      //   </p>
      // </div> 
      <div className={clsx("field",'has-addons','centeralignment')} >
      <div className="control has-icons-right">
            <input className={clsx('input','is-rounded','ghost','thin-border-button')} value={searchString} type="text" placeholder="Find a list" onChange={updateSearchString} onKeyPress={handleKeyPress}/>
            <span className={clsx('icon', 'is-small', 'is-right')}><Icon path={mdiMagnify} size={1}></Icon></span>
      </div>
     
    </div> 
    
      );

}