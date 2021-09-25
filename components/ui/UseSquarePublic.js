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

export default function UseSquarePublic({resourceId,resource,onEdit,activity,isEditable}) {

    var downloadUrl = '/hopsapi/resources/resource/download'
    var updateUrl = '/hopsapi/resources/resource/update'
    var deleteUrl = '/hopsapi/resources/resource/delete'
    const list = resource.resource
    const menu = [CONSTANTS.ACTION_MENU.EDIT,
                  CONSTANTS.ACTION_MENU.DOWNLOAD,
                  CONSTANTS.ACTION_MENU.BOOKMARK,
                  CONSTANTS.ACTION_MENU.LIKE,
                  CONSTANTS.ACTION_MENU.DELETE,
                  CONSTANTS.ACTION_MENU.CLOSE]
    const user = useContext(AuthorizationContext)
    const router = useRouter();
    const [downloading,setDownloading] = useState(false);
    const [counters,setCounters]=useState({likes:0,downloads:0,bookmarks:0})


    function handleEdit(e){
        onEdit()
    }

    function handleClose(e){
      e.preventDefault();
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

  
    function handleDialogCancel(){
      setDeleting(false)
    }

    function handleMenuItemSelection(index){
      if(menu[index]===CONSTANTS.ACTION_MENU.EDIT){
        handleEdit();
      }else if(menu[index]===CONSTANTS.ACTION_MENU.DOWNLOAD){
        handleDownload();
      }else if(menu[index]===CONSTANTS.ACTION_MENU.BOOKMARK){
        handleBookmark();
      }else if(menu[index]===CONSTANTS.ACTION_MENU.SHOW_NUMBERS){
        
      }else if(menu[index]===CONSTANTS.ACTION_MENU.LIKE){
        handleLike();
      }else if(menu[index]===CONSTANTS.ACTION_MENU.REMOVE){
      
      }else if(menu[index]===CONSTANTS.ACTION_MENU.DELETE){
        setDeleting(true);
      }else if(menu[index]===CONSTANTS.ACTION_MENU.CLOSE){
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

     
      return <li className="mb-3 ml-0 p-1">
        
        <div className={clsx('columns','is-gapless','is-mobile','mb-1')}>
        {actionable?  <div className={clsx('column','is-auto',isSelected?'active-item':false)}>
            <button className={clsx('button','is-white')} onClick={handleSelection}>
              <span className='icon'><Icon path={isSelected?mdiCheck:mdiCheckboxBlankOutline} size={1}></Icon></span>
            </button>
          </div>:<div></div>}
      
         
          <div className={clsx('column','is-10','ml-1','mr-1')}>
            <input className={clsx('input','is-hovered','entrystyle')} type="text" value={itemData.name} placeholder="Enter an item" onChange={handleMainInput}></input>
          </div>
          <div className={clsx('column','is-auto',isExpanded?'active-item':false)}>
         
          </div>
          <div className={clsx('column','is-auto',isExpanded?'active-item':false)}>
            <button className={clsx('button','is-white')} onClick={handleExpansion}>
              <span className='icon'><Icon path={isExpanded?mdiMinus:mdiDotsHorizontal} size={1}></Icon></span>
            </button>
          </div>
        </div>
                        
  
  
        <div className={clsx('tray','mt-1',isExpanded?'tray-max':'tray-min')}>
          <p className={clsx('text')} type="text" defaultValue={''}>{itemData&&itemData.detail}</p>
        </div>
      
      </li>
    }






    useEffect(()=>{
      var counterObject={likes:0,bookmarks:0,downloads:0}
      if(resource){
        counterObject['likes']=resource.likes?resource.likes:0;
        counterObject['bookmarks']=resource.bookmarks?resource.bookmarks:0;
        counterObject['downloads']=resource.downloads?resource.downloads:0;
      }
      setCounters(counterObject)
    },[resource])


    return (
      <div>
        <Head>
          <title>HopSquare</title>
          <link rel="icon" href="/tinylogo.png" />
  
        </Head>
       
        <div>
        {/* <Modal activate={downloading}/>
        <ConfirmationDialog message={"Are you sure you want to delete this list?"} isVisible={deleting} onCancel={handleDialogCancel} onConfirm={handleDialogCofirm}/>s */}
          
        <div className={clsx('columns')}>
          <div className="column is-one-fifth">

            
          </div>
          <div className={clsx('column','box','is-auto','mt-5')}>
            <div className={clsx('columns')}>
              <div className={clsx('column','is-narrow')}>
                <DropDownMenu list={menu} onSelectItem={handleMenuItemSelection}/>
              </div>
              <div className={clsx('column','is-auto')}>
                <div className="is-title is-4"><p className="title is-4">{resource.title}</p>
                <p className='has-text-grey is-6'>{resource.author}</p></div>
              </div>
              <div className={clsx('column','is-narrow')}>
                <a onClick={handleClose}><Icon path={mdiClose} size={1.5}></Icon></a>
              </div>
            </div>
           
           
            <nav class="level">
             <div class="level-item has-text-centered pl-5">
                <div>
                  <a onClick={handleLike}><p className={clsx('has-text-danger')}><Icon path={mdiHeart} size={1}></Icon></p></a>
                  <p className="label is-6 has-text-info">{counters.likes}</p>
                </div>
              </div>
              <div class="level-item has-text-centered pl-5">
                <div>
                   <a onClick={handleDownload}><p class={clsx('has-text-link')}><Icon path={mdiDownload} size={1}></Icon></p></a>
                  <p className="label is-6 has-text-info">{counters.downloads}</p>
                </div>

              </div>
              <div class="level-item has-text-centered pl-5">
                <div>
      
                  <a onClick={handleBookmark}><p class={clsx('has-text-success')}><Icon path={mdiBookmark} size={1}></Icon></p></a>
                  <p className="label is-6 has-text-info">{counters.bookmarks}</p>
                </div>
              </div>
            </nav>


            <ul className={clsx('box','listbox')}>
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