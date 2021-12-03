import SearchBar from './SearchBar'
import {Icon,Stack} from '@mdi/react'
import {mdiAccount,mdiBlockHelper,mdiHeart, mdiEye,mdiDownload, mdiViewList, mdiClipboardList, mdiFormatListChecks, mdiViewListOutline, mdiCheckboxBlankCircle, mdiCircle} from '@mdi/js'
import clsx from 'clsx'
import { AuthorizationContext } from '../Util/AuthContext'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import {getTimeString} from '../Util/Session'
export default function Header({resourceData,onSelection}){
    const router = useRouter();
    const user = useContext(AuthorizationContext);
    function handleClick(e){
        e.preventDefault();
        onSelection(resourceData.id)
    }

    //console.log(resourceData)
    return (
    // <div className={clsx('tile','is-parent','is-6','is-shadowless','pl-0','pr-4','pt-0')}>
    // <article className={clsx('tile','is-child','box','is-radiusless')}>
          <div className={clsx('box','mt-1','is-radiusless','is-clickable','pt-5','pb-3','pl-4','pr-4','basic-box','is-shadowless')} onClick={handleClick}> 
         <div className={clsx('mb-0','mr-1')} > 
                <div class="media mt-4 mb-1">
                    <div class="media-left">
                        <figure class="image is-36x36 is-rounded">
                        <Stack size={1.25} >
                            <Icon path={mdiCheckboxBlankCircle} size={1.25} color='#efefef'/>
                        <Icon path={mdiViewList}
                        color="#909090" size={0.75}/>
                        </Stack> 
                                               </figure>
                    </div>
                    <div className={clsx('media-content')}>
                        <p class="title is-6 has-text-weight-semibold is-family-primary mb-2">{resourceData.title}</p>
                        <span className={clsx('mt-0','mb-4')}><span className={clsx('subtitle','is-6','mb-4','has-text-weight-light')}>{resourceData.author_name}</span><span className={clsx('ml-2')}><span className={clsx('mr-2','grey-dot')}><Icon path={mdiCircle} size={0.3}></Icon></span>{getTimeString(Number(resourceData.updated_at))}</span></span>
                        {/* <p class="content">{resourceData.preview&&resourceData.preview.name}<br></br>....</p> */}
                    </div>
                </div>
                {resourceData&&resourceData.status==='DOWNLOADED'?<div><div className={clsx('tag','has-background-grey-light','has-text-grey','ml-4','is-light')}>Downloaded</div></div>:
                <div class="nav mt-4 mb-1">
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
       
    
    </div>

  
);

}