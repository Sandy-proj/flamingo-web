import Head from 'next/head'
import Link from 'next/link'
import { useState  } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import BaseLayout from '../../components/ui/BaseLayout'
import { mdiDragVertical, mdiPlus,mdiMinus, mdiHeart,mdiBookmark,mdiBookmarkOutline,mdiHeartOutline, mdiClose, mdiMinuss, mdiArrowDown, mdiMenuDown } from '@mdi/js'
import {Icon} from '@mdi/react'
import  axios from 'axios'
import clsx from 'clsx';
import Popup from '../../components/ui/Popup'
import { arrayMove } from 'react-sortable-hoc'
import { sortableContainer,sortableElement,sortableHandle } from 'react-sortable-hoc' 
import { CONSTANTS } from '../../components/Util/Constants'
import ConfirmationDialog from './ConfirmationDialog'
import router, { useRouter } from 'next/router'
import DropDownMenu from './DropDownMenu'

export default function EditSquare({resourceId,resource,onSave}) {
  const [list,setList] = useState(resource.resource);
  const [currentItem,setCurrentItem]=useState('')
  const [categories,setCategories]=useState([])
  const [selectedCategory,setSelectedCategory]=useState('ALL');
  const [resourceTitle,setResourceTitle] = useState('')
  const[discarding,setDiscarding] = useState(false)
  const [requestStatus,setRequestStatus]=useState({status:CONSTANTS.messageTypes.HIDDEN,message:'',error:false,isVisible:false})
  const router = useRouter();
  const categoriesUrl = '/hopsapi/resources/categories'
  function handleEntry(e){
    
    addItem(currentItem)
  }

  function handleKeyPress(e){
    if(e.key==='Enter'){
      addItem(e.target.value)

    }
  }

  function handleCancel(){
    setDiscarding(true);
  }

  function handleKeyChange(e){
    setCurrentItem(e.target.value)
  }

  function handleTitlechange(e){
    setResourceTitle(e.target.value)
  }

  function onDeleteItem(index){
 
    list.splice(index,1)
    setList([...list]);
  }


  function onItemChange(index,value){
    list[index].name=value;
  }

  function onDetailChange(index,value){
    list[index].detail=value;
  }
  async function handleSave(e){

    //Save the list on the server.
     e.preventDefault();
     if(requestStatus.status===CONSTANTS.messageTypes.PROGRESS){
       return;
     }
     try{
       
       setRequestStatus({status:CONSTANTS.messageTypes.PROGRESS,message:'Saving your data',isVisible:true})
       const resp = await axios.post('/hopsapi/resources/addresource',{resource:list,category:selectedCategory,title:resourceTitle},{timeout:10000});
       setRequestStatus({status:CONSTANTS.messageTypes.SUCCESS,message:'Done',isVisible:true})
       onSave(resp.data.id);
     }catch(error){
       console.error(error)
     }
  }

  function DropDownMenuTrigger(){
    return (
    <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
    <span>{selectedCategory}</span>
    <span class="icon is-small">
      <Icon path={mdiMenuDown}/>
    </span>
  </button>
    )
  }

  function addItem(itemString){
    const newValue = itemString; 
    if(newValue.trim()==='')return;  
    setList([...list,{name:newValue}]) 
    setCurrentItem('')
  }

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
     useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

  useEffect(async()=>{
    try{
      const listOfCategories = await axios.get(categoriesUrl,{timeout:CONSTANTS.REQUEST_TIMEOUT})
      setCategories(listOfCategories.data.categories)
    }catch(error){
      console.error(error);
    }
  },[])

  useEffect(()=>{
    if(resource&&resource.title)
    setResourceTitle(resource.title)
  },[resource])

  const DragHandle = sortableHandle(()=> <button className={clsx('button','is-white')}>
                                          <span className={clsx('icon','is-borderless')}>
                                            <Icon path={mdiDragVertical} size={1}></Icon>
                                          </span>
                                        </button>);

  
  function isListEmpty(){
    if(list&&list.length===0){
     return true;
    }else{
      return false;
    }
  }


  function ExpandableListItem({item,index,onDelete,onItemChange,onDetailChange}){
    const [isExpanded,setExpanded]=useState(false);
    const[itemData,setData]=useState(item)
    const itemRef = useRef();
    
    function handleExpansion(){
     setExpanded(!isExpanded)
    }

    function handleMainInput(e){
      onItemChange(index,e.target.value)
      setData({name:e.target.value})

    }

    function handleDetailChange(e){
      onDetailChange(index,e.target.value)
      var newItem = Object.assign({},itemData)
      newItem.detail=e.target.value;
      setData(newItem)
    }

    function handleDelete(e){
     onDelete(index);
    
    }

    //console.log('item-data:'+itemData.name)

   
    return <li ref={itemRef} className="mb-0 ml-0 p-1">
    
      <div className={clsx('columns','is-gapless','is-mobile','mb-1','mt-4')}>
      <div className={clsx('column','is-auto')}>
         <DragHandle/>
        </div>
        <div className={clsx('column','is-auto',isExpanded?'active-item':false)}>
          <button className={clsx('button','is-white')} onClick={handleExpansion}>
            <span className='icon'><Icon path={isExpanded?mdiMinus:mdiPlus} size={1}></Icon></span>
          </button>
        </div>
        <div className={clsx('column','is-10','ml-1','mr-1')}>
          <input className={clsx('input','is-hovered','entrystyle')} type="text" value={itemData.name} placeholder="Enter an item" onChange={handleMainInput}></input>
          <div className={clsx('tray',isExpanded?'tray-max':'tray-min')}>
      <textarea className={clsx('textarea','entrystyle')} rows={3} type="text" defaultValue={''} value={itemData.detail} onChange={handleDetailChange} placeholder="Add details"/>
  </div>
        </div>
        <div className={clsx('column','is-auto',isExpanded?'active-item':false)}>
        <button className={clsx('button','is-white')} onClick={handleDelete}>
            <span className='icon'><Icon path={mdiClose} size={1}></Icon></span>
          </button>
        </div>
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
    
    return <ExpandableListItem item={value} index={operationIndex} onItemChange={onItemChange} onDetailChange={onDetailChange} onDelete={onDeleteItem}/>
  })




    return (
      <div>
        <Head>
          <title>HopSquare</title>
          <link rel="icon" href="/tinylogo.png"  />
        </Head>
       
            <div>
            <div>


            <div className="columns">
             <div className="column is-one-fifth">
               
             </div>
             <ConfirmationDialog isVisible={discarding} message={'Are you sure you want to exit the page?'} onCancel={()=>{setDiscarding(false)}} onConfirm={()=>{router.replace('/')}} />
             <Popup status={requestStatus.status} onClose={()=>{setRequestStatus({isVisible:false})}} isVisible={requestStatus.isVisible} message={requestStatus.message}/>

             <div className="column is-auto">
               
             <div className="card p-3 is-shadowless mb-1">

            <nav class="level">
            <div className="level-left">
             <div class="level-item has-text-centered pl-5">
                <div>
                                 
                </div>
              </div>
              </div>
              <div class="level-item has-text-centered pl-5">
                <div>
                                
                </div>

              </div>
              <div className='levl-right'>
              <div class="level-item has-text-centered pl-5">
                <div>
      
                <div className={clsx('buttons')}>
                    <div>
                      <a onClick={handleCancel} className={clsx('button','is-info', 'is-light','centeralignment','hoverzoom')}>
                        <strong>Discard changes</strong>
                      </a>
                    </div>
                    <div >
                      <a onClick={handleSave} className={clsx('button','is-info','is-light','hoverzoom')}>
                        Save
                      </a>
                    </div>
                  </div>                
                </div>
              </div>
              </div>
            </nav>
               <input className={clsx('input','title','is-4','entrystyle')} placeholder='Enter a title here...' value={resourceTitle} onChange={handleTitlechange}></input>
               {/* <TitleInput inputValue={resource.title} onInputChange={handleInputChange}/> */}
               <DropDownMenu list={categories} trigger={DropDownMenuTrigger} onSelectItem={(index)=>{setSelectedCategory(categories[index])}}/>
              </div>
              <div className={clsx('box','listbox','mb-0','is-shadowless','has-background-gray')}>
            {isListEmpty()?<div className={clsx('min-screen-fill','container','centeralignment')}> 
  <p className={clsx('is-size-4')}>Lists are fun after adding the first item.<br/><span className={clsx('is-size-5','has-text-info')}> Use the text box below.</span></p>
</div>:
            <SortableContainer onSortEnd={onSortEnd} useDragHandle>
            {list.map((value,index)=> {;return <SortableElement key={index} index={index} operationIndex={index} value={value}></SortableElement>})}
            <AlwaysScrollToBottom/>
            </SortableContainer>
            
            }
            
            </div>
             
             {/* <div className={clsx('columns','is-gapless', 'is-mobile','mt-1','p-2')}>

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
              </div> */}

              <div className={clsx('columns','is-gapless', 'is-mobile','mt-0.5')}>

                <div className={clsx('column', 'is-auto','box','mr-0')}>
                  <input className={clsx('input','mr-0','is-large','has-text-blue','p-2','bottom-panel-dimensions')} autoFocus type="text" placeholder="Type your item & press enter." value={currentItem} onChange={handleKeyChange} onKeyPress={handleKeyPress}></input>
                </div>
                <div className={clsx('column', 'ml-0','is-1','p-1')}>
                  <button className={clsx('button','is-info','bottom-panel-dimensions','is-fullwidth')}
                    onClick={handleEntry}>
                    <span className={clsx('icon')}><Icon path={mdiPlus} size={2}></Icon></span>
                  </button>
                </div>
                </div> 








             </div>
            
             <div className="column is-one-fifth">
               
             </div>
          </div>
           
        
        
            
          </div>
            </div>
        
        </div>
    );
}
