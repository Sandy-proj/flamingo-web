import { mdiChevronLeft, mdiChevronRight, mdiClockTimeSix, mdiPageNext, mdiPagePrevious } from '@mdi/js';
import clsx from 'clsx';
import { useState } from 'react';
import { CONSTANTS } from '../Util/Constants';
import ResourceCard from './ResourceCard'
import { useEffect } from 'react';
import Icon from '@mdi/react';
import Footer from './Footer';
export default function Paginator({displayFlag,onNextFetch,onSelection,pageIndex,pageCount,data,transition,isLoggedIn,children}){
  

  if(pageCount==0){
    return;
  }
  const firstPage = pageIndex*CONSTANTS.MAX_PAGES;
  const lastPage = pageCount==CONSTANTS.MAX_PAGES?firstPage+CONSTANTS.MAX_PAGES+1:firstPage+pageCount;
  const [currentPage,setCurrentPage] = useState(1)



  //Update Current page.
  function updateCurrentPage(e){
    e.preventDefault();
    window.scrollTo({top: 0, behavior: 'smooth'})
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

        onNextFetch(true)//Get next fetch(batch of 10 pages from parent.)
      }
     

    }else{
      setCurrentPage(parseInt(e.target.id))
    }

  }
  


  function handlePrevious(e){
    e.preventDefault();
    window.scrollTo({top: 0, behavior: 'smooth'})
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
    window.scrollTo({top: 0, behavior: 'smooth'})
    e.preventDefault();
    if(currentPage>=lastPage+1){
      if(lastPage<firstPage+CONSTANTS.MAX_PAGES+1){
       return;
      }else{

        onNextFetch(true)//Get next fetch(batch of 10 pages from parent.)
      }
    }else{
      setCurrentPage(currentPage+1);
    }
  }

  useEffect(() => {

    transition?setCurrentPage(firstPage+1):setCurrentPage(lastPage-1);
  },[pageIndex]);


  function Tile({index,id}){
    useState()
    let tileBody = <div className={clsx('tile','is-child','box')} id={id}><div className={clsx('title')}>one</div></div>
    if(index%3==0){

      tileBody = <div className={clsx('tile','is-parent','is-4')}> {tileBody}</div>
    }

    return tileBody;
  }



  function Row({items,id}){
    //console.log('--')
    //console.log(items)
    return <div className={clsx('tile','is-parent','ml-3','mr-4','p-0','mb-0','mt-1','is-shadowless')}>
     {items.map((item,index)=><ResourceCard isLoggedIn={isLoggedIn} resourceData={item}  onSelection={onSelection}></ResourceCard>
      )}
     </div>
  
  }
   if(!data){
     return 
   }

   //Generate a sequence for processing 
   const pageSequence = Array.from({ length: pageCount+2 }, (_, i) => i+firstPage)
   let offsetCurrentPage = currentPage%CONSTANTS.MAX_PAGES;
  
   if(offsetCurrentPage==0){offsetCurrentPage=CONSTANTS.MAX_PAGES}

    return (
      <div className={'min-screen-fill'}>
        <ul>
            
          {
            data.slice((offsetCurrentPage-1)*CONSTANTS.PAGE_SIZE,(offsetCurrentPage)*CONSTANTS.PAGE_SIZE).map(item=><li key={item.id}>
               
                <ResourceCard isLoggedIn={isLoggedIn} resourceData={item}  onSelection={onSelection}></ResourceCard>
              </li>)
          }
        </ul>


        
        
        {/* <div className={clsx('tile','is-ancestor')}>
          <div className={clsx('tile','is-vertical')}>

            {
              
              data.slice((offsetCurrentPage-1)*CONSTANTS.PAGE_SIZE,(offsetCurrentPage)*CONSTANTS.PAGE_SIZE).filter((item,index)=>index%2==0).map((item,index)=><Row items={data.slice((offsetCurrentPage-1)*CONSTANTS.PAGE_SIZE+index*2,(offsetCurrentPage-1)*CONSTANTS.PAGE_SIZE+index*2+2)}></Row>)
            
            }
           
           </div>

        </div> */}

          {
            displayFlag&&<div className="box mt-0 mb-1 has-background-white is-radiusless is-shadowless">
            <nav className={clsx("pagination",'centeralignment','is-centered','is-rounded')} role="navigation" aria-label="pagination">
                <a className="pagination-previous" onClick={handlePrevious}><span><Icon path={mdiChevronLeft} size={1}></Icon></span></a>
               
                <ul className="pagination-list">
                {pageSequence.filter(i=>i>0).map(item=> <li key={item}><a id={item} className={clsx('pagination-link',item==currentPage?'is-current':false)} onClick={updateCurrentPage} aria-label="Goto page 1">{item}</a></li>)}
                  </ul>
                  <a className="pagination-next" onClick={handleNext}><span><Icon path={mdiChevronRight} size={1}></Icon></span></a>
            </nav>    
          </div>
          }
       
      </div>
    );

}