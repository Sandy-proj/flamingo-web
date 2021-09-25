import SearchBar from './SearchBar'
import {Icon} from '@mdi/react'
import {mdiAccount,mdiLock,mdiHeart} from '@mdi/js'
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
        <div className="box mt-1 is-radiusless is-shadowless is-clickable" onClick={handleClick}>
                <div class="media">
                    <div class="media-left">
                        <figure class="image is-36x36 is-rounded">
                            <i className="mdi mdi-account"></i>
                        </figure>
                    </div>
                    <div class="media-content">
                        <p class="title is-5 has-text-weight-light has-text-grey-dark">{resourceData.id +':'+resourceData.title}</p>
                        <p class="subtitle is-info-light is-6"><a>it is {user.role}</a></p>
                        <p class="content">A list of awesome collection of things  to be viewed</p>
                    </div>
                </div>
                <div class="nav mt-3">
                <div class="columns">
                    <div className = {clsx('column','is-one-third','centeralignment')}>
                    <span className={clsx('icon-text','is-clickable',)}>
                    <span class="icon mdi mdi-eye p-2 has-text-warning">
                        
                    </span>
                    <span>8989</span>
                 </span>
                    </div>


                    <div className = {clsx('column','is-one-third','centeralignment')}>
                    <span className={clsx('icon-text','is-clickable','has-text-grey')}>
                    <span class="icon mdi mdi-heart p-2 has-text-danger">
                        
                    </span>
                    <span>300</span>
                 </span>
                    </div>

                    
                    <div className = {clsx('column','is-one-third','centeralignment')}>
                    <span className={clsx('icon-text','is-clickable',)}>
                    <span class="icon mdi mdi-download p-2 has-text-success">
                        
                    </span>
                    <span>898</span>
                 </span>
                    </div>
                
                
                  


               
            
            </div>
            </div>
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