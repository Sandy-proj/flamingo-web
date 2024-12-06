import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import { mdiDragVertical, mdiPlus, mdiHeartOutline, mdiMinus, mdiCheckboxBlankOutline, mdiCheck, mdiDotsHorizontal, mdiDownloadOutline, mdiBookMarkerOutline, mdiBookmarkOutline, mdiAccount, mdiDotsVertical, mdiBackburger, mdiHamburger, mdiMenu, mdiClose, mdiHeart, mdiDownload, mdiBookmark, mdiDelete, mdiArrowUp, mdiArrowDown, mdiChevronUp, mdiChevronDoubleDown, mdiChevronDown, mdiLink } from '@mdi/js'
import { Icon } from '@mdi/react'
import axios from 'axios'
import clsx from 'clsx';
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { AuthorizationContext } from '../Util/AuthContext'
import DropDownMenu from './DropDownMenu'
import LinkCard from './LinkCard'
import { CONSTANTS } from './../Util/Constants'
import ConfirmationDialog from './ConfirmationDialog'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommentBox from './CommentBox'

export default function UseSquare({ resourceId, resource, onEdit, activity, isEditable, onDownload, onGetList }) {

  var downloadUrl = '/hopsapi/resources/resource/download'
  var updateActionsUrl = '/hopsapi/resources/resource/actionupdate?'
  var deleteUrl = '/hopsapi/resources/resource/delete'
  const [mainMenu, setMainMenu] = useState([])
  let itemList = [];
  if (resource.data) {
    itemList = resource.data ? resource.data.resource : []
    // gconsole.log('resource')
    //console.log(list)
  }

  let menu = [{ id: 1, name: CONSTANTS.ACTION_MENU.EDIT, owner: true },
  { id: 2, name: CONSTANTS.ACTION_MENU.DOWNLOAD, isOwner: false },
  { id: 3, name: CONSTANTS.ACTION_MENU.BOOKMARK, isOwner: false },
  { id: 4, name: CONSTANTS.ACTION_MENU.LIKE, isOwner: false },
  { id: 5, name: CONSTANTS.ACTION_MENU.DELETE, isOwner: true },
  { id: 6, name: CONSTANTS.ACTION_MENU.CLOSE, isOwner: false }
  ]

  const user = useContext(AuthorizationContext)
  const router = useRouter();
  const actions = useRef({});
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false)
  const [userAction, setUserAction] = useState({ like: false, bookmark: false, download: false });
  const [counters, setCounters] = useState({ views: 0, likes: 0, downloads: 0, bookmarks: 0 })
  const [listAction, setListAction] = useState({});
  const [todoMode, setTodoMode] = useState(true);



  function isUserAuthor() {
    let authorId = 0
    //console.log('owner-user-'+resource.owner_id)
    //console.log(resource)
    if (resource.data && resource.data.author_id) {
      authorId = resource.data.author_id
    }
    if (user.id === authorId) return true;
    return false;
  }
  function isUserOwner() {
    let ownerId = 0
    //console.log('owner-user-'+resource.owner_id)
    //console.log(resource)
    if (resource.data && resource.owner_id) {
      ownerId = resource.owner_id
    }
    if (user.id === ownerId) return true;
    return false;
  }
  function handleEdit(e) {
    if (isUserOwner())
      onEdit()
  }
  function toggleTodo() {
    setTodoMode(!todoMode);
  }
  function notify(message) {
    toast.success(message)
  }
  async function handleClose(e) {
    //e.preventDefault();
    const actions_performed = Object.keys(actions.current).length;
    //console.log(resource)
    //console.log('actions taken:'+actions_performed)
    if (actions_performed == 0) {
      //return ;
    } else {
      try {
        let requestUrl = updateActionsUrl + `?res=${resource.id}`
        const response = await axios.post(requestUrl, { ...actions.current, listactions: listAction }, { timeout: CONSTANTS.REQUEST_TIMEOUT })

      } catch (error) {
        console.error(error)
      }
    }
    router.push('/')
  }

  function handleItemCheck(index, action) {
    actions.current[index] = action;
  }

  function handleLike() {
    //Toggle between like and dislike based on the current state.
    var newAction = Object.assign({}, userAction)
    newAction.like = !userAction.like;
    //console.log('new action:'+newAction)
    actions.current.like = userAction.like ? false : true;
    userAction.like ? counters.likes-- : counters.likes++
    setUserAction(newAction);
  }

  async function handleDownload() {
    if (userAction.download || resource.status === 'PRIVATE')
      return;
    downloadUrl = downloadUrl + `?res=${resource.id}`
    try {
      setDownloading(true)
      const downloadResponse = await axios.get(downloadUrl, { timeout: CONSTANTS.REQUEST_TIMEOUT })


      if (downloadResponse.data.result = CONSTANTS.SUCCESS) {
        actions.current.download = true;
        let requestUrl = updateActionsUrl + `?res=${resource.id}`
        const upDateresponse = await axios.post(requestUrl, { ...actions.current, listactions: listAction }, { timeout: CONSTANTS.REQUEST_TIMEOUT })
        //   setUserAction({like:false,bookmark:false,download:false});
        // actions.current = {};

        //   setDownloading(false)

        //   onDownload(downloadResponse.data.data.id)

        var newAction = Object.assign({}, userAction)
        newAction.download = true;
        counters.downloads++;
        notify("Added to 'Saved Lists'")
        setUserAction(newAction);
        setDownloading(false)
      }
    } catch (error) {
      if (downloading) {
        setDownloading(false)
      }
      //console.error(error)
    }


  }

  function transformLinks(item) {
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return item.replace(urlRegex, function (url) {
      return '<a href="' + url + '">' + url + '</a>';
    })
  }

  function handleBookmark() {
    var newAction = Object.assign({}, userAction)
    newAction.bookmark = !userAction.bookmark;
    actions.current.bookmark = userAction.bookmark ? false : true;
    userAction.bookmark ? counters.bookmarks-- : counters.bookmarks++;
    setUserAction(newAction);
    userAction.bookmark ? notify("Removed from 'Bookmarked'") : notify("Added to 'Bookmarked'");
  }

  async function handleDialogCofirm() {

    if (!isUserOwner())
      return;
    setDeleting(true)
    try {
      const deleteResponse = await axios.delete(deleteUrl + `?res=${resource.id}`, { timeout: CONSTANTS.REQUEST_TIMEOUT })

      if (response.status != CONSTANTS.SUCCESS) {

      }
    } catch (error) {

    } finally {
      setDeleting(false)
      router.replace('/')
    }

  }


  function handleDialogCancel() {
    setDeleting(false)
  }

  function handleMenuItemSelection(index) {
    if (mainMenu[index].name === CONSTANTS.ACTION_MENU.EDIT) {
      if (isUserOwner())
        handleEdit();
    } else if (mainMenu[index].name === CONSTANTS.ACTION_MENU.DOWNLOAD) {
      handleDownload();
    } else if (mainMenu[index].name === CONSTANTS.ACTION_MENU.BOOKMARK) {
      handleBookmark();
    } else if (mainMenu[index].name === CONSTANTS.ACTION_MENU.SHOW_NUMBERS) {

    } else if (mainMenu[index].name === CONSTANTS.ACTION_MENU.LIKE) {
      handleLike();
    } else if (mainMenu[index].name === CONSTANTS.ACTION_MENU.REMOVE) {

    } else if (mainMenu[index].name === CONSTANTS.ACTION_MENU.DELETE) {
      setDeleting(true);
    } else if (mainMenu[index].name === CONSTANTS.ACTION_MENU.CLOSE) {
      handleClose();
      //router.replace('/')
    } else {

    }
  }


  function ExpandableListItem({ item, actionable, itemIndex, onItemSelection }) {
    const [isExpanded, setExpanded] = useState(false);
    //const itemId = item.id;
    const [isSelected, setSelected] = useState(listAction[item.id] ? true : false);
    const [itemData, setData] = useState(item)


    function handleExpansion() {
      if (itemData.detail)
        setExpanded(!isExpanded)
    }

    function handleMainInput(e) {
      //setData(e.target.value)
    }

    function handleSelection(e) {

      //Add action to the batch of updates. 
      let newListAction = Object.assign({}, listAction)
      newListAction[item.id] = !isSelected
      setListAction(newListAction)
      //onItemSelection()
      setSelected(!isSelected)
    }


    function handleDetailChange(e) {

    }




    actions.current.view = true;
    //console.log('90900');
    //console.log(resource)

    return <li className="mb-0 ml-0 p-1">

      <div className={clsx('columns', 'is-gapless', 'is-mobile', 'mb-1', 'mt-4')}>
        {actionable && todoMode ? <div className={clsx('column', 'is-narrow', isSelected ? 'active-item' : false)}>
          <button className={clsx('button', 'is-white')} onClick={handleSelection}>
            <span className='icon'><Icon color={isSelected ? '#00f' : '#CCC'} path={isSelected ? mdiCheck : mdiCheckboxBlankOutline} size={1}></Icon></span>
          </button>
        </div> : <div></div>}


        <div className={clsx('column', 'is-11', 'ml-1', 'mr-1')}>

          <div className={clsx(itemData.type === CONSTANTS.TEXT_TYPE ? 'input' : false, 'is-hovered', 'entrystyle')} type="text" value={itemData.name} placeholder="Enter an item" onChange={handleMainInput}>
            {itemData.type === CONSTANTS.LINK_TYPE ?
              // <a href={itemData.name} target="_blank" rel="noopener noreferrer">{itemData.bookmark?itemData.bookmark:'link'}</a>
              // <RNUrlPreview text={itemData.name}/>:
              <LinkCard url={itemData.name} label={itemData.bookmark}></LinkCard> :
              itemData.name}
          </div>
          <div className={clsx('tray', isExpanded ? 'tray-max' : 'tray-min')}>
            <div className={clsx('column', 'is-auto', isExpanded ? 'active-item' : false)}>
              <textarea className={clsx('textarea', 'entrystyle', 'has-text-grey', 'text-area-with-background')} rows={3} type="text" defaultValue={''} onChange={handleDetailChange} value={itemData.detail} placeholder="Add details" />

            </div>
          </div>
        </div>
        {
          itemData.detail && <div className={clsx('column', 'is-auto', isExpanded ? 'active-item' : false)}>
            <button className={clsx('button', 'is-white')} onClick={handleExpansion}>
              <span className='icon'><Icon path={isExpanded ? mdiChevronUp : mdiChevronDown} size={1}></Icon></span>
            </button>
          </div>
        }

      </div>





    </li>
  }


  function EditButton() {
    if (!user.isLoggedIn) {
      return null;
    }

    if (!isEditable) {
      return null;
    }

    return (
      <div>
        <button className={clsx('button')} onClick={handleEdit}>Edit</button>
      </div>
    );
  }


  function Modal({ activate }) {

    return <div className={clsx('modal', 'is-clipped', activate ? 'is-active' : '')}>
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">In progress..</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body">
          downloading
          <progress class="progress is-small is-primary" max="100"></progress>
        </section>

      </div>
    </div>
  }
  //Read the user activity from the server and set the internal state. 
  useEffect(() => {
    if (activity) {
      setUserAction(activity)
    }
    if (activity && activity.listactions) {
      setListAction(activity.listactions)
    }
  }, [activity]);
  //[activity.like,activity.bookmark,activity.download,activity.listactions])


  useEffect(() => {
    var counterObject = { likes: 0, bookmarks: 0, downloads: 0 }
    if (resource) {
      counterObject['likes'] = resource.likes ? resource.likes : 0;
      counterObject['bookmarks'] = resource.bookmarks ? resource.bookmarks : 0;
      counterObject['downloads'] = resource.downloads ? resource.downloads : 0;
    }
    if (resource.status === 'PRIVATE') {
      setMainMenu([
        { id: 1, name: CONSTANTS.ACTION_MENU.EDIT, owner: true },
        { id: 2, name: CONSTANTS.ACTION_MENU.DELETE, isOwner: true },
        { id: 3, name: CONSTANTS.ACTION_MENU.CLOSE, isOwner: false }
      ])
    } else if (isUserAuthor()) {
      setMainMenu([{ id: 1, name: CONSTANTS.ACTION_MENU.EDIT, owner: true },
      { id: 2, name: CONSTANTS.ACTION_MENU.DOWNLOAD, isOwner: false },
      { id: 3, name: CONSTANTS.ACTION_MENU.BOOKMARK, isOwner: false },
      { id: 4, name: CONSTANTS.ACTION_MENU.LIKE, isOwner: false },
      { id: 5, name: CONSTANTS.ACTION_MENU.DELETE, isOwner: true },
      { id: 6, name: CONSTANTS.ACTION_MENU.CLOSE, isOwner: false }
      ])
    } else {

      setMainMenu([
        { id: 1, name: CONSTANTS.ACTION_MENU.DOWNLOAD, isOwner: false },
        { id: 2, name: CONSTANTS.ACTION_MENU.BOOKMARK, isOwner: false },
        { id: 3, name: CONSTANTS.ACTION_MENU.LIKE, isOwner: false },
        { id: 4, name: CONSTANTS.ACTION_MENU.CLOSE, isOwner: false }
      ])
    }
    setCounters(counterObject)
  }, [resource])




  return (
    <div className={clsx('mb-0')}>
      <Head>
        <title>TrypSmart</title>
        <link rel="icon" href="/tinylogo.png" />

      </Head>

      <div>
        <Modal activate={downloading} />
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
        <ConfirmationDialog message={"Are you sure you want to delete this list?"} isVisible={deleting} onCancel={handleDialogCancel} onConfirm={handleDialogCofirm} />

        <div className={clsx('columns')}>
          <div className="column is-one-fifth">


          </div>
          <div className={clsx('column', 'box', 'is-auto', 'is-shadowless', 'mt-2', 'mb-1')}>

            {resource.status !== 'PRIVATE' ? <nav class="columns is-mobile">
              {/* <div class='columns is-mobile'> */}
              <div className={clsx('column', 'is-narrow')}>
                <DropDownMenu list={mainMenu} isAuthor={isUserAuthor()} isOwner={isUserOwner()} onSelectItem={handleMenuItemSelection} />
              </div>
              <div class="column is-auto is-narrow">

                <button className={clsx('button', 'is-white', userAction.like ? 'has-text-danger' : 'has-text-grey')} onClick={handleLike}>
                  <span className={clsx(userAction.like ? 'has-text-danger' : 'has-text-grey')}><Icon path={userAction.like ? mdiHeart : mdiHeartOutline} size={0.5}></Icon></span>
                  <span className="label is-size-65 has-text-grey has-text-weight-normal">{counters.likes}</span>
                </button>
              </div>
              <div class="column is-auto is-narrow">

                <button className={clsx('button', 'is-white', userAction.download ? 'has-text-link' : 'has-text-grey')} onClick={handleDownload}>
                  <span className={clsx(userAction.download ? 'has-text-info' : 'has-text-grey')}><Icon path={userAction.download || resource.status === 'PRIVATE' ? mdiDownload : mdiDownloadOutline} size={0.5}></Icon></span>
                  <span className="label is-size-65 has-text-grey has-text-weight-normal">{counters.downloads}</span>
                </button>

              </div>
              <div class="column is-auto is-narrow">

                <button className={clsx('button', 'is-white', userAction.bookmark ? 'has-text-success' : 'has-text-grey')} onClick={handleBookmark}>
                  <span className={clsx(userAction.bookmark ? 'has-text-success' : 'has-text-grey')}><Icon path={userAction.bookmark ? mdiBookmark : mdiBookmarkOutline} size={0.5}></Icon></span>
                  <span className="label is-size-65 has-text-grey has-text-weight-normal">{counters.bookmarks}</span>
                </button>
              </div>
              <div className={clsx('column', 'is-auto')}></div>
              <div className={clsx('column', 'is-narrow')}>
                <button className={clsx('button', 'is-white')} onClick={handleClose}><Icon path={mdiClose} size={1}></Icon></button>
              </div>
              {/* </div> */}
            </nav> : <nav className={clsx('columns', 'is-mobile')}>
              <div className={clsx('column', 'is-narrow')}>
                <DropDownMenu list={mainMenu} isAuthor={isUserAuthor()} isOwner={isUserOwner()} onSelectItem={handleMenuItemSelection} />
              </div>
              <div className={clsx('column', 'is-narrow')}>
                <button className={clsx('is-white', 'is-rounded', 'button', todoMode ? 'has-background-info' : '')} onClick={toggleTodo}>
                  <span className={clsx(todoMode ? 'has-text-white' : 'has-text-grey')}><Icon color={todoMode ? '#fff' : '#00f'} path={mdiCheck} size={1}></Icon></span>
                </button>
              </div>
              <div className={clsx('column', 'is-auto')}></div>
              <div className={clsx('column', 'is-narrow')}>
                <button className={clsx('button', 'is-white')} onClick={handleClose}><Icon path={mdiClose} size={1}></Icon></button>
              </div>
            </nav>}
            <div className={clsx('columns','is-mobile')}>
              <div class="column is-auto is-narrow" />
              <div className={clsx('column', 'is-auto')}>
                <div className="is-title has-text-grey is-5"><span className="title is-5">{resource.data && resource.data.title}</span>
                  <p className='has-text-grey has-font-weight-light is-6'>{resource.status === 'PRIVATE' ? '' : resource.data && resource.data.author_name}</p></div>
              </div>

            </div>






            <ul className={clsx('p-2', 'listbox')}>
              {itemList.map((item, index) => { return <ExpandableListItem item={item} itemIndex={index} onItemSelection={handleItemCheck} actionable={resource.status === 'PRIVATE'} /> })}
            </ul>

          </div>
          <div className="column has-text-centered is-one-fifth">
          </div>

        </div>

      </div>
    </div>
  );


}