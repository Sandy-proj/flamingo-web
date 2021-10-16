import Head from 'next/head'
import { useEffect, useRef, useState  } from 'react'
import { mdiDragVertical, mdiPlus,  mdiHeartOutline, mdiMinus, mdiCheckboxBlankOutline, mdiCheck,mdiDotsHorizontal, mdiDownloadOutline, mdiBookMarkerOutline, mdiBookmarkOutline, mdiAccount, mdiDotsVertical, mdiBackburger, mdiHamburger, mdiMenu, mdiClose, mdiHeart, mdiDownload, mdiBookmark, mdiDelete} from '@mdi/js'
import {Icon} from '@mdi/react'
import  axios from 'axios'
import clsx from 'clsx';
import { useRouter } from 'next/router'
import { useContext } from 'react'
import {AuthorizationContext} from '../Util/AuthContext'
import DropDownMenu from './DropDownMenu'
import { CONSTANTS } from './../Util/Constants'
import ConfirmationDialog from './ConfirmationDialog'

export default function UseSquare({resourceId,resource,onEdit,activity,isEditable}) {

    var downloadUrl = '/hopsapi/resources/resource/download'
    var updateActionsUrl = '/hopsapi/resources/resource/actionupdate?'
    var deleteUrl = '/hopsapi/resources/resource/delete'
    let list=[];
    if(resource.data){
      list = resource.data?resource.data.resource:[]
    }
     
    const menu = [{id:1,name:CONSTANTS.ACTION_MENU.EDIT},
                  {id:2,name:CONSTANTS.ACTION_MENU.DOWNLOAD},
                  {id:3,name:CONSTANTS.ACTION_MENU.BOOKMARK},
                  {id:4,name:CONSTANTS.ACTION_MENU.LIKE},
                  {id:5,name:CONSTANTS.ACTION_MENU.DELETE},
                  {id:6,name:CONSTANTS.ACTION_MENU.CLOSE}
                  ]
    const user = useContext(AuthorizationContext)
    const router = useRouter();
    const actions = useRef({});
    const [downloading,setDownloading] = useState(false);
    const [deleting,setDeleting] = useState(false)
    const [userAction,setUserAction] = useState({like:false,bookmark:false,download:false});
    const [counters,setCounters]=useState({views:0,likes:0,downloads:0,bookmarks:0})

    function isUserAuthor(){
      let authorId  = 0
      console.log('owner-user-'+resource.owner_id)
      console.log(resource)
      if(resource.data&&resource.data.author_id){
        authorId = resource.data.author_id
      }
      if(user.id===authorId) return true;
      return false;
    }
    function isUserOwner(){
      let ownerId  = 0
      console.log('owner-user-'+resource.owner_id)
      console.log(resource)
      if(resource.data&&resource.owner_id){
        ownerId = resource.owner_id
      }
      if(user.id===ownerId) return true;
      return false;
    }
    function handleEdit(e){
      if(isUserAuthor())
        onEdit()
    }

    async function handleClose(e){
      e.preventDefault();
      const actions_performed = Object.keys(actions.current).length;
        console.log(resource)
        console.log('actions taken:'+actions_performed)
        if(actions_performed==0){
          //return ;
        }else{
          try{
            let requestUrl = updateActionsUrl+`?res=${resource.id}`
            const response =  await axios.post(requestUrl,actions.current,{timeout:CONSTANTS.REQUEST_TIMEOUT})

          }catch(error){
            console.error(error)
          }
        }
      router.push('/')
    }

    function handleItemCheck(index,action){
      actions.current[index]=action;
    }

    function handleLike(){
      //Toggle between like and dislike based on the current state.
      var newAction = Object.assign({},userAction)
      newAction.like=!userAction.like;
      console.log('new action:'+newAction)
      actions.current.like = userAction.like?false:true;
      userAction.like?counters.likes--:counters.likes++
      setUserAction(newAction);
    }

    async function handleDownload(){
      if(userAction.download||isUserAuthor()||isUserOwner())
      return;
      downloadUrl = downloadUrl+`?res=${resource.id}`
      try{
         setDownloading(true)
         const downloadResponse = await axios.get(downloadUrl,{timeout:CONSTANTS.REQUEST_TIMEOUT})
         if(downloadResponse.data.result=CONSTANTS.SUCCESS){
            var newAction = Object.assign({},userAction)
            newAction.download=true;
            setUserAction(newAction)
            setDownloading(false)
         }
      }catch(error){
        if(downloading){
          setDownloading(false)
        }
        console.error(error)
      }
      

    }


    function handleBookmark(){
      var newAction = Object.assign({},userAction)
      newAction.bookmark=!userAction.bookmark;
      actions.current.bookmark = userAction.bookmark?false:true;
      userAction.bookmark?counters.bookmarks--:counters.bookmarks++;
      console.log('new action:'+newAction)
      setUserAction(newAction);
    }

    async function  handleDialogCofirm(){
      setDeleting(false)

      
      try{
        const deleteResponse = await axios.delete(deleteUrl,{timeout:CONSTANTS.REQUEST_TIMEOUT})
        if(response.status!=CONSTANTS.SUCCESS){
          console.log('error')
        }
      }catch(error){
        console.error(error)
      }
      router.replace('/')
    }

  
    function handleDialogCancel(){
      setDeleting(false)
    }

    function handleMenuItemSelection(index){
      if(menu[index].name===CONSTANTS.ACTION_MENU.EDIT){
        handleEdit();
      }else if(menu[index].name===CONSTANTS.ACTION_MENU.DOWNLOAD){
        handleDownload();
      }else if(menu[index].name===CONSTANTS.ACTION_MENU.BOOKMARK){
        handleBookmark();
      }else if(menu[index].name===CONSTANTS.ACTION_MENU.SHOW_NUMBERS){
        
      }else if(menu[index].name===CONSTANTS.ACTION_MENU.LIKE){
        handleLike();
      }else if(menu[index].name===CONSTANTS.ACTION_MENU.REMOVE){
      
      }else if(menu[index].name===CONSTANTS.ACTION_MENU.DELETE){
        setDeleting(true);
      }else if(menu[index].name===CONSTANTS.ACTION_MENU.CLOSE){
          router.push('/')
      }else{

      }
    }

    function ExpandableListItem({item,actionable,itemIndex,onItemSelection}){
      const [isExpanded,setExpanded]=useState(false);
      const [isSelected,setSelected]=useState(item.actions?(item.actions?item.actions.check:false):false);
      const[itemData,setData]=useState(item)
   
      console.log('item:'+item)
      
      function handleExpansion(){
       setExpanded(!isExpanded)
      }
  
      function handleMainInput(e){
        setData(e.target.value)
      }

      function handleSelection(e){
        
        //Add action to the batch of updates. 
        onItemSelection(itemIndex,{"check":!isSelected})
        setSelected(!isSelected)
      }

  
      console.log('using square - '+user.isLoggedIn)
      actions.current.view = true;
      
      return <li className="mb-0 ml-0 p-1">
        
        <div className={clsx('columns','is-gapless','is-mobile','mb-1','mt-4')}>
        {actionable?  <div className={clsx('column','is-auto',isSelected?'active-item':false)}>
            <button className={clsx('button','is-white')} onClick={handleSelection}>
              <span className='icon'><Icon path={isSelected?mdiCheck:mdiCheckboxBlankOutline} size={1}></Icon></span>
            </button>
          </div>:<div></div>}
      
         
          <div className={clsx('column','is-10','ml-1','mr-1')}>
            <input className={clsx('input','is-hovered','entrystyle')} type="text" value={itemData.name} placeholder="Enter an item" onChange={handleMainInput}></input>
            <div className={clsx('tray',isExpanded?'tray-max':'tray-min')}>
          <input className={clsx('input','entrystyle')} type="text" defaultValue={''} placeholder="Add details"/>
        </div>
          </div>
          <div className={clsx('column','is-auto',isExpanded?'active-item':false)}>
         
          </div>
          <div className={clsx('column','is-auto',isExpanded?'active-item':false)}>
            <button className={clsx('button','is-white')} onClick={handleExpansion}>
              <span className='icon'><Icon path={isExpanded?mdiMinus:mdiDotsHorizontal} size={1}></Icon></span>
            </button>
          </div>
        </div>
                        
  
  
       
      
      </li>
    }


    function EditButton(){
      if(!user.isLoggedIn){
        return null;
      }
      
      if(!isEditable){
        return null;
      }

      return (
        <div>
            <button className={clsx('button')} onClick={handleEdit}>Edit</button>
         </div>
      );
    }


    function Modal({activate}){
      
      return <div className={clsx('modal','is-clipped',activate?'is-active':'')}>
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
    useEffect(()=>{
      console.log('toggling')
      if(activity){
        setUserAction(activity)
      }
    },[activity.like,activity.bookmark,activity.download])


    useEffect(()=>{
      var counterObject={likes:0,bookmarks:0,downloads:0}
      if(resource){
        counterObject['likes']=resource.likes?resource.likes:0;
        counterObject['bookmarks']=resource.bookmarks?resource.bookmarks:0;
        counterObject['downloads']=resource.downloads?resource.downloads:0;
      }
      setCounters(counterObject)
    },[resource])

    useEffect( ()=>{
      //  return async ()=>{
        // var updateActions = {};
        // const actions_performed = Object.keys(actions.current).length;
        // console.log(resource)
        // console.log('actions taken:'+actions_performed)
        // if(actions_performed==0){
        //   return ;
        // }else{
        //   try{
        //     let requestUrl = updateActionsUrl+`?res=${resource.id}`
        //     const response =  axios.post(requestUrl,actions.current,{timeout:CONSTANTS.REQUEST_TIMEOUT})

        //   }catch(error){
        //     console.error(error)
        //   }
        // }
        
      //  }
    },[])

    console.log(resource)
    console.log('user activity:'+activity.like+'-'+activity.bookmark+'-'+activity.download)
    console.log('user-author'+user.id+'-'+resource.authorId)
    console.log('user-ref:'+actions.current.like)
    return (
      <div>
        <Head>
          <title>HopSquare</title>
          <link rel="icon" href="/tinylogo.png" />
  
        </Head>
       
        <div>
        <Modal activate={downloading}/>
        <ConfirmationDialog message={"Are you sure you want to delete this list?"} isVisible={deleting} onCancel={handleDialogCancel} onConfirm={handleDialogCofirm}/>s
          
        <div className={clsx('columns')}>
          <div className="column is-one-fifth">

            
          </div>
          <div className={clsx('column','box','is-auto','mt-5')}>
            <div className={clsx('columns')}>
              <div className={clsx('column','is-narrow')}>
                <DropDownMenu list={menu} onSelectItem={handleMenuItemSelection}/>
              </div>
              <div className={clsx('column','is-auto')}>
                <div className="is-title is-4"><p className="title is-4">{resource.data&&resource.data.title}</p>
                <p className='has-text-grey is-6'>{resource.author}</p></div>
              </div>
              <div className={clsx('column','is-narrow')}>
                <a onClick={handleClose}><Icon path={mdiClose} size={1.5}></Icon></a>
              </div>
            </div>
           
           
            <nav class="level">
             <div class="level-item has-text-centered pl-5">
                <div>
                  <a onClick={handleLike}><p className={clsx(userAction.like?'has-text-danger':'has-text-gray')}><Icon path={userAction.like?mdiHeart:mdiHeartOutline} size={1}></Icon></p></a>
                  <p className="label is-6 has-text-info">{counters.likes}</p>
                </div>
              </div>
              <div class="level-item has-text-centered pl-5">
                <div>
                   <a onClick={handleDownload}><p class={clsx(userAction.download?'has-text-link':'has-text-gray')}><Icon path={userAction.download||isUserAuthor()||isUserOwner()?mdiDownload:mdiDownloadOutline} size={1}></Icon></p></a>
                  <p className="label is-6 has-text-info">{counters.downloads}</p>
                </div>

              </div>
              <div class="level-item has-text-centered pl-5">
                <div>
      
                  <a onClick={handleBookmark}><p class={clsx(userAction.bookmark?'has-text-success':'has-text-gray')}><Icon path={userAction.bookmark?mdiBookmark:mdiBookmarkOutline} size={1}></Icon></p></a>
                  <p className="label is-6 has-text-info">{counters.bookmarks}</p>
                </div>
              </div>
            </nav>


            <ul className={clsx('p-2','listbox')}>
              {list.map((item,index)=>{return <ExpandableListItem item={item} itemIndex={index} onItemSelection={handleItemCheck} actionable={userAction.download||isUserAuthor()||isUserOwner()}/>})}
            </ul>
          </div>
          <div className="column has-text-centered is-one-fifth">
          </div>

        </div>
           
      </div>
    </div>  
    );


 }