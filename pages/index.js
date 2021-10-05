import Head from 'next/head'
import Link from 'next/link'
import BaseLayout from './../components/ui/BaseLayout'
import clsx from 'clsx'
import SearchBar from './../components/ui/SearchBar'
import DisplayArea from './../components/ui/DisplayArea'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { CONSTANTS } from './../components/Util/Constants'
import { useContext } from 'react'
import { AuthorizationContext } from '../components/Util/AuthContext'
import { NavigationContext } from '../components/Util/NavigationContext'
import Header from '../components/ui/Header'
import Categories from '../components/ui/Categories'
import axios from 'axios'
import GenericCategories from '../components/ui/GenericCategories'
import { buildGuestUser } from '../components/Util/Session'

export default function Home({onLoginChange,displayState,onDisplayStateChange}) {

  const router = useRouter();
  const user = useContext(AuthorizationContext);
  const [categoryData,setCategoryData] = useState([]);
  const fetchCategoryUrl = '/hopsapi/resources/categories'
  const logoutUrl = '/hopsapi/user/logout'
  //const [displayState,setDisplayState]=useState({mode:(user.isLoggedIn?CONSTANTS.commandModes.MYFEED:CONSTANTS.commandModes.POPULAR),param:(user.isLoggedIn?user.id:'')});
  

  function setDisplayState(displayStateObject){
    onDisplayStateChange(displayStateObject)
  }

  function handleSearch(queryString){

    if(queryString)
    setDisplayState({mode:CONSTANTS.commandModes.SEARCH,param:queryString,activeItem:-1});
    
  }

  console.log('userstatus:'+user.id+"-"+user.role+'-'+user.isLoggedIn);
  function handleCreatePost(){
    if(user.isLoggedIn){
      router.push('/usrview/square')
    }else{
      router.push('/user_signup')
    }
  }

  function handleLogout(){
    try{
      const response = axios.post(logoutUrl);
      if(response.status=='FAIL'){
        throw error('logout failed')
      }
      var guestUser = buildGuestUser();
      guestUser.handshake=true;

     // onLoginChange({isLoggedIn:false,role:'GUEST',userId:-1,handshake:true})
     //onLoginChange({isLoggedIn:false,role:'GUEST',userId:-1,handshake:true})
     onLoginChange(guestUser)
    }catch(error){
      console.log(error)
    }
    
  }
  function handleCategoryMenuItem(category,activeIndex){
    //Build a query for the category and set the displaystate
    if(category)
    setDisplayState({mode:CONSTANTS.commandModes.CATEGORIES,param:category,activeItem:activeIndex})
  }

  function handleGenericCategories(category,activeIndex){
    
    setDisplayState({mode:category,param:'',activeItem:activeIndex})
  }

  //My feed button 
  function MyFeedButton({}){
    if(!user.isLoggedIn){
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
  if(user.isLoggedIn){
    navButtons =  (<div className={clsx('buttons')}>
                    <Link href='/usrview/profile'>
                      <a className={clsx('button','is-success', 'is-light','centeralignment','hoverzoom')}>
                        <strong>Profile</strong>
                      </a>
                    </Link>
                    <a className={clsx('button','is-light','hoverzoom')} onClick={handleLogout}>
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

  useEffect(async()=>{
    try{
      const response = await axios.get(fetchCategoryUrl,{timeout:CONSTANTS.REQUEST_TIMEOUT})
      setCategoryData(response.data.data.categories)
    }catch(error){
      //No Category data
    }
  },[])


  return (
    <BaseLayout>
   
    <div>
     <Header/>
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
              <SearchBar onSearch={handleSearch} reset={displayState.mode===CONSTANTS.commandModes.SEARCH?false:true}/>
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
        <div className="column ml-2 mr-1 is-one-fifth">
          <div className="box mt-2 has-background-white">
            
         

          <GenericCategories onSelectItem={handleGenericCategories} activeIndex={displayState.activeItem} reset={displayState.mode === CONSTANTS.commandModes.TRENDING||displayState.mode===CONSTANTS.commandModes.POPULAR||displayState.mode===CONSTANTS.commandModes.MYLISTS||displayState.mode===CONSTANTS.commandModes.MYFEED||displayState.mode===CONSTANTS.commandModes.SAVED||displayState.mode===CONSTANTS.commandModes.BOOKMARKED?false:true}/>
         
          </div>
         
          <div className={clsx('box')}>
            <Categories onSelectItem={handleCategoryMenuItem} data={categoryData} activeIndex={displayState.activeItem} reset={displayState.mode===CONSTANTS.commandModes.CATEGORIES?false:true}/>
          </div>
        </div>                                                                                                                                           
        <div className={clsx('column','mr-2','is-auto','min-screen-fill')}>
         <NavigationContext.Provider value={displayState}><DisplayArea  isLoggedIn={user.isLoggedIn} command={displayState}/></NavigationContext.Provider>
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
                      <i className="mdi mdi-plus has-text-success p-2"></i>
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
