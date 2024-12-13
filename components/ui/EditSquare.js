import Head from 'next/head'
import Link from 'next/link'
import { startTransition, useContext, useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import BaseLayout from '../../components/ui/BaseLayout'
import { mdiDragVertical, mdiPlus, mdiMinus, mdiHeart, mdiBookmark, mdiSwapVertical, mdiBookmarkOutline, mdiHeartOutline, mdiClose, mdiMinuss, mdiArrowDown, mdiMenuDown, mdiCheck, mdiCancel, mdiMenuUp, mdiDelete, mdiDownload, mdiFloppy } from '@mdi/js'
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
import LoginSuggestion from './LoginSuggestion'
import LinkCard from './LinkCard'
import SmartPicker from './SmartPicker'
import pdfmake from 'pdfmake/build/pdfmake';
import { vfs } from '../Util/vfs';
import { mdiLightbulbOnOutline } from '@mdi/js';
import { mdiLightbulbOn } from '@mdi/js';
import { ToastContainer, toast } from 'react-toastify';
pdfmake.vfs = vfs;

export default function EditSquare({ resourceId, resource, onSave, onError }) {
  //const [list, setList] = useState([]);
  const list = useRef([])
  const runningNumber = useRef(1);
  //const [runningNumber, setRunningNumber] = useState(0);
  const [currentItem, setCurrentItem] = useState('')
  const [categories, setCategories] = useState([])
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Interesting');
  const [resourceTitle, setResourceTitle] = useState('')
  const [swapMode, setSwapMode] = useState(true);
  const [deleteMode, setDeleteMode] = useState(true);
  const [pickerMode, setPickerMode] = useState(true);
  const [discarding, setDiscarding] = useState(false);
  const [renderTrigger, setRenderTrigger] = useState(false);
  const [titleValidation, setTitleValidation] = useState(false);
  const [requestStatus, setRequestStatus] = useState({ status: CONSTANTS.messageTypes.HIDDEN, message: '', error: false, isVisible: false })
  const [loginSuggestion, setLoginSuggestion] = useState(false)
  const [smartPickerStatus, setSmartPickerStatus] = useState(false)
  const router = useRouter();
  const user = useContext(AuthorizationContext)
  const categoriesUrl = '/hopsapi/resources/categories'
  const addResourcesUrl = '/hopsapi/resources/resource/add'
  const updateUrl = '/hopsapi/resources/resource/update'
  const addDownloadsUrl = '/hopsapi/resources/downloads/add'
  const inputLengthLimit = 150;
  const inputTypes = [{ id: 1, name: 'Text' }, { id: 2, name: 'Link' }]
  const itemLimit = CONSTANTS.LIST_ITEM_LIMIT;
  const titleRef = useRef('');
  const focusRef = useRef(false);
  const selectedIdList = useRef([]);
  const standardItemMap = useRef(new Map())


  function handleCancel() {
    setDiscarding(true);
  }


  function toggleSwap() {
    setSwapMode(!swapMode);
  }
  function toggleDelete() {
    setDeleteMode(!deleteMode);
  }
  function togglePick() {
    //Populated the selected list.
    selectedIdList.current = []
    console.log(list.current)
    list.current.forEach((item) => {
      console.log(item)
      if (item.suggestionId) {
        if (!selectedIdList.current.includes(item.suggestionId)) {
          let temp = selectedIdList.current.slice();
          temp.push(item.suggestionId)
          selectedIdList.current = temp;
        }
      }
    })
    setPickerMode(!pickerMode);
  }
  function handleKeyChange(e) {
    setCurrentItem(e.target.value)
  }

  function handleTitleKeyChange(e) {
    titleRef.current = e.target.value;
  }

  function handleTitlechange(e) {
    //setResourceTitle(e.target.value)
    titleRef.current = e.target.value;
  }

  function onDeleteItem(index) {

    list.current.splice(index, 1)
    setRenderTrigger(!renderTrigger);
  }

  function getNewItemId() {
    // //Return the maximum running id  + 1;
    // var newId = list.reduce((maxId, item) => Math.max(maxId, item.id), 0);
    // //console.log(newId+1)
    // return newId + 1;
    //setRunningNumber(runningNumber + 1)
    runningNumber.current = runningNumber.current + 1;
    return runningNumber.current;
  }

  function onItemChange(index, value) {
    list.current[index].name = value;
  }

  function onDetailChange(index, value) {
    list.current[index].detail = value;
  }
  function onPickOk() {
    addOrDeleteStandardItems();
    setPickerMode(false);
    //
  }
  function onPickCancel() {
    if (localStorage.getItem('latestlist')) {
      localStorage.removeItem('latestlist')
    }
    setPickerMode(false);
  }
  function onLoginCancel() {
    setLoginSuggestion(false)
  }
  function onLoginOk() {

    localStorage.setItem("latestlist", JSON.stringify(list.current));

    router.replace('/user_login')
  }

  useEffect(() => {
    if (resource.id === -1)
      return;
    if (resource && resource.data && resource.data.resource)

      var newId = resource.data.resource.reduce((maxId, item) => Math.max(maxId, item.id), 0);
    //console.log(newId+1)
    // setRunningNumber(newId);
    runningNumber.current = newId;
  }, [resource])

  useEffect(async () => {
    //console.log(user.handshakeInProgress)
    if (refreshFlag && !user.handshakeInProgress) {
      //console.log('refreshing')
      setRefreshFlag(false);
      handleSave();
    }
  }, [user.handshakeInProgress])




  async function handleSave() {

    //Save the list on the server.
    //e.preventDefault();

    if (!user.isLoggedIn) {
      setLoginSuggestion(true);
      return;
    }

    //Do not process if a 'save' is in progress.
    if (requestStatus.status === CONSTANTS.messageTypes.PROGRESS) {
      return;
    }
    //Do not proceed if the title is empty.
    if (titleRef && titleRef.current.length === 0) {

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
        resp = await axios.post(updateUrl, { resource: list.current, category: selectedCategory, title: titleRef.current, author_id: user.id, author_name: localStorage.getItem(CONSTANTS.HOPS_USERNAME_KEY), resource_id: resource.id, [CONSTANTS.REQUEST_PARAM_KEY]: securityToken }, { timeout: 10000 });
        //console.log(resp)
      } else {
        //console.log('insert request')
        setRequestStatus({ status: CONSTANTS.messageTypes.PROGRESS, message: 'Saving your data', isVisible: true })
        resp = await axios.post(addResourcesUrl, { resource: list.current, category: selectedCategory, title: titleRef.current, author_id: user.id, author_name: localStorage.getItem(CONSTANTS.HOPS_USERNAME_KEY), [CONSTANTS.REQUEST_PARAM_KEY]: securityToken }, { timeout: 10000 });
        //console.log(resp)
      }
      setRequestStatus({ status: CONSTANTS.messageTypes.SUCCESS, message: 'Done', isVisible: true })

      //If the Secure token expires, set the refreshe flag and initiate a handshake(refresh of access). Wait for the effect to trigger this method.
      if (resp.data && resp.data.data && resp.data.data.action === 'REFRESH') {
        //console.log('refreshing')
        setRefreshFlag(true);
        user.initiateHandshake();
        return;

      }
      if (resp && resp.data && resp.data.data)
        onSave(resp.data.data);
    } catch (error) {
      // console.log(error)
      onError(403)

    } finally {
      setRequestStatus({ status: CONSTANTS.messageTypes.HIDDEN, message: 'Updating your data', isVisible: false })

    }
  }

  function DropDownMenuTrigger() {
    return (
      <button className={clsx("button", 'ml-2', 'is-white', 'mr-2', 'is-small')} aria-haspopup="true" aria-controls="dropdown-menu">
        <span className={clsx('has-text-grey-darker')}><strong>{selectedCategory}</strong></span>
        <span class="icon is-small">
          <Icon path={mdiMenuDown} />
        </span>
      </button>
    )
  }

  async function addToDownloads() {
    let resp = null;
    try {
      resp = await axios.post(addDownloadsUrl, { timeout: 10000 })
    } catch (error) {
      // console.log(error)
      onError(403)

    }
  }

  function addOrDeleteStandardItems() {
    standardItemMap.current.values().toArray().forEach((suggestionObject) => {
      const index = list.current.findIndex(item => item.suggestionId && item.suggestionId == suggestionObject.entry.suggestionId);
      if (suggestionObject.action == "ADD") {
        if (index == -1)
          addItem(suggestionObject.entry.name, suggestionObject.entry.type, null, suggestionObject.entry.suggestionId)
      } else {


        if (index != -1) {
          onDeleteItem(index)
        }
      }
    })
    standardItemMap.current.clear();
    setCurrentItem('')
  }


  function addItem(itemString, type, bookmark, suggestionId) {
    const newValue = itemString;
    if (newValue.trim() === '') return;
    var newId = getNewItemId();
    list.current = [...list.current, { id: newId, name: newValue, type: type, bookmark: bookmark, suggestionId: suggestionId }]
    setCurrentItem('')
    setRenderTrigger(!renderTrigger)
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
      if (localStorage.getItem("latestlist")) {
        list.current = JSON.parse(localStorage.getItem("latestlist")).slice()
        selectedIdList.current = []
        console.log("current", list.current[0])
        list.current.forEach((item) => {
          if (item.suggestionId) {
            if (!selectedIdList.current.includes(item.suggestionId)) {
              // let temp = selectedIdList.current.slice();
              // temp.push(item.suggestionId)
              // selectedIdList.current = temp;
              selectedIdList.current = [...selectedIdList, item.suggestionId]
            }
          }
        })
        //localStorage.removeItem("latestlist")
      }
    } catch (error) {
      console.error(error);
    }
  }, [])

  useEffect(() => {
    if (resource.data) {
      if (resource.data.resource) {
        list.current = resource.data.resource;
        list.current.forEach((item) => {
          if (item.suggestionId) {
            if (!selectedIdList.current.includes(item.suggestionId)) {
              // let temp = selectedIdList.current.slice();
              // temp.push(item.suggestionId)
              // selectedIdList.current = temp;
              selectedIdList.current = [...selectedIdList.current, item.suggestionId]
            }
          }
        })
      } else {

        list.current = [];

      }
      // setList(resource.data.resource ? resource.data.resource : []);
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
    if (list.current && list.current.length === 0) {
      return true;
    } else {
      return false;
    }
  }


  function EntryBox() {
    const [isLink, setIsLink] = useState(false);
    const [currentBoxEntry, setCurrentBoxEntry] = useState('')
    const [bookmark, setBookmark] = useState('')
    const [validation, setValidation] = useState(true)
    const [focus, setFocus] = useState(false);

    const inputRef = useRef(null);
    function handleTextKeyPress(e) {
      if (e.key === 'Enter') {
        if (e.target.value.trim() === '') return;
        addItem(e.target.value, isLink ? CONSTANTS.LINK_TYPE : CONSTANTS.TEXT_TYPE)
        focusRef.current = true;
        console.log('set', focusRef.current)
        setFocus(true)
      }
    }
    function validationAcknowledgement(e) {
      setValidation(true)
    }
    function handleLinkKeyPress(e) {
      // if (e.key === 'Enter') {
      //   addItem(e.target.value,isLink?CONSTANTS.LINK_TYPE:CONSTANTS.TEXT_TYPE)

      // }
    }

    function handleTextEntry(e) {
      if (currentBoxEntry.trim() === '') {
        //setValidation(false)
        return;
      }
      if (isLink) {
        //console.log('isvalid'+currentBoxEntry+'-'+isValidUrl(currentBoxEntry))
        if (!isValidUrl(currentBoxEntry)) {
          setValidation(false);
          return;
        }

      }
      addItem(currentBoxEntry, isLink ? CONSTANTS.LINK_TYPE : CONSTANTS.TEXT_TYPE, bookmark ? bookmark : 'Link')
      setFocus(true)
    }

    function handleLinkEntry(e) {
      addItem(currentBoxEntry)
    }

    function DropDownChoice() {
      return (

        <button className={clsx("button", 'ml-2', 'is-white', 'mr-2', 'bottom-panel-dimensions')} aria-haspopup="true" aria-controls="dropdown-menu">
          <span><strong>{isLink ? 'Link' : 'Text'}</strong></span>
          <span class="icon is-small">
            <Icon path={mdiMenuUp} />
          </span>
        </button>

      )
    }

    useEffect(() => {
      console.log('outside', focusRef.current)
      if (focusRef.current == true) {
        focusRef.current = false;
        console.log('effects')
        inputRef.current.focus();
      }
    }, [focus]);

    //console.log('is-link'+isLink)
    return (<div className={clsx('columns', 'is-gapless', 'is-mobile', 'mb-0')}>
      <Alert isVisible={!validation} message={'The link is not supported.'} onCancel={validationAcknowledgement} />
      <LoginSuggestion visible={loginSuggestion} onOk={onLoginOk} onCancel={onLoginCancel} />
      <SmartPicker visible={pickerMode} onOk={onPickOk} onCancel={onPickCancel} selectedIds={selectedIdList} pickDto={standardItemMap.current} />
      <div className={clsx('column', 'is-narrow', 'has-background-white')}>
        {/* 
        <DropDownMenu up={true} list={inputTypes} trigger={DropDownChoice} onSelectItem={(index) => { setIsLink(inputTypes[index].name === 'Link' ? true : false) }} /> */}

      </div>
      {
        isLink ? <div className={clsx('column', 'is-auto', 'box', 'is-radiusless', 'mr-0')}>
          {list.current.length > itemLimit ? <div className={clsx('has-background-gray')}><p className={clsx('title', 'has-background-gray', 'tag', 'has-text-info', 'container', 'is-6')}>You have reached the maximum items on a list({itemLimit}).</p></div> :
            <div>
              <input key={1} maxLength={CONSTANTS.LIST_ITEM_MAX_LENGTH} className={clsx('input', 'mr-0', 'p-2', 'thin-border-button', 'ghost', 'entrystyle', 'is-small', 'bottom-panel-small-dimensions')} disabled={list.current.length > itemLimit} type="text" onPaste={(e) => { }} placeholder={`Paste your url.`} value={currentBoxEntry} onChange={e => setCurrentBoxEntry(e.target.value)}></input>
              <input key={2} maxLength={CONSTANTS.LIST_ITEM_MAX_LENGTH} className={clsx('input', 'mr-0', 'p-2', 'thin-border-button', 'ghost', 'is-small', 'entrystyle', 'bottom-panel-small-dimensions')} disabled={list.current.length > itemLimit} type="text" onPaste={(e) => { }} placeholder={`Add label`} value={bookmark} onChange={e => setBookmark(e.target.value)}></input>

            </div>
          }
        </div> : <div className={clsx('column', 'is-auto', 'box', 'mr-0')}>

          {list.current.length > itemLimit ? <div className={clsx('has-background-gray')}>

            <span>
              <p className={clsx('title', 'has-background-gray', 'tag', 'has-text-info', 'container', 'is-6')}>You have reached the maximum items on a list({itemLimit}).</p>
            </span>
          </div> : <div>

            <span><input ref={inputRef} maxLength={CONSTANTS.LIST_ITEM_MAX_LENGTH} className={clsx('input', 'mr-0', 'has-text-blue', 'p-2', 'thin-border-button', 'ghost', 'bottom-panel-dimensions')} disabled={list.current.length > itemLimit} type="text" onPaste={(e) => window.alert(e.clipboardData.getData('text'))} placeholder={`Enter your list item & press enter.`} value={currentBoxEntry} onChange={e => setCurrentBoxEntry(e.target.value)} onKeyPress={handleTextKeyPress}></input>
            </span>
          </div>
          }

        </div>
      }
      <div className={clsx('column', 'ml-0', 'is-narrow', 'p-1')}>
        <button className={clsx('button', 'is-large', 'is-link', 'bottom-panel-dimensions', 'is-fullwidth')}
          // ('button', 'bottom-panel-dimensions', 'is-fullwidth')}
          onClick={handleTextEntry}>
          {/* <span className={clsx('icon', 'is-info')}><Icon path={mdiPlus} size={2}></Icon></span> */}
          <span className={clsx('is-size-5', 'has-text-weight-bold')}>Add to list</span>
        </button>
      </div>

    </div>
    )


  }
  function TitleEntry({ initialTitle }) {
    const [titleText, setTitleText] = useState(initialTitle)
    function handleTitleTextEntry(e) {
      titleRef.current = e.target.value;
      setTitleText(e.target.value)
    }

    useEffect(() => {
      if (initialTitle) {
        titleRef.current = initialTitle;
        setTitleText(initialTitle);
      }
    }, [initialTitle])
    return <input maxLength={CONSTANTS.LIST_ITEM_TITLE_MAX_LENGTH} className={clsx('input', 'ghost', 'title', 'pl-5', 'is-5', 'entrystyle', 'has-text-weight-bold')} value={titleRef.current} placeholder="Title here..." onChange={handleTitleTextEntry}></input>

  }
  function ExpandableListItem({ item, index, onDelete, onItemChange, onDetailChange }) {
    const [isExpanded, setExpanded] = useState(false);
    const [itemData, setData] = useState(item)
    const itemRef = useRef();
    const [detailFocus, setDetailFocus] = useState(false)

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



    return <li ref={itemRef} className="mb-0 ml-0 p-1">

      <div className={clsx('columns', 'is-gapless', 'is-mobile', 'mb-1', 'mt-4')}>
        {swapMode && <div className={clsx('column', 'is-auto', 'is-narrow')}>
          <span className={clsx('kandyjar-grey')}><DragHandle /></span>

        </div>}

        {/* {itemData.type !== CONSTANTS.LINK_TYPE && <div className={clsx('column', 'is-auto', 'is-narrow', isExpanded ? 'active-item' : false)}>
          <button className={clsx('button', 'is-white')} onClick={handleExpansion}>
            <span className={clsx('kandyjar-grey')}><Icon path={isExpanded ? mdiMinus : mdiPlus} size={1}></Icon></span>
          </button>
        </div>} */}
        <div className={clsx('column', 'is-auto', 'ml-1', 'mr-1', 'mb-1')}>
          {itemData.type === CONSTANTS.LINK_TYPE ? <LinkCard url={itemData.name} label={itemData.bookmark}></LinkCard> :
            <input maxLength={CONSTANTS.LIST_ITEM_MAX_LENGTH} className={clsx('input', 'is-hovered', 'entrystyle', 'thin-border-button')} type="text" value={itemData.name} placeholder="Enter an item" onChange={handleMainInput}></input>}

          <div className={clsx('mt-1', 'tray', isExpanded ? 'tray-max' : 'tray-min')}>
            <textarea maxLength={CONSTANTS.LIST_ITEM_DETAIL_MAX_LENGTH} className={clsx('textarea', 'mt-2', 'entrystyle', 'ghost', 'has-background-lighter')} rows={3} autoFocus={isExpanded} type="text" defaultValue={''} value={itemData.detail} onChange={handleDetailChange} placeholder="Add details" />
          </div>
        </div>
        {deleteMode && <div className={clsx('column', 'is-1', 'is-narrow', isExpanded ? 'active-item' : false)}>
          <button className={clsx('button', 'is-white')} onClick={handleDelete}>
            <span className='kandyjar-grey'><Icon path={mdiClose} size={1}></Icon></span>
          </button>
        </div>}
      </div>




    </li>
  }



  function onSortEnd({ oldIndex, newIndex }) {
    list.current = arrayMove(list.current
      , oldIndex, newIndex)
    setRenderTrigger(!renderTrigger)
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

  //console.log('item-data:'+itemData.name)
  function printDocument() {
    let docDefinition = {
      content: [
        { text: titleRef.current ? titleRef.current : 'Travel checklist', style: 'header' },
        {

          // to treat a paragraph as a bulleted list, set an array of items under the ul key
          // ul:[list.map((item) => { return [{image:'checked',height:10,width:10, style:'anotherStyle'},{text:item.name,style:'anotherStyle'}]; })]
          ol: list.current.map((item) => {
            return {
              columns: [
                {
                  image: 'unchecked',
                  height: 12,
                  width: 12,
                  margin: [0, 10, 5, 0]
                },
                {
                  stack: [
                    {
                      columns: [
                        {
                          text: item.name,
                          margin: [5, 10, 5, 10]
                        },
                      ],
                    },
                  ]
                },
              ]
            }
          }), type: 'none'
          //ul:[{text:'test'}]
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [10, 10]
        },
        anotherStyle: {
          fontSize: 15,
          color: '#454545',
          margin: [10, 10]
        }
      },
      images: {
        checked:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAQAAACROWYpAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAF+2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMTItMzBUMDE6Mzc6MjArMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTEyLTMwVDAxOjM4OjI4KzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTEyLTMwVDAxOjM4OjI4KzAxOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMSIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9IkRvdCBHYWluIDIwJSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowNzVjYjZmMy1jNGIxLTRiZjctYWMyOS03YzUxMWY5MWJjYzQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5ZTM1YTc3ZC0zNDM0LTI5NGQtYmEwOC1iY2I5MjYyMjBiOGIiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDowYzc2MDY3Ny0xNDcwLTRlZDUtOGU4ZS1kNTdjODJlZDk1Y2UiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjBjNzYwNjc3LTE0NzAtNGVkNS04ZThlLWQ1N2M4MmVkOTVjZSIgc3RFdnQ6d2hlbj0iMjAxOS0xMi0zMFQwMTozNzoyMCswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjA3NWNiNmYzLWM0YjEtNGJmNy1hYzI5LTdjNTExZjkxYmNjNCIgc3RFdnQ6d2hlbj0iMjAxOS0xMi0zMFQwMTozODoyOCswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+jHsR7AAAAUNJREFUOMvN1T9Lw0AYx/EviLVFxFH8M3USgyAFoUsQ0UV8F6Ui4qCTbuJg34HgptBdUATrUoxiqYMgiOBoIcW9BVED+jgkntGm9i6CmN+Sg/vAcc89dwBd5Clzj6uZGg7LJAC62UFipEgKcmroaeZj/gpcIAhl5rE1M0cJQbiCOsIrs5h8WZ4R6j72yBrhcRo+dhE8bCOcoYng/hFOMxAXb/DAHTNxcCGo7JE5LqhjsW2KP6nDcGecCv1vRdC2eJQDLllooach2hbvIghvLJJgM0QHdeq8F0x/5ETRM4b0DonF7be+Pf+y4A4bZnETok4E/XG3xxR3WhasUWeLCg2OGYnXGP1MkPwnLRmJf3UN+RfgtBGe5MnHVQShxBQZzdgcIgjXsKSu/KZmXgKxBkmKsZ6bffoAelilQs3goauyTi+8A8mhgeQlxdNWAAAAAElFTkSuQmCC',
        unchecked:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAQAAACROWYpAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAF+2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMTItMzBUMDE6Mzc6MjArMDE6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTEyLTMwVDAxOjM4OjU3KzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTEyLTMwVDAxOjM4OjU3KzAxOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMSIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9IkRvdCBHYWluIDIwJSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpjMGUyMmJhZC1lY2VkLTQzZWUtYjIzZC1jNDZjOTNiM2UzNWMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5M2FhOTEzYy1hZDVmLWZmNGEtOWE5Ny1kMmUwZjdmYzFlYmUiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozYmY2ODFlMy1hMTRhLTQyODMtOGIxNi0zNjQ4M2E2YmZlNjYiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjNiZjY4MWUzLWExNGEtNDI4My04YjE2LTM2NDgzYTZiZmU2NiIgc3RFdnQ6d2hlbj0iMjAxOS0xMi0zMFQwMTozNzoyMCswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmMwZTIyYmFkLWVjZWQtNDNlZS1iMjNkLWM0NmM5M2IzZTM1YyIgc3RFdnQ6d2hlbj0iMjAxOS0xMi0zMFQwMTozODo1NyswMTowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+6AB6cQAAAPxJREFUOMvF1b1Kw1AYBuAnFf8QL8WlIHQJIriIdyEu4qCTXop7dwenTgUHpYvgJVhob8AuakE+h9hapJqcFDXvFDgPIXlzvgNLjnQ9GlRM340TK7DsUtRI2zqH09txxUzWn3IrhK4DecXs6wjhnqHwZk/K1fIiDAs81krCW54KPBDG8iTcNBIGf4ND1MWTdmrgqIOL5TM0S8SRhmMu1dAo+2DZ57t9eWajtKrvN1GVnrMK9HewhbBy+nPPJbTsJwmymOn8P7fkfLzQGCoG4G4S3vZc4J4QOnY0KyZ3LYQHjqcjf1Qxrx/inDXtWsfNlU1YdeZOP+Gg67mwwTvIDqR1iAowgQAAAABJRU5ErkJggg==',
      },

    };
    pdfMake.createPdf(docDefinition).download();
    addToDownloads();
  }

  //console.log(runningNumber+'--')
  return (
    <div>
      <Head>
        <title>TrypSmart</title>
        <link rel="icon" href="/tinylogo.png" />
      </Head>
      {/* <SimpleAlert isVisible={titleValidation} message={'Enter a title to save the list.'} onCancel={closeDialog} onConfirm={closeDialog} onClose={closeDialog} /> */}
      <Alert isVisible={titleValidation} message={'Enter a title to post the list'} onCancel={closeDialog} />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover />
      <div className={clsx('trypsmart-background')}>
        <div>


          <div className="columns">
            <div className="column is-one-fifth is-radiusless">

            </div>
            <ConfirmationDialog isVisible={discarding} message={'Discard changes and exit?'} onCancel={() => { setDiscarding(false) }} onConfirm={() => { localStorage.removeItem('latestlist'); router.replace('/') }} />
            <Popup status={requestStatus.status} onClose={() => { setRequestStatus({ isVisible: false }) }} isVisible={requestStatus.isVisible} message={requestStatus.message} />

            <div className="column is-auto is-radiusless">

              <div className={clsx('card', 'p-0', 'is-shadowless', 'has-background-link', 'mb-0.5', 'pt-2')}>

                <nav className={clsx('level', 'has-background-link', 'is-mobile', 'header-adjustment')}>
                  <div className="level-left">
                    <div class="ml-2 field has-addons">
                      <p class="control">
                        <button class="button is-warning is-outlined" onClick={togglePick}>
                          <span className={clsx(pickerMode ? 'has-text-white' : 'has-text-white', 'mr-2')}><Icon path={mdiLightbulbOn} size={1}></Icon></span>
                          <span>Suggestions</span>
                        </button>
                      </p>
                      <p class="control">
                        <button class="button is-warning is-outlined" onClick={() => {
                          if (list.current.length > 0) {
                            printDocument();
                          } else {
                            toast.error("The list is empty. Add items to download.")
                          }
                        }}>
                          <span>Download PDF</span>
                        </button>
                      </p>
                      <p class="control">
                        <button class="button is-warning is-outlined" onClick={handleSave}>
                          <span>Save</span>
                        </button>
                      </p>
                    </div>
                    {/* <div className='level-item'>
                      <DropDownMenu list={categories} trigger={DropDownMenuTrigger} onSelectItem={(index) => { setSelectedCategory(categories[index].name) }} />
                      <button className={clsx('is-white', 'is-small', 'button', swapMode ? 'has-background-info' : '')} onClick={toggleSwap}>
                        <span className={clsx(swapMode ? 'has-text-white' : 'has-text-grey')}><Icon path={mdiSwapVertical} size={1}></Icon></span>
                      </button>
                    </div>
                    <button className={clsx('is-white', 'is-small', 'button', deleteMode ? 'has-background-info' : '')} onClick={toggleDelete}>
                      <span className={clsx(deleteMode ? 'has-text-white' : 'has-text-grey')}><Icon path={mdiDelete} size={1}></Icon></span>
                    </button> */}

                    {/* <button className={clsx('is-white', 'is-small', 'button', 'is-rounded', pickerMode ? 'has-background-info' : '')} onClick={togglePick}>
                      <span className={clsx(pickerMode ? 'has-text-white' : 'has-text-danger')}><Icon path={mdiLightbulbOn} size={1}></Icon></span>
                    </button>
                    <button className={clsx('is-white', 'is-small', 'button', 'is-warning', pickerMode ? 'has-background-info' : '')} onClick={printDocument}>
                      Download
                    </button> */}
                  </div>

                  <div className='level-right'>
                    <div class="level-item">
                      <div>

                        <div className={clsx('buttons')}>

                          {/* <div >
                            <a onClick={handleSave} className={clsx('button', 'is-white', 'is-small', 'grey-dot')}>
                              <span className={clsx('kandyjar-grey')}> <Icon path={mdiCheck} size={1}></Icon></span>
                              <span className={clsx('kandyjar-grey', 'has-text-weight-bold', 'has-text-info')}> Save</span>
                            </a>
                          </div> */}

                          <div>
                            <button class="button is-ghost" onClick={handleCancel} >
                              <span className={clsx(pickerMode ? 'has-text-white' : 'has-text-white')} ><Icon path={mdiClose} size={1.5}></Icon></span>
                            </button>
                            {/* <button onClick={handleCancel} className={clsx('button','is-outlined',)}>
                              <span className={clsx('has-text-danger')}><Icon path={mdiClose} size={1}></Icon></span>
                              <span className={clsx('kandyjar-grey', 'has-text-info')}> Cancel</span>
                            </button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </nav>
                {/* {<div className={clsx('dropdown-divider')}></div>} */}
                <TitleEntry initialTitle={resource && resource.data && resource.data.title ? resource.data.title : ''} />

                {/* <input maxLength={CONSTANTS.LIST_ITEM_TITLE_MAX_LENGTH} className={clsx('input', 'ghost', 'title', 'pl-5', 'is-5', 'entrystyle', 'has-text-weight-normal')}  placeholder="It's a list of..."   onChange={handleTitlechange}></input> */}
                {/* <TitleInput inputValue={resource.title} onInputChange={handleInputChange}/> */}
                {/* <div
                  <DropDownMenu list={categories} trigger={DropDownMenuTrigger} onSelectItem={(index) => { setSelectedCategory(categories[index].name) }} />
                  <button className={clsx('is-light','is-rounded','button',  swapMode ? 'has-background-info' : '')} onClick={toggleSwap}>
                    <span className={clsx(swapMode ? 'has-text-white' : 'has-text-grey')}><Icon path={mdiSwapVertical} size={1}></Icon></span>
                  </button>
                </div> */}
              </div>
              <div id="divToPrint" className={clsx('box', 'editlistbackground', 'mb-0', 'is-shadowless', 'has-background-gray')}>
                {isListEmpty() ? <div className={clsx('container', 'centeralignment')}>
                  <p className={clsx('mt-1', 'is-size-6', 'basic-placeholder', 'has-text-weight-light', 'p-4', 'is-rounded', 'cloud')}>Lists can be fun after adding the first item.<br /><span className={clsx('is-size-7', 'has-text-info')}> Use the text box below.</span></p>
                </div> :
                  <SortableContainer onSortEnd={onSortEnd} useDragHandle>
                    {list.current instanceof Array ? list.current.map((value, index) => { ; return <SortableElement key={value.id} index={index} operationIndex={index} value={value}></SortableElement> }) : list}
                    <AlwaysScrollToBottom />
                  </SortableContainer>

                }

              </div>



              <EntryBox />
              <div className = {clsx('columns','mt-0','pl-3','pr-3','is-hidden-desktop')}>
                <nav class="column is-full-width level  has-background-white pl-5">
                  <div class="level-item has-text-centered">
                    <div>
                    <p class="control">
                        <button class="button is-light" onClick={togglePick}>
                          <span className={clsx(pickerMode ? 'has-text-white' : 'has-text-link', 'mr-2')}><Icon path={mdiLightbulbOn} size={1}></Icon></span>
                        </button>
                      </p>
                      <p className={clsx('heading')}>Suggestions</p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                    <p class="control">
                        <button class="button is-light" onClick={() => {
                          if (list.current.length > 0) {
                            printDocument();
                          } else {
                            toast.error("The list is empty. Add items to download.")
                          }
                        }}>
                          <span className={clsx(pickerMode ? 'has-text-white' : 'has-text-link', 'mr-2')}><Icon path={mdiDownload} size={1}></Icon></span>
                          
                        </button>
                      </p>
                      <p className={clsx('heading')}>Download PDF</p>
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                    <p class="control">
                        <button class="button is-light" onClick={handleSave}>
                        <span className={clsx(pickerMode ? 'has-text-white' : 'has-text-link', 'mr-2')}><Icon path={mdiFloppy} size={1}></Icon></span>
                        </button>
                      </p>
                      <p className={clsx('heading')}>Save</p>  
                    </div>
                  </div>
                  <div class="level-item has-text-centered">
                    <div>
                    <p class="control">
                        <button class="button is-light" onClick={handleCancel}>
                        <span className={clsx(pickerMode ? 'has-text-white' : 'has-text-link', 'mr-2')}><Icon path={mdiClose} size={1}></Icon></span>
                        </button>
                      </p>
                      <p className={clsx('heading')}>Close</p>  
                    </div>
                  </div>
                </nav>
              </div>

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
