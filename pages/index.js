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
import Icon from '@mdi/react'
import { mdiAccount, mdiClockTimeSix, mdiPlus } from '@mdi/js'
import Footer from '../components/ui/Footer'

export default function Home({onLoginChange,displayState,onDisplayStateChange}) {

  const router = useRouter();
  const user = useContext(AuthorizationContext);
  const [categoryData,setCategoryData] = useState([]);
  const [sidebar,setSidebar] = useState(false)
  const fetchCategoryUrl = '/hopsapi/resources/categories'
  const logoutUrl = '/hopsapi/user/logout'
  //const [displayState,setDisplayState]=useState({mode:(user.isLoggedIn?CONSTANTS.commandModes.MYFEED:CONSTANTS.commandModes.POPULAR),param:(user.isLoggedIn?user.id:'')});
  

  function setDisplayState(displayStateObject){
    onDisplayStateChange(displayStateObject)
  }

  function handleSearch(queryString){


    setDisplayState({mode:CONSTANTS.commandModes.SEARCH,param:queryString,activeItem:-1});
    
  }

  //console.log('userstatus:'+user.id+"-"+user.role+'-'+user.isLoggedIn);
  function handleCreatePost(){
    if(user.isLoggedIn){
      router.push('/usrview/square')
    }else{
      router.push('/user_login')
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
     setDisplayState({mode:CONSTANTS.commandModes.POPULAR,param:'',activeItem:0})
    }catch(error){
      
    }
    
  }
  function handleCategoryMenuItem(category,activeIndex){
    //Build a query for the category and set the displaystate
    if(category){
      setDisplayState({mode:CONSTANTS.commandModes.CATEGORIES,param:category,activeItem:activeIndex})
      setSidebar(false)
    }
    
  }

  function handleGenericCategories(category,activeIndex){
    
    setDisplayState({mode:category,param:'',activeItem:activeIndex})
    setSidebar(false)
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
                      <button className={clsx('button','is-info','is-light')}><span><Icon path={mdiAccount} size={1.25}></Icon></span><span><strong>{localStorage.getItem(CONSTANTS.HOPS_USERNAME_KEY)}</strong></span></button>
                      {/* <a className={clsx('button','is-success', 'is-light','centeralignment','hoverzoom')}>
                        <strong>Profile</strong>
                      </a> */}
                    </Link>
                    <a className={clsx('button','is-light')} onClick={handleLogout}>
                        <strong>Sign out</strong>
                      </a>
                    </div>);    
  }else{
    navButtons =  (<div className={clsx('buttons')}>
                  
                    <Link href='/user_login'>
                      <a className={clsx('button','is-info','is-rounded','is-outlined','hoverzoom')}>
                        <strong>Log in</strong>
                      </a>
                    </Link>
                    <Link href='/user_signup'>
                      <a className={clsx('button','is-inverted','is-rounded','is-info','centeralignment','hoverzoom')}>
                        <strong>Sign up</strong>
                      </a>
                    </Link>
                  </div>);
  }

  useEffect(async()=>{
    try{
      const response = await axios.get(fetchCategoryUrl,{timeout:CONSTANTS.REQUEST_TIMEOUT})
      // console.log(':::::')
      // console.log(response)
      // const data = response.data.data.categories.map(item=>{return {id:item.id,name:CONSTANTS.commandModes.CATEGORIES,param:item.name}})
      // console.log(data)
      const data = response.data.data.categories;
      setCategoryData(data)
    }catch(error){
      //No Category data
    }
  },[])

  useEffect(async()=>{
    if(user.role==='REGISTERED'){
      router.push('/verify_account')
    }
  },[user.role])


  return (
    <div>
   <div className={clsx('sidenav',sidebar?'sidebar-max':'sidebar-min','is-hidden-desktop')}>
   <aside className="menu pl-4">
            <ul className="menu-list">
            <li key={1}>
                <a onClick={handleCreatePost}>
                  <span className="icon-text">
                    <span className="icon">
                      {/* <i className="mdi mdi-plus has-text-success p-2"></i> */}
                      <Icon path={mdiPlus} size={1}></Icon>
                    </span>
                    <span>Create a post</span>
                  </span>
                </a>
                
                </li>
              
              
            </ul>
          </aside>
   <div className={clsx('box','is-shadowless')}>
   <GenericCategories onSelectItem={handleGenericCategories} activeIndex={displayState.activeItem} reset={displayState.mode === CONSTANTS.commandModes.TRENDING||displayState.mode===CONSTANTS.commandModes.FRESH||displayState.mode===CONSTANTS.commandModes.POPULAR||displayState.mode===CONSTANTS.commandModes.MYLISTS||displayState.mode===CONSTANTS.commandModes.MYFEED||displayState.mode===CONSTANTS.commandModes.SAVED||displayState.mode===CONSTANTS.commandModes.BOOKMARKED?false:true}/>

     </div>   
     <div className={clsx('box')}>
     <Categories className={clsx('pl-4')} onSelectItem={handleCategoryMenuItem} data={categoryData} activeIndex={displayState.activeItem} reset={displayState.mode===CONSTANTS.commandModes.CATEGORIES?false:true}/>

     </div> 
             </div>
    <div>
     <Header/>
      <div>

     {
       //Header
     }
      <nav className="navbar is-transparent pr-4 pl-3 pt-1 pb-1" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            <figure className = {clsx('image')}> 
            <img src="/headerlogo.png"/>
            </figure>
    
          </a>
          <a className="navbar-item" href="/">
            <p className={clsx('title','is-4')}>
            Hop<strong>Square</strong>
            </p> 
    
          </a>
           <a role="button" className={clsx('navbar-burger','has-text-black',sidebar?'is-active':'')} aria-label="menu" aria-expanded="false" data-target="navBarMenu" onClick={()=>setSidebar(!sidebar)}>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
          
        </div>

        <div className={clsx('navbar-menu','is-active')}>
       
        <div className={clsx('navbar-item','navbar-end','is-expanded','is-align-items-center')}>
        <SearchBar className={clsx('ml-6')} onSearch={handleSearch} reset={displayState.mode===CONSTANTS.commandModes.SEARCH?false:true}/>
            </div>
        <div className="navbar-item navbar-end level-item is-expanded">
        {/* <SearchBar onSearch={handleSearch} reset={displayState.mode===CONSTANTS.commandModes.SEARCH?false:true}/> */}
             
            </div>
          <div className={'navbar-item'}>
          {navButtons}
        </div>
        </div>


       
        {/* <div id="navBarMenu" className="navbar-menu is-active">
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
        </div> */}
</nav>


      <div className="columns is-gapless ">
        <div className="column is-2"/>
     

        <div className="column is-hidden-mobile ml-2 mr-1 is-2">
          <div className="box mt-2 has-background-white is-shadowless">
            
         

          <GenericCategories onSelectItem={handleGenericCategories} activeIndex={displayState.activeItem} reset={displayState.mode === CONSTANTS.commandModes.TRENDING||displayState.mode===CONSTANTS.commandModes.FRESH||displayState.mode===CONSTANTS.commandModes.POPULAR||displayState.mode===CONSTANTS.commandModes.MYLISTS||displayState.mode===CONSTANTS.commandModes.MYFEED||displayState.mode===CONSTANTS.commandModes.SAVED||displayState.mode===CONSTANTS.commandModes.BOOKMARKED?false:true}/>
         
          </div>
         
          <div className={clsx('box','is-shadowless','pl-4')}>
            <Categories onSelectItem={handleCategoryMenuItem} data={categoryData} activeIndex={displayState.activeItem} reset={displayState.mode===CONSTANTS.commandModes.CATEGORIES?false:true}/>
          </div>
        </div>                                                                                                                                           
        <div className={clsx('column','mr-2','is-auto')}>
         <NavigationContext.Provider value={displayState}><DisplayArea  command={displayState}/></NavigationContext.Provider>
          <div>
           
        </div> 
        </div>
        <div className="column is-hidden-mobile is-2">
          <div className="box has-background-white mt-2">
          <aside className="menu">
            <ul className="menu-list">
            <li key={1}>
                <a onClick={handleCreatePost}>
                  <span className="icon-text">
                    <span className="icon">
                      {/* <i className="mdi mdi-plus has-text-success p-2"></i> */}
                      <Icon path={mdiPlus} size={1}></Icon>
                    </span>
                    <span>Create a post</span>
                  </span>
                </a>
                
                </li>
              
              
            </ul>
          </aside>
          </div>
        </div>
        <div className={clsx('column','is-2')}/>
      </div>
      </div>
      </div>
 



    <Footer/>
    </div>
  )
}
