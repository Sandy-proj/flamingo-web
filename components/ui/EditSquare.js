import Head from 'next/head'
import Link from 'next/link'
import { useContext, useState  } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import BaseLayout from '../../components/ui/BaseLayout'
import { mdiDragVertical, mdiPlus,mdiMinus, mdiHeart,mdiBookmark,mdiSwapVertical,mdiBookmarkOutline,mdiHeartOutline, mdiClose, mdiMinuss, mdiArrowDown, mdiMenuDown } from '@mdi/js'
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
import { AuthorizationContext } from '../Util/AuthContext'
import SimpleAlert from './SimpleAlert'

export default function EditSquare({resourceId,resource,onSave}) {
  const [list,setList] = useState([]);
  const [currentItem,setCurrentItem]=useState('')
  const [categories,setCategories]=useState([])
  const [selectedCategory,setSelectedCategory]=useState('Anything goes');
  const [resourceTitle,setResourceTitle] = useState('')
  const [swapMode,setSwapMode] = useState(false);
  const[discarding,setDiscarding] = useState(false)
  const [titleValidation,setTitleValidation] = useState(false);
  const [requestStatus,setRequestStatus]=useState({status:CONSTANTS.messageTypes.HIDDEN,message:'',error:false,isVisible:false})
  const router = useRouter();
  const user = useContext(AuthorizationContext)
  const categoriesUrl = '/hopsapi/resources/categories'
  const addResourcesUrl = '/hopsapi/resources/resource/add'
  const updateUrl = '/hopsapi/resources/resource/update'
  const inputLengthLimit = 150;
  const itemLimit=CONSTANTS.LIST_ITEM_LIMIT;

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


  function toggleSwap(){
    setSwapMode(!swapMode);
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

  function getNewItemId(){
    //Return the maximum running id  + 1;
    var newId = list.reduce((maxId,item)=>Math.max(maxId,item.id),0);
    //console.log(newId+1)
    return newId+1;
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

     if(resourceTitle.length===0){
       setTitleValidation(true);
       return;
     }
     try{
       let resp = null;
       if(resource.id>0){
        setRequestStatus({status:CONSTANTS.messageTypes.PROGRESS,message:'Updating your data',isVisible:true})
        const updateRequest = updateUrl+'?res='+resource.id
        resp = await axios.post(updateUrl,{resource:list,category:selectedCategory,title:resourceTitle,author_id:user.id,author_name:localStorage.getItem(CONSTANTS.HOPS_USERNAME_KEY),resource_id:resource.id},{timeout:10000});
        setRequestStatus({status:CONSTANTS.messageTypes.SUCCESS,message:'Done',isVisible:true})
       }else{
        setRequestStatus({status:CONSTANTS.messageTypes.PROGRESS,message:'Saving your data',isVisible:true})
        resp = await axios.post(addResourcesUrl,{resource:list,category:selectedCategory,title:resourceTitle,author_id:user.id,author_name:localStorage.getItem(CONSTANTS.HOPS_USERNAME_KEY)},{timeout:10000});
        setRequestStatus({status:CONSTANTS.messageTypes.SUCCESS,message:'Done',isVisible:true})
       }
     
       onSave(resp.data.data);
     }catch(error){
       console.error(error)
     }
  }

  function DropDownMenuTrigger(){
    return (
    <button className={clsx("button",'is-light','mr-2')} aria-haspopup="true" aria-controls="dropdown-menu">
    <span><strong>{selectedCategory}</strong></span>
    <span class="icon is-small">
      <Icon path={mdiMenuDown}/>
    </span>
  </button>
    )
  }

  function addItem(itemString){
    const newValue = itemString; 
    if(newValue.trim()==='')return;  
    var newId = getNewItemId();
    setList([...list,{id:newId,name:newValue}]) 
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
      setCategories(listOfCategories.data.data.categories)
    }catch(error){
      console.error(error);
    }
  },[])

  useEffect(()=>{
    if(resource.data){
      setList(resource.data.resource?resource.data.resource:[]);
    }
    if(resource.data&&resource.data.title)
    setResourceTitle(resource.data.title)
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
      //console.log(e.target.value.length)
      if(e.target.value.length>inputLengthLimit){
        return;
      }
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
      {swapMode&&<div className={clsx('column','is-auto','is-narrow')}>
         <span><DragHandle/></span>
      
        </div>}
      
        <div className={clsx('column','is-auto','is-narrow',isExpanded?'active-item':false)}>
          <button className={clsx('button','is-white')} onClick={handleExpansion}>
            <span className='has-text-grey'><Icon path={isExpanded?mdiMinus:mdiPlus} size={1}></Icon></span>
          </button>
        </div>
        <div className={clsx('column','is-auto','ml-1','mr-1')}>
          <input maxLength={CONSTANTS.LIST_ITEM_MAX_LENGTH} className={clsx('input','is-hovered','entrystyle')} type="text" value={itemData.name} placeholder="Enter an item" onChange={handleMainInput}></input>
          <div className={clsx('tray',isExpanded?'tray-max':'tray-min')}>
      <textarea maxLength={CONSTANTS.LIST_ITEM_DETAIL_MAX_LENGTH} className={clsx('textarea','entrystyle')} rows={3} type="text" defaultValue={''} value={itemData.detail} onChange={handleDetailChange} placeholder="Add details"/>
  </div>
        </div>
        <div className={clsx('column','is-1','is-narrow',isExpanded?'active-item':false)}>
        <button className={clsx('button','is-white')} onClick={handleDelete}>
            <span className='has-text-grey'><Icon path={mdiClose} size={1}></Icon></span>
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


  function closeDialog(){
    setTitleValidation(false)
  }


    return (
      <div>
        <Head>
          <title>HopSquare</title>
          <link rel="icon" href="/tinylogo.png"  />
        </Head>
            <SimpleAlert isVisible={titleValidation} message={'Enter a title to save the list.'} onCancel={closeDialog} onConfirm={closeDialog} onClose={closeDialog}/> 
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
               <input maxLength={CONSTANTS.LIST_ITEM_TITLE_MAX_LENGTH} className={clsx('input','title','is-4','entrystyle')} placeholder="It's a list of" value={resourceTitle} onChange={handleTitlechange}></input>
               {/* <TitleInput inputValue={resource.title} onInputChange={handleInputChange}/> */}
               <div>
                    <DropDownMenu list={categories} trigger={DropDownMenuTrigger} onSelectItem={(index)=>{setSelectedCategory(categories[index].name)}}/>
                      <button className={clsx('button','is-light',swapMode?'has-background-info':'')} onClick={toggleSwap}>
            <span className={clsx(swapMode?'has-text-white':'has-text-grey')}><Icon path={mdiSwapVertical} size={1}></Icon></span>
          </button>
               </div>
              </div>
              <div className={clsx('box','listbox','mb-0','is-shadowless','has-background-gray')}>
            {isListEmpty()?<div className={clsx('min-screen-fill','container','centeralignment')}> 
  <p className={clsx('is-size-4')}>Lists are fun after adding the first item.<br/><span className={clsx('is-size-5','has-text-info')}> Use the text box below.</span></p>
</div>:
            <SortableContainer onSortEnd={onSortEnd} useDragHandle>
              {list.map((value,index)=> {;return <SortableElement key={value.id} index={index} operationIndex={index} value={value}></SortableElement>})}
              <AlwaysScrollToBottom/>
            </SortableContainer>
            
            }
            
            </div>
          
              <div className={clsx('columns','is-gapless', 'is-mobile','mt-0.5')}>

                <div className={clsx('column', 'is-auto','box','mr-0')}>
                {list.length>itemLimit?<div className={clsx('has-background-gray')}><p className={clsx('title','has-background-gray','tag','has-text-info','container','is-6')}>You have reached the maximum items on a list({itemLimit}).</p></div>:
                 <input maxLength={CONSTANTS.LIST_ITEM_MAX_LENGTH} className={clsx('input','mr-0','is-large','has-text-blue','p-2','bottom-panel-dimensions')}  disabled={list.length>itemLimit} autoFocus type="text" placeholder={`Type your item  press enter.(MAX ${CONSTANTS.LIST_ITEM_MAX_LENGTH})`} value={currentItem} onChange={handleKeyChange} onKeyPress={handleKeyPress}></input>

                }
                                 </div>
                <div className={clsx('column', 'ml-0','is-1','p-1')}>
                  <button className={clsx('button','pl-6','pr-6','is-info','bottom-panel-dimensions','is-fullwidth')}
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
