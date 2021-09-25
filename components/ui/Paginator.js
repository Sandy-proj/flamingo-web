import { mdiClockTimeSix } from '@mdi/js';
import clsx from 'clsx';
import { useState } from 'react';
import { CONSTANTS } from '../Util/Constants';
import ResourceCard from './ResourceCard'
import { useEffect } from 'react';
export default function Paginator({onNextFetch,onSelection,pageIndex,pageCount,data,transition,isLoggedIn,children}){
  

  if(pageCount==0){
    return;
  }
  const firstPage = pageIndex*CONSTANTS.MAX_PAGES;
  const lastPage = pageCount==CONSTANTS.MAX_PAGES?firstPage+CONSTANTS.MAX_PAGES+1:firstPage+pageCount;
  const [currentPage,setCurrentPage] = useState(1)

  console.log('f-t-l:'+firstPage+":"+pageCount+':'+lastPage);

  //Update Current page.
  function updateCurrentPage(e){
    e.preventDefault();
    console.log(e.target.id)
    if(e.target.id==firstPage){
      if(firstPage==1){
        return;
      }else{
        onNextFetch(false)//Get previous fetch (batch of 10 pages from parent.)
      }
    }else if(e.target.id==lastPage){
      if(lastPage<firstPage+CONSTANTS.MAX_PAGES+1){
        setCurrentPage(parseInt(e.target.id))
      }else{
        console.log('get next')
        onNextFetch(true)//Get next fetch(batch of 10 pages from parent.)
      }
     

    }else{
      setCurrentPage(parseInt(e.target.id))
    }

  }
  


  function handlePrevious(e){
    e.preventDefault();
    if(currentPage<=firstPage+1){
      if(currentPage==1){
        return;
      }else{
        onNextFetch(false)//Get previous fetch (batch of 10 pages from parent.)
      }
    }else{
      setCurrentPage(currentPage-1);
    }
  }




  function handleNext(e){
    e.preventDefault();
    if(currentPage>=lastPage+1){
      if(lastPage<firstPage+CONSTANTS.MAX_PAGES+1){
       return;
      }else{
        console.log('get next')
        onNextFetch(true)//Get next fetch(batch of 10 pages from parent.)
      }
    }else{
      setCurrentPage(currentPage+1);
    }
  }

  useEffect(() => {
    console.log('applying effect')
    transition?setCurrentPage(firstPage+1):setCurrentPage(lastPage-1);
  },[pageIndex]);



   console.log('page index:'+pageIndex);
   //Generate a sequence for processing 
   const pageSequence = Array.from({ length: pageCount+2 }, (_, i) => i+firstPage)
   let offsetCurrentPage = currentPage%CONSTANTS.MAX_PAGES;
   if(offsetCurrentPage==0){offsetCurrentPage=CONSTANTS.MAX_PAGES}
    return (
      <div>
        <ul>
            
          {
            data.resources.slice((offsetCurrentPage-1)*CONSTANTS.PAGE_SIZE,(offsetCurrentPage)*CONSTANTS.PAGE_SIZE).map(item=><li>
              <ResourceCard isLoggedIn={isLoggedIn} resourceData={item} onSelection={onSelection}></ResourceCard>
              </li>)
          }
        </ul>

        <div className="box mt-0 mb-1 has-background-white is-radiusless is-shadowless">
          <nav className={clsx("pagination",'centeralignment','is-centered','is-rounded')} role="navigation" aria-label="pagination">
              <a className="pagination-previous" onClick={handlePrevious}>Previous</a>
              <a className="pagination-next" onClick={handleNext}>Next page</a>
              <ul className="pagination-list">
              {pageSequence.filter(i=>i>0).map(item=> <li key={item}><a id={item} className={clsx('pagination-link',item==currentPage?'is-current':false)} onClick={updateCurrentPage} aria-label="Goto page 1">{item}</a></li>)}
                </ul>
          </nav>    
        </div>
      </div>
    );

}