import clsx from 'clsx';
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
        <div className={clsx("field",'has-addons','centeralignment')} >
        <p className="control">
              <input class="input is-rounded" value={searchString} type="text" placeholder="Find a post" onChange={updateSearchString} onKeyPress={handleKeyPress}/>
             
        </p>
        <p className="control">
          <button class="button is-info" onClick={(e)=>{setSearchCommand(true);onSearch(searchString)}}>
            Search
          </button>
        </p>
      </div> 
    );

}