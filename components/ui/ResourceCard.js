import SearchBar from './SearchBar'
import {Icon} from '@mdi/react'
import {mdiAccount,mdiLock,mdiHeart, mdiEye,mdiDownload} from '@mdi/js'
import clsx from 'clsx'
import { AuthorizationContext } from '../Util/AuthContext'
import { useRouter } from 'next/router'
import { useContext } from 'react'
export default function Header({resourceData,onSelection}){
    const router = useRouter();
    const user = useContext(AuthorizationContext);
    function handleClick(e){
        e.preventDefault();
        // if(user.isLoggedIn){
        //     router.push(`/usrview/square?id=${24}`)
        // }else{
        //     window.location.href=`http://localhost:3000/view_square?id=24`
        // }
        onSelection(resourceData.id)
    }


    return (
    <div>
        <div className="box mt-1 is-radiusless is-shadowless is-clickable pt-5 pb-3 pl-4 pr-4" onClick={handleClick}>
                <div class="media mt-4 mb-1">
                    <div class="media-left">
                        <figure class="image is-36x36 is-rounded">
                           {/* <Icon path={mdiAccount} size={1}></Icon> */}
                        </figure>
                    </div>
                    <div className={clsx('media-content')}>
                        <p class="title is-5 has-text-weight-light">{resourceData.title}</p>
                        <p className={clsx('subtitle','is-6','has-text-gray','mb-4')}>{resourceData.author_name}</p>
                        {/* <p class="content">{resourceData.preview&&resourceData.preview.name}<br></br>....</p> */}
                    </div>
                </div>
                {resourceData&&resourceData.status==='DOWNLOADED'?<div><div className={clsx('tag','has-background-grey-light','has-text-grey','ml-4','is-light')}>Downloaded</div></div>:
                <div class="nav mt-1 mb-1">
                <div class="columns is-mobile">

                <div className = {clsx('column','is-one-third','centeralignment')}>
                    <span className={clsx('icon-text','is-clickable','has-text-grey')}>
                    <span class="has-text-danger">
                        <Icon path={mdiHeart} size={0.5}></Icon>
                    </span>
                    <span className={clsx('ml-1')}>{resourceData.likes?resourceData.likes:0}</span>
                    </span>
                    </div>


                    <div className = {clsx('column','is-one-third','centeralignment')}>
                    <span className={clsx('icon-text','is-clickable',)}>
                    <span class="has-text-info">
                        <Icon path={mdiEye} size={0.5}></Icon>
                    </span>
                    <span className={clsx('ml-1')}>{resourceData.views?resourceData.views:0}</span>
                 </span>
                    </div>


                  

                    
                    <div className = {clsx('column','is-one-third','centeralignment')}>
                    <span className={clsx('icon-text','is-clickable',)}>
                    <span class="has-text-success">
                         <Icon path={mdiDownload} size={0.5}></Icon>
                    </span>
                    <span className={clsx('ml-1')}>{resourceData.bookmarks?resourceData.bookmarks:0}</span>
                 </span>
                    </div>
                
                
                  


               
            
            </div>
            </div>
}
        </div>
    

        {/* <div className="card mt-2">
     
            <div class="card-header">
                <div className="card-header-title">
                <span className="icon mdi mdi-account"></span>
                <span><a>evadra_uncle</a></span>
                </div>
                <div className="card-header-icon"></div>
                
                   
    
            </div>
            <div class="card-content">
                        <p class="title is-5">{resourceData.title}</p>
                    </div>
            <footer class="card-footer">
                <span className={clsx("icon-text",'card-footer-item','is-clickable')}>
                    <span class="icon mdi mdi-eye has-text-warning">
                        
                    </span>
                    <span>8989</span>
                 </span>
                <span className={clsx("icon-text",'card-footer-item')}>
                    <span class="icon mdi mdi-heart has-text-danger">
                    </span>
                    <span class="centeralignment">300</span>
                 </span>
                 <span className={clsx("icon-text",'card-footer-item')}>
                    <span class="icon mdi mdi-download has-text-success">
                    </span>
                    <span class="centeralignment">898</span>
                 </span>
            </footer>
        </div> */}
    </div>
);

}