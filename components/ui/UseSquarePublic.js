import Head from 'next/head'
import { useEffect, useRef, useState  } from 'react'
import { mdiDragVertical, mdiPlus,  mdiHeartOutline, mdiMinus, mdiCheckboxBlankOutline, mdiCheck,mdiDotsHorizontal, mdiDownloadOutline, mdiBookMarkerOutline, mdiBookmarkOutline, mdiAccount, mdiDotsVertical, mdiBackburger, mdiHamburger, mdiMenu, mdiClose, mdiHeart, mdiDownload, mdiBookmark, mdiDelete, mdiDetails} from '@mdi/js'
import {Icon} from '@mdi/react'
import  axios from 'axios'
import clsx from 'clsx';
import { useRouter } from 'next/router'
import { useContext } from 'react'
import {AuthorizationContext} from '../Util/AuthContext'
import DropDownMenu from './DropDownMenu'
import { CONSTANTS } from './../Util/Constants'
import ConfirmationDialog from './ConfirmationDialog'
import LoginSuggestion from './LoginSuggestion'

export default function UseSquarePublic({resourceId,resource,onEdit,activity,isEditable}) {

    var downloadUrl = '/hopsapi/resources/resource/download'
    var updateActionsUrl = '/hopsapi/resources/resource/viewupdate'
    var deleteUrl = '/hopsapi/resources/resource/delete'
    const [showDetails,setShowDetails] = useState(false);
    const list = resource.data.resource
    const menu = [{id:1,name:CONSTANTS.ACTION_MENU.EDIT,owner:true},
      {id:2,name:CONSTANTS.ACTION_MENU.DOWNLOAD,isOwner:false},
      {id:3,name:CONSTANTS.ACTION_MENU.BOOKMARK,isOwner:false},
      {id:4,name:CONSTANTS.ACTION_MENU.LIKE,isOwner:false},
      {id:5,name:CONSTANTS.ACTION_MENU.DELETE,isOwner:true},
      {id:6,name:CONSTANTS.ACTION_MENU.CLOSE,isOwner:false}
      ]
    const user = useContext(AuthorizationContext)
    const router = useRouter();
    const [downloading,setDownloading] = useState(false);
    const [counters,setCounters]=useState({likes:0,downloads:0,bookmarks:0})
    const [loginSuggestion,setLoginSuggestion] = useState(false)


    function handleEdit(e){
        onEdit()
    }

    async function handleClose(e){
      e.preventDefault();

        try{
          let requestUrl = updateActionsUrl+`?res=${resource.id}`
          const response =  await axios.post(requestUrl,{view:true},{timeout:CONSTANTS.REQUEST_TIMEOUT})

        }catch(error){
          console.error(error)
        }
     
      router.push('/')
    }

    function handleItemCheck(index,action){
      actions.current[index]=action;
    }

    function handleLike(){
    
    }

    async function handleDownload(){
     

    }


    function handleBookmark(){
     
    }
    function onLoginCancel(){
      setLoginSuggestion(false)
    }
    function onLoginOk(){
      router.replace('/user_login')
    }
    function suggestLogin(){
      setLoginSuggestion(true)
    }
  
    function handleDialogCancel(){
      setDeleting(false)
    }

    function handleMenuItemSelection(index){
      if(menu[index].name===CONSTANTS.ACTION_MENU.EDIT){
        suggestLogin();
      }else if(menu[index].name===CONSTANTS.ACTION_MENU.DOWNLOAD){
        suggestLogin();
      }else if(menu[index].name===CONSTANTS.ACTION_MENU.BOOKMARK){
        suggestLogin();
      }else if(menu[index].name===CONSTANTS.ACTION_MENU.SHOW_NUMBERS){
        
      }else if(menu[index].name===CONSTANTS.ACTION_MENU.LIKE){
        suggestLogin();
      }else if(menu[index].name===CONSTANTS.ACTION_MENU.REMOVE){
      
      }else if(menu[index].name===CONSTANTS.ACTION_MENU.DELETE){
        suggestLogin();
      }else if(menu[index].name===CONSTANTS.ACTION_MENU.CLOSE){
          router.push('/')
      }else{

      }
    }

    function ExpandableListItem({item,actionable,itemIndex,onItemSelection}){
      const [isExpanded,setExpanded]=useState(false);
      const [isSelected,setSelected]=useState(item.actions?(item.actions?item.actions.check:false):false);
      const[itemData,setData]=useState(item)
   

      
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



      
      return <li className="mb-3 ml-0 p-1">
        
        <div className={clsx('columns','is-gapless','is-mobile','mb-1')}>
        {actionable?  <div className={clsx('column','is-auto',isSelected?'active-item':false)}>
            <button className={clsx('button','is-white')} onClick={handleSelection}>
              <span className='icon'><Icon path={isSelected?mdiCheck:mdiCheckboxBlankOutline} size={1}></Icon></span>
            </button>
          </div>:<div></div>}
      
         
          <div className={clsx('column','is-10','ml-1','mr-1')}>
            <div className={clsx('input','is-hovered','entrystyle')} type="text" value={itemData.type===CONSTANTS.LINK_TYPE?
            <a href={itemData.name} target="_blank" rel="noopener noreferrer">{itemData.bookmark?itemData.bookmark:'link'}</a>:itemData.name}>
            </div>
          </div>
          <div className={clsx('column','is-auto',isExpanded?'active-item':false)}>
         
          </div>
          {/* <div className={clsx('column','is-auto',isExpanded?'active-item':false)}>
            <button className={clsx('button','is-white')} onClick={handleExpansion}>
              <span className='icon'><Icon path={isExpanded?mdiMinus:mdiDotsHorizontal} size={1}></Icon></span>
            </button>
          </div> */}
        </div>
                        
  
  
        <div className={clsx('tray-quick','mt-1',showDetails?'tray-max':'tray-min')}>
          <p className={clsx('text')} type="text" defaultValue={''}>{itemData&&itemData.detail}</p>
        </div>
      
      </li>
    }






    useEffect(()=>{
      var counterObject={likes:0,bookmarks:0,downloads:0}
      if(resource){
        counterObject['likes']=resource.data.likes?resource.data.likes:0;
        counterObject['bookmarks']=resource.data.bookmarks?resource.data.bookmarks:0;
        counterObject['downloads']=resource.data.downloads?resource.data.downloads:0;
      }
      setCounters(counterObject)
    },[resource])


    return (
      <div>
        <Head>s
          <title>HopSquare</title>
          <link rel="icon" href="/tinylogo.png" />
  
        </Head>
       <LoginSuggestion visible={loginSuggestion} onOk={onLoginOk} onCancel={onLoginCancel}/>
        <div>
        {/* <Modal activate={downloading}/>
        <ConfirmationDialog message={"Are you sure you want to delete this list?"} isVisible={deleting} onCancel={handleDialogCancel} onConfirm={handleDialogCofirm}/>s */}
          
        <div className={clsx('columns')}>
          <div className="column is-one-fifth">
            
            
          </div>
          <div className={clsx('column','box','is-auto','mt-5')}>

          <nav class="columns is-mobile">
            {/* <div class='columns is-mobile'> */}
            <div className={clsx('column','is-narrow')}>
                <DropDownMenu list={menu} onSelectItem={handleMenuItemSelection}/>
              </div>
             <div class="column is-auto is-narrow">
                
                <button className={clsx('button','is-white','has-text-danger')} onClick={suggestLogin}>
            <span className={clsx('has-text-danger')}><Icon path={mdiHeart} size={0.50}></Icon></span>
            <span className={clsx('label','is-size-65','kandyjar-grey','has-text-weight-normal')}>{resource.likes}</span>
          </button>
                  {/* <a onClick={handleLike} className={clsx(userAction.like?'has-text-danger':'has-text-gray')}><Icon path={userAction.like?mdiHeart:mdiHeartOutline} size={1}></Icon></a>
                  <span className="label is-6 has-text-info">{counters.likes}</span> */}
                
              </div>
              <div class="column is-auto is-narrow">
                
                 <button className={clsx('button','is-white','has-text-link')} onClick={suggestLogin}>
            <span className={clsx('has-text-link')}><Icon path={mdiDownload} size={0.5}></Icon></span>
            <span className={clsx('label','is-size-65','kandyjar-grey','has-text-weight-normal')}>{resource.downloads}</span>
          </button>
                   {/* <a onClick={handleDownload}><p class={clsx(userAction.download?'has-text-link':'has-text-gray')}><Icon path={userAction.download||isUserAuthor()||isUserOwner()?mdiDownload:mdiDownloadOutline} size={1}></Icon></p></a>
                  <p className="label is-6 has-text-info">{counters.downloads}</p> */}
                

              </div>
              <div class="column is-auto is-narrow">
              
       <button className={clsx('button','is-white','has-text-success')} onClick={suggestLogin}>
            <span className={clsx('has-text-success')}><Icon path={mdiBookmark} size={0.5}></Icon></span>
            <span className={clsx('label','is-size-65','kandyjar-grey','has-text-weight-normal')}>{resource.bookmarks}</span>
          </button>
                  {/* <a onClick={handleBookmark}><p class={clsx(userAction.bookmark?'has-text-success':'has-text-gray')}><Icon path={userAction.bookmark?mdiBookmark:mdiBookmarkOutline} size={1}></Icon></p></a>
                  <p className="label is-6 has-text-info">{counters.bookmarks}</p> */}
                </div>
                <div class="column is-auto is-narrow">
              
       <button className={clsx('button','has-text-success',showDetails?'is-info':'is-white')} onClick={()=>setShowDetails(!showDetails)}>
            <span className={clsx(showDetails?'has-text-white':'has-text-grey')}><Icon path={mdiDotsHorizontal} size={0.75}></Icon></span>
            {/* <span className="label is-6 has-text-info">{resource.bookmarks}</span> */}
          </button>
                  {/* <a onClick={handleBookmark}><p class={clsx(userAction.bookmark?'has-text-success':'has-text-gray')}><Icon path={userAction.bookmark?mdiBookmark:mdiBookmarkOutline} size={1}></Icon></p></a>
                  <p className="label is-6 has-text-info">{counters.bookmarks}</p> */}
                </div>
             <div className={clsx('is-auto')}></div>
              {/* </div> */}
              <div class="column is-auto"/>
              <div className={clsx('column','is-narrow','is-desktop')}>
                <button className={clsx('button','is-white','has-text-grey')} onClick={handleClose}><Icon path={mdiClose} size={1}></Icon></button>
              </div>
            </nav>

            <div className={clsx('columns','is-mobile')}>
            <div class="column is-auto is-narrow"/>
              <div className={clsx('column','is-auto')}>
              <div className="is-title is-4"><span className="title is-5">{resource.data.title}</span></div>
                <p className={clsx('is-size-65','kandyjar-grey')}>{resource.data.author_name}</p>
              </div>
              
            </div>
           
           



            <ul className={clsx('p-2','listbox')}>
              {list.map((item,index)=>{return <ExpandableListItem item={item} itemIndex={index} onItemSelection={handleItemCheck} actionable={false}/>})}
            </ul>
          </div>
          <div className="column has-text-centered is-one-fifth">
          </div>

        </div>
           
      </div>
      
    </div>  
    );


 }