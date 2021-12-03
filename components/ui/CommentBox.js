
import { useState, useEffect, useRef } from 'react';
import { CONSTANTS } from './../Util/Constants'
import axios from 'axios';
import Paginator from './Paginator';
import { useContext } from 'react';
import { Router, useRouter } from 'next/router';
import clsx from 'clsx';
import Icon from '@mdi/react'
import { mdiAccount, mdiGoogle, mdiPlusCircle, mdiPlus, mdiComment, mdiAccountCircle, mdiDelete, mdiDeleteEmpty, mdiDeleteForever, mdiDeleteAlert } from '@mdi/js'
import { AuthorizationContext } from '../Util/AuthContext';
import { getCookie, getTimeString } from '../Util/Session';
export default function CommentBox({ resourceId,getComments }) {
    
    const [commentList,setCommentList] = useState([]);
    const [commentValue,setCommentValue] = useState('');
    const getCommentsUrl = CONSTANTS.GET_COMMENTS_URL+'?res='+resourceId;
    const postCommentUrl = CONSTANTS.POST_COMMENTS_URL;
    const user = useContext(AuthorizationContext)

    useEffect(async()=>{
        if(getComments){
            try{
                const comments = await axios.get(getCommentsUrl,{timeout:CONSTANTS.REQUEST_TIMEOUT})
                //console.log(comments)
                if(comments.status===CONSTANTS.GET_SUCCESS&&comments.data&&comments.data.result===CONSTANTS.SUCCESS){
                    if(comments.data&&comments.data.data){
                        setCommentList(comments.data.data)
                    }
                }
            }catch(error){

            }
        }
    },[getComments])


    async function onPostComment(e){
        e.preventDefault();
        if(commentValue.trim()===''||!(resourceId>0)){
            return;
        }
        let result = null;
        const securityToken = getCookie(CONSTANTS.REQUEST_COOKIE_KEY)
        try{
            result = await axios.post(postCommentUrl,{comment:commentValue,resource:resourceId,[CONSTANTS.REQUEST_PARAM_KEY]:securityToken},{timeout:CONSTANTS.REQUEST_TIMEOUT})
            //console.log(result.data.data)
            if(result.status===CONSTANTS.POST_SUCCESS&&result.data&&result.data.data){

                setCommentList([result.data.data,...commentList]);
                setCommentValue('')
            }
        }catch(error){
            //console.log(error)
        }
        //console.log(result)
    }


    async function deleteComment(id,index){
        
        try{
            const deleteCommentUrl = CONSTANTS.DELETE_COMMENT_URL+'?cmt_id='+id;
            //console.log(deleteCommentUrl)
            const deleteResult = await axios.delete(deleteCommentUrl,{timeout:CONSTANTS.REQUEST_TIMEOUT})
            //console.log(deleteResult)
            if(deleteResult.status===200&&deleteResult.data&&deleteResult.data.data===1){
                commentList.splice(index,1)
                setCommentList([...commentList])
            }
        }catch(error){

        }
    }

    return <div className={clsx('columns','mt-0')}>
          <div className="column is-one-fifth">
          </div>
        <div className={clsx('box','column','is-auto')}>
            <div>
                <p className={clsx('title','is-6','has-text-weight-bold','has-text-info','p-4')}><span><Icon path={mdiComment} size={0.75}></Icon></span>Comments</p>
            </div>

           
            {user.isLoggedIn&&<div><div className={clsx('control','pl-4')}>
                <textarea className={clsx('textarea','ghost')} rows={2} placeholder={`@${localStorage.getItem(CONSTANTS.HOPS_USERNAME_KEY)}  says...`} value={commentValue} onChange={(e)=>setCommentValue(e.target.value)}></textarea>
            </div>
            <div className={clsx('pl-4','mt-1','mb-2')}>
                <button className={clsx('button','is-info')} onClick={onPostComment}><strong>Post</strong></button>
            </div>
            </div>}
            <div>
                
                <ul>
                    {commentList.map((item,index)=><li key={item.id}>
                      
                        <div className={clsx('box','ml-4')}>
                            <div className={clsx('level','is-mobile','mb-1')}>
                                <div className={clsx('level-left')}>
                                    <div className={clsx('level-item','pr-0','mr-0','has-text-grey')}>
                                        <Icon path={mdiAccountCircle} size={0.75}></Icon>
                                    </div>
                                    <div className={clsx('level-item')}>
                                <span className={clsx('has-text-link','has-text-weight-bold','mr-2','is-small')}>{item.user_name}
                            </span><span className={clsx('has-text-grey','has-text-weight-light','is-size-7')}>{getTimeString(Number(item.created_at))}</span>
                                    </div></div>
                                <div className={clsx('level-right')}><div className={clsx('level-item')}>
                                {item.user_name===localStorage.getItem(CONSTANTS.HOPS_USERNAME_KEY)&&<button onClick={(e)=>deleteComment(item.id,index)} className={clsx('button','has-text-grey','is-white','is-small','is-borderless')}><Icon path={mdiDelete} size={0.75}></Icon></button>}</div></div>
                            </div>
                           
                            <div className={clsx('has-text-bold','mt-0')}>{item.comment_string}</div>
                        </div>
                    </li>)}
                </ul>
            </div>

        </div>
        <div className="column is-one-fifth">
          </div>
    </div>
}