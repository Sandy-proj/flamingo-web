import Head from 'next/head'
import Link from 'next/link'
import { useState  } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import BaseLayout from '../../components/ui/BaseLayout'
import { mdiDragVertical, mdiPlus, mdiCancel, mdiClose, mdiMinus } from '@mdi/js'
import {Icon} from '@mdi/react'
import  axios from 'axios'
import clsx from 'clsx';
import Popup from '../../components/ui/Popup'
import { arrayMove } from 'react-sortable-hoc'
import { sortableContainer,sortableElement,sortableHandle } from 'react-sortable-hoc' 
import { CONSTANTS } from '../../components/Util/Constants'

export default function EditSquare({resourceId,resource,onSave}) {
  const [list,setList] = useState(resource);
  const [currentItem,setCurrentItem]=useState('')
  const [requestStatus,setRequestStatus]=useState({status:CONSTANTS.messageTypes.HIDDEN,message:'',error:false,isVisible:false})

  function handleEntry(e){
    
    addItem(currentItem)
  }

  function handleKeyPress(e){
    if(e.key==='Enter'){
      addItem(e.target.value)

    }
  }


  function handleKeyChange(e){
    setCurrentItem(e.target.value)
  }

  function onDeleteItem(index){
 
    list.splice(index,1)
    setList([...list]);
  }

  async function handleSave(e){

    //Save the list on the server.
     e.preventDefault();
     if(requestStatus.status===CONSTANTS.messageTypes.PROGRESS){
       return;
     }
     try{
       
       setRequestStatus({status:CONSTANTS.messageTypes.PROGRESS,message:'Saving your data',isVisible:true})
       const resp = await axios.post('/hopsapi/resources/addresource',{resource:list},{timeout:10000});
       setRequestStatus({status:CONSTANTS.messageTypes.SUCCESS,message:'Done',isVisible:true})
       onSave();
     }catch(error){
       console.error(error)
     }
  }

  function addItem(itemString){
    const newValue = itemString; 
    if(newValue.trim()==='')return;  
    setList([...list,newValue]) 
    setCurrentItem('')
  }

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
     (() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

  const DragHandle = sortableHandle(()=> <button className={clsx('button','is-white')}>
                                          <span className={clsx('icon','is-borderless')}>
                                            <Icon path={mdiDragVertical} size={1}></Icon>
                                          </span>
                                        </button>);

  function ExpandableListItem({item,index,onDelete}){
    const [isExpanded,setExpanded]=useState(false);
    const[itemData,setData]=useState(item)
 
    
    function handleExpansion(){
     setExpanded(!isExpanded)
    }

    function handleMainInput(e){
      setData(e.target.value)
    }

    function handleDelete(e){
     onDelete(index);
    
    }
   
    return <li className="mb-0 ml-0 p-1">
    
      <div className={clsx('columns','is-gapless','is-mobile')}>
      <div className={clsx('column','is-auto')}>
         <DragHandle/>
        </div>
        <div className={clsx('column','is-auto',isExpanded?'active-item':false)}>
          <button className={clsx('button','is-white')} onClick={handleExpansion}>
            <span className='icon'><Icon path={isExpanded?mdiMinus:mdiPlus} size={1}></Icon></span>
          </button>
        </div>
        <div className={clsx('column','is-10','ml-1','mr-1')}>
          <input className={clsx('input','is-hovered','entrystyle')} type="text" value={itemData} placeholder="Enter an item" onChange={handleMainInput}></input>
        </div>
        <div className={clsx('column','is-auto',isExpanded?'active-item':false)}>
        <button className={clsx('button','is-white')} onClick={handleDelete}>
            <span className='icon'><Icon path={mdiClose} size={1}></Icon></span>
          </button>
        </div>
      </div>


  <div className={clsx('tray',isExpanded?'tray-max':'tray-min')}>
      <input className={clsx('input','entrystyle')} type="text" defaultValue={''} placeholder="Add details"/>
  </div>
    
    </li>
  }


  
  function onSortEnd({oldIndex,newIndex}){

    setList(arrayMove(list,oldIndex,newIndex));
  }




  const SortableContainer = sortableContainer(({children}) => {
    return <ul>{children}</ul>;
  });

  const SortableElement = sortableElement(({value,index,operationIndex})=>{
    
    return <ExpandableListItem item={value} index={operationIndex} onDelete={onDeleteItem}/>
  })




    return (
      <div>
        <Head>
          <title>HopSquare</title>
          <link rel="icon" href="/tinylogo.png"  />
        </Head>
       
            <BaseLayout>
            <div>
            <nav class="navbar pr-4 pl-3" role="navigation" aria-label="main navigation">
            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          
          </a>
          <div class="level navbar-end">
          <div class="navbar-item,level-item">
        <div class="buttons">
          <button class="button is-primary" onClick={handleSave}>
            <strong>Save</strong>
          </button>
        </div>
        <Popup status={requestStatus.status} onClose={()=>{setRequestStatus({isVisible:false})}} isVisible={requestStatus.isVisible} message={requestStatus.message}/>
      </div>
          </div>
              </nav>
            <div className="columns">
             <div className="column is-one-fifth">
               menu
             </div>
             <div className="column is-auto">
               
             <div className="card p-3 is-shadowless mb-1"><p className="title is-4 ml-5">A list of awesome things.</p></div>

            <div className={clsx('box','listbox','mb-0','is-shadowless','has-background-gray')}>
            <SortableContainer onSortEnd={onSortEnd} useDragHandle>
            {list.map((value,index)=> {console.log('idex:'+index);return <SortableElement key={index} index={index} operationIndex={index} value={value}></SortableElement>})}
            <AlwaysScrollToBottom/>
            </SortableContainer>
            
            </div>
           
             
             <div className={clsx('columns','is-gapless', 'is-mobile','mt-1','p-2')}>

                <div className={clsx('column', 'is-auto','mr-0')}>
                  <input className={clsx('input', 'is-rounded-left-side','mr-0','p-2','bottom-panel-dimensions')} autoFocus type="text" placeholder="Type your item & press enter." value={currentItem} onChange={handleKeyChange} onKeyPress={handleKeyPress}></input>
                </div>
                <div className={clsx('column', 'ml-0','is-1','bottom-panel-dimensions')}>
                  <button className={clsx('button','is-info','is-rounded-right-side','bottom-panel-dimensions')}
                    onClick={handleEntry}>
                    <span className={clsx('icon')}><Icon path={mdiPlus}></Icon></span>
                  </button>
                </div>
                <div className={clsx('column','is-1')}></div>
              </div>


             </div>
            
             <div className="column is-one-fifth">
               actions
             </div>
          </div>
           
        
        
            
          </div>
            </BaseLayout>
        
        </div>
    );
}
