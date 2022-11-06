import Head from 'next/head'
import styles from '../../styles/Home.module.css'
import Link from 'next/link'
import clsx from 'clsx'
import Icon from '@mdi/react';
import { mdiAccount } from '@mdi/js';
import { useRouter } from 'next/router'
import { CONSTANTS } from '../../components/Util/Constants';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
    const router = useRouter();
    const [profile,setProfile] = useState({emailId:'',posts:0,downloads:0})
    const [email,setEmail] = useState('');
    const [posts,setPosts] = useState(0)
    const [downloads,setDownloads] = useState(0)
    const [username,setUsername] = useState('')

    useEffect(async ()=>{
      try{
        const profileData = await axios.get(CONSTANTS.PROFILE_URL,{timeout:CONSTANTS.REQUEST_TIMEOUT})
     
        
        setProfile(profileData.data.data)
       
      }catch(error){

      }
    },[])
    useEffect(()=>{
      setUsername(localStorage&&localStorage.getItem(CONSTANTS.HOPS_USERNAME_KEY))
    },[username])
    return (
      <div>
        <Head>
          <title>KandyBag</title>
          <link rel="icon" href="/tinylogo.png" />
        </Head>
        <div className={clsx('columns','min-screen-fill')}>

        <div className={clsx('column','is-one-third','is-offset-one-third','centeralignment')}>
          <div className={clsx('box','pt-4 pl-6 pr-6 pb-4')}>
          <div className="block level mb-8">
                            <div className="level-left">
                                <span><figure className = {clsx('image','is-24x24','mr-2') }> 
                                    <img src="/headerlogo.png"/>
                                </figure></span>
                                <span><p className="title is-5 is-grouped is-grouped-centered">KandyBag</p></span>
                            </div>
                        </div>
          <article class="media mt-6">
  <figure class="media-left">
    <p class="image is-64x64 has-text-warning">
      <Icon path={mdiAccount}></Icon>
    </p>
  </figure>
  <div class="media-content">
    <div class="content">
      <p>
        <strong>{username}</strong>
        <br/>
        <div className='has-text-info mt-2 mb-4'>{profile.emailId}</div>
        <div className='mt-2'><strong>{profile.posts}&nbsp;</strong>Posts</div>
        <div className='mt-2'><strong>{profile.downloads}&nbsp;</strong>Downloads</div>
      </p>
    </div>
    <nav class="level is-mobile mt-6">
      <div className='level-item has-text-centered'><button onClick={()=>router.replace('/')} className={clsx('button','is-info')}><strong>OK</strong></button></div>
    </nav>
  </div>

</article>
          </div>
        
        
        </div>


        </div>

      </div>
       

    );
}