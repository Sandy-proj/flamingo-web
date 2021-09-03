import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import BaseLayout from './../components/ui/BaseLayout'
import clsx from 'clsx'

import SearchBar from './../components/ui/SearchBar'
import DisplayArea from './../components/ui/DisplayArea'
import { useState } from 'react'
import { useRouter } from 'next/router'
import {mdiAccount,mdiLock} from '@mdi/js'
import Paginator from './../components/ui/Paginator'
import { CONSTANTS } from './../components/Util/Constants'

export default function Home({isLoggedIn,role,user,onLoginChange}) {

  const router = useRouter();
  const [displayState,setDisplayState]=useState({mode:(isLoggedIn?CONSTANTS.commandModes.MYFEED:CONSTANTS.commandModes.POPULAR),param:(isLoggedIn?user.id:'')});
  
  function handleSearch(queryString){

    if(queryString)
    setDisplayState({mode:CONSTANTS.commandModes.SEARCH,param:queryString});
    
  }


  function handleCreatePost(){
    if(isLoggedIn){
      router.push('/usrview/square')
    }else{
      router.push('/user_signup')
    }
  }

  //My feed button 
  function MyFeedButton({}){
    if(!isLoggedIn){
      return null;
    }

    return <li key={1}>
    <a onClick={(e)=>{e.preventDefault();setDisplayState({mode:CONSTANTS.commandModes.MYFEED,param:user.id});}}>
      <span className="icon-text">
        <span className="icon">
          <i className="mdi mdi-account has-text-info p-2"></i>
        </span>
        <span>My Feed</span>
      </span>
    </a>
    
    </li>
  }

   
  //Elements switching for logged in user and guest user. 
  var navButtons=<div></div>
  if(isLoggedIn){
    navButtons =  (<div className={clsx('buttons')}>
    
                      <a className={clsx('button','is-light','hoverzoom')} onClick={()=>{onLoginChange({isLoggedIn:false,role:'GUEST',userId:-1})}}>
                        Sign out
                      </a>
                    </div>);    
  }else{
    navButtons =  (<div className={clsx('buttons')}>
    <Link href='/user_signup'>
    <a className={clsx('button','is-success', 'is-light','centeralignment','hoverzoom')}>
      <strong>Sign up</strong>
    </a>
    </Link>
    <Link href='/user_login'>
    <a className={clsx('button','is-light','hoverzoom')}>
      Log in
    </a>
    </Link>
    </div>);
  }


  console.log('Login-status:'+(isLoggedIn?'logged in':'logged out')+' role:'+role)
  return (
    <BaseLayout>
   
    <div>
      <Head>
        <title>HopSquare</title>
        <link rel="icon" href="/tinylogo.png" />
      </Head>
      <div>

     {
       //Header
     }
      <nav className="navbar is-transparent pr-4 pl-3" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            <figure className = {clsx('image','is-24x24')}> 
            <img src="/headerlogo.png"/>
            </figure>
    
          </a>
          <a className="navbar-item" href="/">
            <p className = "title is-4"> 
            Hop<strong>Square</strong>
            </p>
    
          </a>
           <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navBarMenu">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
          
        </div>

       
        <div id="navBarMenu" className="navbar-menu is-active">
          <div className={clsx("navbar-end",'is-align-content-center')}>
            <div className={clsx('navbar-item','is-expanded','is-align-items-center')}>
              <SearchBar onSearch={handleSearch}/>
            </div>
          </div>
      <div className="level navbar-end">
    
      <div className="navbar-item level-item is-expanded">
        {navButtons}
      </div>
  
    </div>
  </div>
</nav>

      <div className="columns is-gapless">
        <div className="column ml-2 mr-2 is-one-fifth">
          <div className="box mt-1 has-background-white">
          <aside className="menu">
            <ul className="menu-list">
              <MyFeedButton/>
              <li key={2}>
                <a onClick={(e)=>{e.preventDefault();setDisplayState({mode:CONSTANTS.commandModes.POPULAR,param:''});}}>
                  <span className="icon-text">
                    <span className="icon">
                      <i className="mdi mdi-heart has-text-danger p-2"></i>
                    </span>
                    <span>Popular</span>
                  </span>
                </a>
                
                </li>
                <li  key={3}>
                <a onClick={(e)=>{e.preventDefault();setDisplayState({mode:CONSTANTS.commandModes.TRENDING,param:''});}}>
                  <span className="icon-text">
                    <span className="icon">
                      <i className="mdi mdi-trending-up has-text-success p-2"></i>
                    </span>
                    <span>Trending</span>
                  </span>
                </a>
                
                </li>


            </ul>
          </aside>
         
          </div>
          <div className="box mt-0 has-background-white">
            Tags
          </div>
        </div>                                                                                                                                           
        <div className="column mr-2 is-auto media">
         <DisplayArea command={displayState}/>
          <div>
           
        </div> 
        </div>
        <div className="column is-one-fifth">
          <div className="box has-background-white mt-2">
          <aside className="menu">
            <ul className="menu-list">
            <li key={1}>
                <a onClick={handleCreatePost}>
                  <span className="icon-text">
                    <span className="icon">
                      <i className="mdi mdi-pencil has-text-success p-2"></i>
                    </span>
                    <span>Create a post</span>
                  </span>
                </a>
                
                </li>
              
              
            </ul>
          </aside>
          </div>
        </div>
       
      </div>
      </div>
      </div>
 




    </BaseLayout>
  )
}
