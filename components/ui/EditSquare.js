import Head from 'next/head'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import BaseLayout from '../../components/ui/BaseLayout'
import { mdiDragVertical, mdiPlus, mdiMinus, mdiHeart, mdiBookmark, mdiSwapVertical, mdiBookmarkOutline, mdiHeartOutline, mdiClose, mdiMinuss, mdiArrowDown, mdiMenuDown, mdiCheck, mdiCancel, mdiMenuUp, mdiDelete } from '@mdi/js'
import { Icon } from '@mdi/react'
import axios from 'axios'
import clsx from 'clsx';
import Popup from '../../components/ui/Popup'
import { arrayMove } from 'react-sortable-hoc'
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc'
import { CONSTANTS } from '../../components/Util/Constants'
import ConfirmationDialog from './ConfirmationDialog'
import router, { useRouter } from 'next/router'
import DropDownMenu from './DropDownMenu'
import { AuthorizationContext } from '../Util/AuthContext'
import SimpleAlert from './SimpleAlert'
import { getCookie, isValidUrl } from '../Util/Session'
import Alert from './AlertBox'

export default function EditSquare({ resourceId, resource, onSave,onError }) {
  const [list, setList] = useState([]);
  const [runningNumber,setRunningNumber] = useState(0);
  const [currentItem, setCurrentItem] = useState('')
  const [categories, setCategories] = useState([])
  const [refreshFlag,setRefreshFlag] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Anything goes');
  const [resourceTitle, setResourceTitle] = useState('')
  const [swapMode, setSwapMode] = useState(false);
  const [deleteMode,setDeleteMode] = useState(false);
  const [discarding, setDiscarding] = useState(false)
  const [titleValidation, setTitleValidation] = useState(false);
  const [requestStatus, setRequestStatus] = useState({ status: CONSTANTS.messageTypes.HIDDEN, message: '', error: false, isVisible: false })
  const router = useRouter();
  const user = useContext(AuthorizationContext)
  const categoriesUrl = '/hopsapi/resources/categories'
  const addResourcesUrl = '/hopsapi/resources/resource/add'
  const updateUrl = '/hopsapi/resources/resource/update'
  const inputLengthLimit = 150;
  const inputTypes = [{id:1,name:'Text'},{id:2,name:'Link'}]
  const itemLimit = CONSTANTS.LIST_ITEM_LIMIT;
  const titleRef = useRef('');

  
  function handleCancel() {
    setDiscarding(true);
  }


  function toggleSwap() {
    setSwapMode(!swapMode);
  }
  function toggleDelete(){
    setDeleteMode(!deleteMode);
  }
  function handleKeyChange(e) {
    setCurrentItem(e.target.value)
  }

  function handleTitlechange(e) {
    //setResourceTitle(e.target.value)
    titleRef.current=e.target.value;
  }

  function onDeleteItem(index) {

    list.splice(index, 1)
    setList([...list]);
  }

  function getNewItemId() {
    // //Return the maximum running id  + 1;
    // var newId = list.reduce((maxId, item) => Math.max(maxId, item.id), 0);
    // //console.log(newId+1)
    // return newId + 1;
    setRunningNumber(runningNumber+1)
    return runningNumber+1;
  }

  function onItemChange(index, value) {
    list[index].name = value;
  }

  function onDetailChange(index, value) {
    list[index].detail = value;
  }


  useEffect(()=>{
    if(resource.id===-1)
    return;
    if(resource&&resource.data&&resource.data.resource)
     
    var newId = resource.data.resource.reduce((maxId, item) => Math.max(maxId, item.id), 0);
    //console.log(newId+1)
    setRunningNumber(newId);

  },[resource])

  useEffect(async()=>{
    //console.log(user.handshakeInProgress)
    if(refreshFlag&&!user.handshakeInProgress){
      //console.log('refreshing')
      setRefreshFlag(false);
      handleSave();
    }
  },[user.handshakeInProgress])




  async function handleSave() {

    //Save the list on the server.
    //e.preventDefault();

    //Do not process if a 'save' is in progress.
    if (requestStatus.status === CONSTANTS.messageTypes.PROGRESS) {
      return;
    }
    //Do not proceed if the title is empty.
    if (titleRef&&titleRef.current.length === 0) {

      setTitleValidation(true);
      return;
    }

    const securityToken = getCookie(CONSTANTS.REQUEST_COOKIE_KEY)
    let resp = null;
    try {
      if (resource.id > 0) {
        //console.log('update request-'+resourceTitle)

        setRequestStatus({ status: CONSTANTS.messageTypes.PROGRESS, message: 'Updating your data', isVisible: true })
        const updateRequest = updateUrl + '?res=' + resource.id
        resp = await axios.post(updateUrl, { resource: list, category: selectedCategory, title: titleRef.current, author_id: user.id, author_name: localStorage.getItem(CONSTANTS.HOPS_USERNAME_KEY), resource_id: resource.id ,[CONSTANTS.REQUEST_PARAM_KEY]:securityToken}, { timeout: 10000 });
        //console.log(resp)
      } else {
       //console.log('insert request')
        setRequestStatus({ status: CONSTANTS.messageTypes.PROGRESS, message: 'Saving your data', isVisible: true })
        resp = await axios.post(addResourcesUrl, { resource: list, category: selectedCategory, title: titleRef.current, author_id: user.id, author_name: localStorage.getItem(CONSTANTS.HOPS_USERNAME_KEY) ,[CONSTANTS.REQUEST_PARAM_KEY]:securityToken}, { timeout: 10000 });
        //console.log(resp)
      }
      setRequestStatus({ status: CONSTANTS.messageTypes.SUCCESS, message: 'Done', isVisible: true })

      //If the Secure token expires, set the refreshe flag and initiate a handshake(refresh of access). Wait for the effect to trigger this method.
      if(resp.data&&resp.data.data&&resp.data.data.action==='REFRESH'){
        //console.log('refreshing')
        setRefreshFlag(true);
        user.initiateHandshake();
        return;

      }
      if(resp&&resp.data&&resp.data.data)
      onSave(resp.data.data);
    } catch (error) {
          // console.log(error)
           onError(403)
      
    }finally{
      setRequestStatus({ status: CONSTANTS.messageTypes.HIDDEN, message: 'Updating your data', isVisible: false })

    }
  }

  function DropDownMenuTrigger() {
    return (
      <button className={clsx("button", 'ml-2','is-white', 'mr-2','is-small')} aria-haspopup="true" aria-controls="dropdown-menu">
        <span className={clsx('has-text-grey-darker')}><strong>{selectedCategory}</strong></span>
        <span class="icon is-small">
          <Icon path={mdiMenuDown} />
        </span>
      </button>
    )
  }

  function addItem(itemString,type,bookmark) {
    const newValue = itemString;
    if (newValue.trim() === '') return;
    var newId = getNewItemId();
    setList([...list, { id: newId, name: newValue,type:type,bookmark:bookmark}])
    setCurrentItem('')
  }

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

  useEffect(async () => {
    try {
      const listOfCategories = await axios.get(categoriesUrl, { timeout: CONSTANTS.REQUEST_TIMEOUT })
      setCategories(listOfCategories.data.data.categories)
    } catch (error) {
      console.error(error);
    }
  }, [])

  useEffect(() => {
    if (resource.data) {
      setList(resource.data.resource ? resource.data.resource : []);
    }
    if (resource.data && resource.data.title)
      setResourceTitle(resource.data.title)
  }, [resource])

  const DragHandle = sortableHandle(() => <button className={clsx('button', 'is-white')}>
    <span className={clsx('icon', 'is-borderless')}>
      <Icon path={mdiDragVertical} size={1}></Icon>
    </span>
  </button>);


  function isListEmpty() {
    if (list && list.length === 0) {
      return true;
    } else {
      return false;
    }
  }


  function EntryBox(){
    const [isLink,setIsLink] = useState(false);
    const [currentBoxEntry,setCurrentBoxEntry] = useState('')
    const [bookmark,setBookmark] = useState('')
    const [validation,setValidation] = useState(true)
    const [focus,setFocus] = useState(false);
    function handleTextKeyPress(e) {
      if (e.key === 'Enter') {
        addItem(e.target.value,isLink?CONSTANTS.LINK_TYPE:CONSTANTS.TEXT_TYPE)
        setFocus(true)
      }
    }
    function validationAcknowledgement(e){
      setValidation(true)
    }
    function handleLinkKeyPress(e) {
      // if (e.key === 'Enter') {
      //   addItem(e.target.value,isLink?CONSTANTS.LINK_TYPE:CONSTANTS.TEXT_TYPE)
  
      // }
    }

    function handleTextEntry(e){
      if(currentBoxEntry.trim()===''){
        //setValidation(false)
        return;
      }
      if(isLink){
        //console.log('isvalid'+currentBoxEntry+'-'+isValidUrl(currentBoxEntry))
        if(!isValidUrl(currentBoxEntry)){
          setValidation(false);
          return;
        }
        
      }
      addItem(currentBoxEntry,isLink?CONSTANTS.LINK_TYPE:CONSTANTS.TEXT_TYPE,bookmark?bookmark:'Link')
      setFocus(true)
    }

    function handleLinkEntry(e){
      addItem(currentBoxEntry)
    }

    function DropDownChoice() {
      return (
      
        <button className={clsx("button", 'ml-2','is-white', 'mr-2','bottom-panel-dimensions')} aria-haspopup="true" aria-controls="dropdown-menu">
          <span><strong>{isLink?'Link':'Text'}</strong></span>
          <span class="icon is-small">
            <Icon path={mdiMenuUp} />
          </span>
        </button>
       
      )
    }

    //console.log('is-link'+isLink)
    return (<div className={clsx('columns', 'is-gapless', 'is-mobile', 'mb-2')}>
      <Alert isVisible={!validation} message={'The link is not supported.'} onCancel={validationAcknowledgement}/>
      <div className={clsx('column','is-narrow','has-background-white')}>
     
        <DropDownMenu  up={true} list={inputTypes} trigger={DropDownChoice} onSelectItem={(index) => { setIsLink(inputTypes[index].name==='Link'?true:false) }} />

      </div>
      {
        isLink?   <div className={clsx('column', 'is-auto', 'box', 'mr-0')}>
        {list.length > itemLimit ? <div className={clsx('has-background-gray')}><p className={clsx('title', 'has-background-gray', 'tag', 'has-text-info', 'container', 'is-6')}>You have reached the maximum items on a list({itemLimit}).</p></div> :
          <div>
          <input key={1} maxLength={CONSTANTS.LIST_ITEM_MAX_LENGTH} className={clsx('input', 'mr-0', 'p-2', 'thin-border-button','ghost','entrystyle', 'is-small','bottom-panel-small-dimensions')} disabled={list.length > itemLimit} type="text" onPaste={(e)=>{}} placeholder={`Paste your url.`} value={currentBoxEntry}  onChange={e=>setCurrentBoxEntry(e.target.value)}></input>
          <input key={2} maxLength={CONSTANTS.LIST_ITEM_MAX_LENGTH} className={clsx('input', 'mr-0', 'p-2', 'thin-border-button','ghost', 'is-small','entrystyle','bottom-panel-small-dimensions')} disabled={list.length > itemLimit} type="text" onPaste={(e)=>{}} placeholder={`Add label`} value={bookmark}  onChange={e=>setBookmark(e.target.value)}></input>
 
           </div>
        }
      </div>: <div className={clsx('column', 'is-auto', 'box', 'mr-0')}>
       
       {list.length > itemLimit ? <div className={clsx('has-background-gray')}> 
     
       <span>
       <p className={clsx('title', 'has-background-gray', 'tag', 'has-text-info', 'container', 'is-6')}>You have reached the maximum items on a list({itemLimit}).</p>
         </span>
       </div> :<div>
     
         <span><input maxLength={CONSTANTS.LIST_ITEM_MAX_LENGTH} className={clsx('input', 'mr-0',  'has-text-blue', 'p-2', 'thin-border-button','ghost','bottom-panel-dimensions')} disabled={list.length > itemLimit} type="text" onPaste={(e)=>window.alert(e.clipboardData.getData('text'))} placeholder={`Type your item & press enter.(Upto ${CONSTANTS.LIST_ITEM_MAX_LENGTH} characters)`} value={currentBoxEntry} onChange={e=>setCurrentBoxEntry(e.target.value)} autoFocus={true} onKeyPress={handleTextKeyPress}></input>
         </span>
         </div>
       }
     </div>
      }
       <div className={clsx('column', 'ml-0', 'is-1', 'p-1')}>
        <button className={clsx('button', 'bottom-panel-dimensions', 'is-fullwidth')}
          onClick={handleTextEntry}>
          <span className={clsx('icon','is-info')}><Icon path={mdiPlus} size={2}></Icon></span>
        </button>
      </div>

    </div>
    )

   
  }

  function ExpandableListItem({ item, index, onDelete, onItemChange, onDetailChange }) {
    const [isExpanded, setExpanded] = useState(false);
    const [itemData, setData] = useState(item)
    const itemRef = useRef();
    const [detailFocus,setDetailFocus] = useState(false)

    function handleExpansion() {
      setDetailFocus(true)
      setExpanded(!isExpanded)
    }

    function handleMainInput(e) {
      //console.log(e.target.value.length)
      if (e.target.value.length > inputLengthLimit) {
        return;
      }
      onItemChange(index, e.target.value)
      var newItem = Object.assign({}, itemData)
      newItem.name = e.target.value;
      setData(newItem)

    }

    function handleDetailChange(e) {
      setDetailFocus(false)
      onDetailChange(index, e.target.value)
      var newItem = Object.assign({}, itemData)
      newItem.detail = e.target.value;
      setData(newItem)
    }

    function handleDelete(e) {
      onDelete(index);

    }

    //console.log('item-data:'+itemData.name)


    return <li ref={itemRef} className="mb-0 ml-0 p-1">

      <div className={clsx('columns', 'is-gapless', 'is-mobile', 'mb-1', 'mt-4')}>
        {swapMode && <div className={clsx('column', 'is-auto', 'is-narrow')}>
          <span className={clsx('kandyjar-grey')}><DragHandle /></span>

        </div>}

        <div className={clsx('column', 'is-auto', 'is-narrow', isExpanded ? 'active-item' : false)}>
          <button className={clsx('button', 'is-white')} onClick={handleExpansion}>
            <span className={clsx('kandyjar-grey')}><Icon path={isExpanded ? mdiMinus : mdiPlus} size={1}></Icon></span>
          </button>
        </div>
        <div className={clsx('column', 'is-auto', 'ml-1', 'mr-1','mb-1')}>
          {itemData.type===CONSTANTS.TEXT_TYPE?<input maxLength={CONSTANTS.LIST_ITEM_MAX_LENGTH} className={clsx('input', 'is-hovered', 'entrystyle','thin-border-button')} type="text" value={itemData.name} placeholder="Enter an item" onChange={handleMainInput}></input>:<div className={clsx('p-2')}><a href={itemData.name} target="_blank" rel="noopener noreferrer">{itemData.bookmark?itemData.bookmark:'link'}</a></div>}
          
          <div className={clsx('mt-1','tray', isExpanded ? 'tray-max' : 'tray-min')}>
            <textarea maxLength={CONSTANTS.LIST_ITEM_DETAIL_MAX_LENGTH} className={clsx('textarea','mt-2', 'entrystyle','ghost','has-background-lighter')} rows={3} autoFocus={isExpanded} type="text" defaultValue={''} value={itemData.detail} onChange={handleDetailChange} placeholder="Add details" />
          </div>
        </div>
        {deleteMode&&<div className={clsx('column', 'is-1', 'is-narrow', isExpanded ? 'active-item' : false)}>
          <button className={clsx('button', 'is-white')} onClick={handleDelete}>
            <span className='kandyjar-grey'><Icon path={mdiDelete} size={1}></Icon></span>
          </button>
        </div>}
      </div>




    </li>
  }



  function onSortEnd({ oldIndex, newIndex }) {

    setList(arrayMove(list, oldIndex, newIndex));
  }




  const SortableContainer = sortableContainer(({ children }) => {
    return <ul>{children}</ul>;
  });

  const SortableElement = sortableElement(({ value, index, operationIndex }) => {

    return <ExpandableListItem item={value} index={operationIndex} onItemChange={onItemChange} onDetailChange={onDetailChange} onDelete={onDeleteItem} />
  })


  function closeDialog() {
    setTitleValidation(false)
  }

//console.log(runningNumber+'--')
  return (
    <div>
      <Head>
        <title>HopSquare</title>
        <link rel="icon" href="/tinylogo.png" />
      </Head>
      {/* <SimpleAlert isVisible={titleValidation} message={'Enter a title to save the list.'} onCancel={closeDialog} onConfirm={closeDialog} onClose={closeDialog} /> */}
      <Alert isVisible={titleValidation} message={'Enter a title to post the list'} onCancel={closeDialog}/>
      <div>
        <div>


          <div className="columns">
            <div className="column is-one-fifth">

            </div>
            <ConfirmationDialog isVisible={discarding} message={'Discard changes and exit?'} onCancel={() => { setDiscarding(false) }} onConfirm={() => { router.replace('/') }} />
            <Popup status={requestStatus.status} onClose={() => { setRequestStatus({ isVisible: false }) }} isVisible={requestStatus.isVisible} message={requestStatus.message} />

            <div className="column is-auto">

              <div className="card p-0 is-shadowless mb-0.5 pt-2">

                <nav class="level has-background-white mt-1 pr-2 is-mobile">
                  <div className="level-left">
                  <div className='level-item'>
                  <DropDownMenu list={categories} trigger={DropDownMenuTrigger} onSelectItem={(index) => { setSelectedCategory(categories[index].name) }} />
                  <button className={clsx('is-white','is-rounded','button',swapMode ? 'has-background-info' : '')} onClick={toggleSwap}>
                    <span className={clsx(swapMode ? 'has-text-white' : 'has-text-grey')}><Icon path={mdiSwapVertical} size={1}></Icon></span>
                  </button>
                </div>
                <button className={clsx('is-white','is-rounded','button',deleteMode ? 'has-background-info' : '')} onClick={toggleDelete}>
                    <span className={clsx(deleteMode ? 'has-text-white' : 'has-text-grey')}><Icon path={mdiDelete} size={1}></Icon></span>
                  </button>
                  
                  </div>
                  <div class="level-item has-text-centered pl-5">
                    <div>

                    </div>

                  </div>
                  <div className='level-right'>
                    <div class="level-item pl-5">
                      <div>

                        <div className={clsx('buttons')}>
                          <div>
                           <a onClick={handleCancel} className={clsx('button', 'is-white','is-rounded','has-text-grey')}>
                           <span className={clsx('kandyjar-grey')}><Icon path={mdiClose} size={1}></Icon></span>
                            </a>
                          </div>
                          <div >
                            <a onClick={handleSave} className={clsx('button', 'is-white','is-rounded','grey-dot')}>
                              <span className={clsx('kandyjar-grey')}> <Icon path={mdiCheck} size={1}></Icon></span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </nav>
                { <div className={clsx('dropdown-divider')}></div> }
                <input maxLength={CONSTANTS.LIST_ITEM_TITLE_MAX_LENGTH} className={clsx('input', 'ghost','title', 'pl-5','is-5', 'entrystyle','has-text-weight-normal')} placeholder="It's a list of..."  onChange={handleTitlechange}></input>
                {/* <TitleInput inputValue={resource.title} onInputChange={handleInputChange}/> */}
                {/* <div
                  <DropDownMenu list={categories} trigger={DropDownMenuTrigger} onSelectItem={(index) => { setSelectedCategory(categories[index].name) }} />
                  <button className={clsx('is-light','is-rounded','button',  swapMode ? 'has-background-info' : '')} onClick={toggleSwap}>
                    <span className={clsx(swapMode ? 'has-text-white' : 'has-text-grey')}><Icon path={mdiSwapVertical} size={1}></Icon></span>
                  </button>
                </div> */}
              </div>
              <div className={clsx('box', 'editlistbackground', 'mb-0', 'is-shadowless', 'has-background-gray')}>
                {isListEmpty() ? <div className={clsx( 'container', 'centeralignment')}>
                  <p className={clsx('mt-6','is-size-6','basic-placeholder','has-text-weight-light','p-4','is-rounded','cloud')}>Lists are fun after adding the first item.<br /><span className={clsx('is-size-7', 'has-text-info')}> Use the text box below.</span></p>
                </div> :
                  <SortableContainer onSortEnd={onSortEnd} useDragHandle>
                    {list.map((value, index) => { ; return <SortableElement key={value.id} index={index} operationIndex={index} value={value}></SortableElement> })}
                    <AlwaysScrollToBottom />
                  </SortableContainer>

                }

              </div>



                <EntryBox/>
              
              {/* <div className={clsx('columns', 'is-gapless', 'is-mobile', 'mt-0.5', 'mb-2')}>

                <div className={clsx('column', 'is-auto', 'box', 'mr-0')}>
                  {list.length > itemLimit ? <div className={clsx('has-background-gray')}><p className={clsx('title', 'has-background-gray', 'tag', 'has-text-info', 'container', 'is-6')}>You have reached the maximum items on a list({itemLimit}).</p></div> :
                    <input maxLength={CONSTANTS.LIST_ITEM_MAX_LENGTH} className={clsx('input', 'mr-0', 'is-large', 'has-text-blue', 'p-2', 'bottom-panel-dimensions')} disabled={list.length > itemLimit} autoFocus type="text" onPaste={(e)=>window.alert(e.clipboardData.getData('text'))} placeholder={`Type your item  press enter.(MAX ${CONSTANTS.LIST_ITEM_MAX_LENGTH})`} value={currentItem} onChange={handleKeyChange} onKeyPress={handleKeyPress}></input>

                  }
                </div>
                <div className={clsx('column', 'ml-0', 'is-1', 'p-1')}>
                  <button className={clsx('button', 'is-info', 'bottom-panel-dimensions', 'is-fullwidth')}
                    onClick={handleEntry}>
                    <span className={clsx('icon')}><Icon path={mdiPlus} size={2}></Icon></span>
                  </button>
                </div>
              </div>

            </div>

            <div className="column is-one-fifth">

            </div>
          </div> */}
           </div>

<div className="column is-one-fifth">

</div>
</div>



        </div>
      </div>

    </div>
  );
}
