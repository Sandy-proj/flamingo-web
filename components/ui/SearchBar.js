import clsx from 'clsx';
import { useState } from 'react';
export default function SearchBar({onSearch,children}){
  const [searchString,setSearchString] = useState('')
  function updateSearchString(e){
  
      setSearchString(e.target.value)
  }

  function handleKeyPress(e){
    if(e.key==='Enter'){
      onSearch(searchString)
    }
  }
    return (
        <div className={clsx("field",'has-addons','centeralignment')} >
        <p class="control">
              <input class="input is-rounded" value={searchString} type="text" placeholder="Find a post" onChange={updateSearchString} onKeyPress={handleKeyPress}/>
        </p>
        <p class="control">
          <button class="button is-info" onClick={(e)=>{onSearch(searchString)}}>
            Search
          </button>
        </p>
      </div> 
    );

}