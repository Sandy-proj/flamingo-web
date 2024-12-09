import Head from 'next/head'
import Link from 'next/link'
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
import { mdiAccount, mdiGoogle, mdiPlusCircle, mdiPlus, mdiEmail, mdiHeart } from '@mdi/js'
import Footer from '../components/ui/Footer'
import Loader from '../components/ui/LoadingOverlay'

export default function Home({ onLoginChange, displayState, onDisplayStateChange }) {

  const router = useRouter();
  const user = useContext(AuthorizationContext);
  const [categoryData, setCategoryData] = useState([]);
  const [sidebar, setSidebar] = useState(false)
  const [loadSignIn, setLoadSignIn] = useState(false)
  const [navigateAway, setNavigateAway] = useState(false)
  const [downloads,setDownloads] = useState(1359)
  const fetchCategoryUrl = '/hopsapi/resources/categories'
  const logoutUrl = '/hopsapi/user/logout'
  const downloadsUrl = '/hopsapi/resources/downloads'
  const socialLoginUrl = CONSTANTS.HOPS_SOCIAL_URL;


  //Event handlers. 

  //Function to set the header and navigation state.
  function setDisplayState(displayStateObject) {
    onDisplayStateChange(displayStateObject)
  }

  function handleSearch(queryString) {
    setDisplayState({ mode: CONSTANTS.commandModes.SEARCH, param: queryString, activeItem: -1 });
  }

  function handleCreatePost() {
    setNavigateAway(true);
    router.push('/usrview/square')
    // if (user.isLoggedIn) {
    //   router.push('/usrview/square')
    // } else {
    //   router.push('/user_login')
    // }
  }

  async function handleLogin(){
    setNavigateAway(true);
    router.push('/user_login')
  }

  async function handleLogout() {
    try {
      const response = await axios.post(logoutUrl);
      if (response.status == 'FAIL') {
        throw error('logout failed')
      }
      var guestUser = buildGuestUser();
      guestUser.handshake = true;

      onLoginChange(guestUser)
      setDisplayState({ mode: CONSTANTS.commandModes.POPULAR, param: '', activeItem: 0 })
    } catch (error) {

    }

  }
  function handleCategoryMenuItem(category, activeIndex) {
    //Build a query for the category and set the displaystate
    if (category) {
      setDisplayState({ mode: CONSTANTS.commandModes.CATEGORIES, param: category, activeItem: activeIndex })
      setSidebar(false)
    }

  }

  function handleGenericCategories(category, activeIndex) {

    setDisplayState({ mode: category, param: '', activeItem: activeIndex })
    setSidebar(false)
  }

  //My feed button 
  function MyFeedButton({ }) {
    if (!user.isLoggedIn) {
      return null;
    }

    return <li key={1}>
      <a onClick={(e) => { e.preventDefault(); setDisplayState({ mode: CONSTANTS.commandModes.MYFEED, param: user.id }); }}>
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
  var navButtons = <div></div>
  if (user.isLoggedIn) {
    navButtons = (<div className={clsx('buttons','mt-1')}>
      <Link href='/usrview/profile'>
      <a class="navbar-item has-text-weight-bold mr-5">{localStorage.getItem(CONSTANTS.HOPS_USERNAME_KEY)}</a>
        {/* <button className={clsx('button', 'is-info', 'is-light', 'is-rounded')}><span><Icon path={mdiAccount} size={1}></Icon></span><span><strong>{localStorage.getItem(CONSTANTS.HOPS_USERNAME_KEY)}</strong></span></button> */}
        {/* <a className={clsx('button','is-success', 'is-light','centeralignment','hoverzoom')}>
                        <strong>Profile</strong>
                      </a> */}
      </Link>
      <a class="navbar-item is-link has-text-weight-bold mr-5" onClick={handleLogout}>
        <strong>Log out</strong>
      </a>
      <a class="navbar-item has-text-weight-bold" onClick={()=>{router.push('/my_page')}}>
        <strong>My Page</strong>
      </a>
    </div>);
  } else {
    navButtons = (<div className={clsx('buttons')}> 

      <Link href='/user_login'>
        <a class="navbar-item has-text-weight-bold" onClick={() => setNavigateAway(true)}>
          <strong>Log in</strong>
        </a>
      </Link>
      <Link href='/user_signup'>
        <a class="navbar-item has-text-weight-bold" onClick={() => setNavigateAway(true)}>Sign up</a>
      </Link>
    </div>);
  }


  //Effect to load the categories.
  useEffect(async () => {
    try {
      const response = await axios.get(fetchCategoryUrl, { timeout: CONSTANTS.REQUEST_TIMEOUT })
      const data = response.data.data.categories;
      setCategoryData(data)
    } catch (error) {
      console.log(error)
      //No Category data
    }
    setLoadSignIn(true)
    if(localStorage.getItem('latestlist')){
      handleCreatePost();
    }
  }, [])

  useEffect(async() => {
    try {
    const downloads = await axios.get(downloadsUrl, { timeout: CONSTANTS.REQUEST_TIMEOUT })
    setDownloads(downloads.data);
    }catch (error) {
      console.log(error)
      //No Category data
    }
  })


  //Effect to redirect registered users to verification.
  useEffect(async () => {
    if (user.role === 'REGISTERED') {
      router.push('/verify_account')
    }
  }, [user.role])


  //Element
  return (
    <div>
      <Head><script src={'https://accounts.google.com/gsi/client'} onLoad={() => { }}></script></Head>
      <div className={clsx('sidenav', sidebar ? 'sidebar-max' : 'sidebar-min', 'is-hidden-desktop')}>
        <aside className={clsx('menu', 'centeralignment')}>
          <ul className="menu-list">
            <li key={1}>
              <a onClick={handleCreatePost}>
                <span className="icon-text">
                  <span className="icon">
                    {/* <i className="mdi mdi-plus has-text-success p-2"></i> */}
                    <Icon path={mdiPlus} size={1}></Icon>
                  </span>
                  <span>Create my travel checklist</span>
                </span>
              </a>

            </li>


          </ul>
        </aside>
        {/* <div className={clsx('box')}>
          <GenericCategories onSelectItem={handleGenericCategories} activeIndex={displayState.activeItem} reset={displayState.mode === CONSTANTS.commandModes.TRENDING || displayState.mode === CONSTANTS.commandModes.FRESH || displayState.mode === CONSTANTS.commandModes.POPULAR || displayState.mode === CONSTANTS.commandModes.MYLISTS || displayState.mode === CONSTANTS.commandModes.MYFEED || displayState.mode === CONSTANTS.commandModes.SAVED || displayState.mode === CONSTANTS.commandModes.BOOKMARKED ? false : true} />

        </div>
        <div className={clsx('box')}>
          <Categories className={clsx('pl-4')} onSelectItem={handleCategoryMenuItem} data={categoryData} activeIndex={displayState.activeItem} reset={displayState.mode === CONSTANTS.commandModes.CATEGORIES ? false : true} />

        </div> */}
      </div>
      <div>
        <Header />
        <div>
          <section className={clsx('hero', 'is-large', 'is-info', 'theme-background')}>
            <div className={clsx('hero-head', 'overlay-layer')}>
              <header class="navbar">
                <div class="container">
                  <div class="navbar-brand">

                    <span class="navbar-burger" data-target="navbarMenuHeroC">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  </div>
                  <div id="navbarMenuHeroC" class="navbar-menu">
                    <div class="navbar-end">
                      {navButtons}
                      {/* <a class="navbar-item has-text-weight-bold"> Sign up </a>
                      <a class="navbar-item has-text-weight-bold"> Login </a> */}
                      <span class="navbar-item">
                      </span>
                    </div>
                  </div>
                </div>
              </header>
            </div>
            <div className={clsx('hero-body', 'columns')}>
              <div className={clsx('column', 'is-one-third')}>
              <div class="container has-text-centered">
                {/* <p class="title">1.2k downloads</p> */}
                 
              </div>
              </div>

              <div className={clsx('column', 'is-auto')}>
                <p className={clsx('title', 'has-text-warning', 'is-size-1', 'sulphur-point-bold')}>TrypSmart</p>
                <p className={clsx('mt-5')}></p>
                <p className={clsx('subtitle', 'has-text-white', 'pt-10')}><span><button className={clsx('button', 'is-warning', 'is-outlined', 'trypsmart-action-button','has-text-weight-bold')} onClick={handleCreatePost}>Create</button> </span><span className={clsx('ml-1','has-text-weight-light')}>and  download your instant travel checklist here.</span></p>
              </div>
              <div className={clsx('column','is-one-fifth')}>


                <div className={clsx('box', 'has-background-transparent', (user && user.isLoggedIn) ? 'hide-element' : '')}>
                  <aside className={clsx('menu', 'centeralignment')}>
                    <ul className="menu-list">
                      <li key={1} className={clsx('mb-5')}>
                        <button className={clsx('button', 'is-rounded', 'is-fullwidth', 'is-outlined')} onClick={handleLogin}>
                          <span className="icon-text">
                            <span className={clsx('icon','has-text-link')}>
                              <Icon path={mdiEmail} size={0.75}></Icon>
                            </span>
                            <span ><strong className={clsx('is-small', 'has-text-weight-medium', 'has-text-grey-dark')}>Login with email</strong></span>
                          </span>
                        </button>

                      </li>
                      {
                        !loadSignIn ? <li key={2}>

                          <div id="g_id_onload"
                            data-client_id={CONSTANTS.OAUTH_CLIENT_ID}
                            data-context="signin"
                            data-ux_mode="popup"
                            data-login_uri={socialLoginUrl}
                            data-auto_prompt="false">
                          </div>

                          <div class="g_id_signin"
                            data-type="standard"
                            data-shape="pill"
                            data-theme="outline"
                            data-text="continue_with"
                            data-size="large"
                            data-logo_alignment="left">
                          </div>

                        </li> : <li key={2}>

                          <div id="g_id_onload"
                            data-client_id={CONSTANTS.OAUTH_CLIENT_ID}
                            data-context="signin"
                            data-ux_mode="popup"
                            data-login_uri={socialLoginUrl}
                            data-auto_prompt="false">
                          </div>

                          <div class="g_id_signin"
                            data-type="standard"
                            data-shape="pill"
                            data-theme="outline"
                            data-text="continue_with"
                            data-size="large"
                            data-logo_alignment="left">
                          </div>

                        </li>
                      }

                    </ul>
                  </aside>

                </div>
                
              </div>
              <div className={clsx('is-one-third')}></div>
            </div>
          </section>
          <section className={clsx('hero',  'is-white','strip-background')}>
            <div class="hero-body">
              <div class="container has-text-centered">
                {/* <p class="title">1.2k downloads</p> */}
                <p class="is-5"> <span><Icon className={clsx('has-text-danger','mr-1')} path={mdiHeart} size={0.75}></Icon><span className={clsx('has-text-weight-bold')}>{downloads}</span> <span className={clsx('has-text-weight-light')}>downloads</span></span></p>
              </div>
            </div>
          </section>
          {
            //Header
          }
          {/* <Loader visible={navigateAway}/>
          <nav className={clsx('navbar','pr-4','pl-3','pt-1','pb-1','mb-1')} role="navigation" aria-label="main navigation">
            <div className={clsx('navbar-brand','')}>
              <a className="navbar-item" href="/">
                <figure className={clsx('image')}>
                  <img src="/basic_logo.png" width='48' height='48' />
                </figure>
                <p className={clsx('title', 'is-4', 'ml-4')}>
                  <strong className={clsx( 'has-text-weight-bold','logo-font')}>TrypSmart<span className={clsx('has-text-white', 'has-text-weight-normal')}></span></strong>
                </p>

              </a>

              <a role="button" className={clsx('navbar-burger', 'has-text-info', sidebar ? 'is-active' : '')} aria-label="menu" aria-expanded="false" data-target="navBarMenu" onClick={() => setSidebar(!sidebar)}>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </a>

            </div>

            <div className={clsx('navbar-menu', 'is-active')}>
              <div className={clsx('navbar-item', 'navbar-end', 'is-dark', 'is-expanded', 'is-align-items-center')}>
                <SearchBar className={clsx('ml-6')} onSearch={handleSearch} reset={displayState.mode === CONSTANTS.commandModes.SEARCH ? false : true} />
              </div>
              <div className="navbar-item navbar-end level-item is-expanded"> */}
          {/* <SearchBar onSearch={handleSearch} reset={displayState.mode===CONSTANTS.commandModes.SEARCH?false:true}/> */}

          {/* </div>
              <div className={'navbar-item'}>
                {navButtons}
              </div>
            </div>

          </nav> */}
          {/* <div className="columns is-gapless ">
            <div className="column is-2" />


            <div className="column is-hidden-mobile ml-2 mr-1 is-2">
              <div className={clsx('box', 'mt-2', 'mb-0', 'has-background-white', 'is-radiusless')}>



                <GenericCategories onSelectItem={handleGenericCategories} activeIndex={displayState.activeItem} reset={displayState.mode === CONSTANTS.commandModes.TRENDING || displayState.mode === CONSTANTS.commandModes.FRESH || displayState.mode === CONSTANTS.commandModes.POPULAR || displayState.mode === CONSTANTS.commandModes.MYLISTS || displayState.mode === CONSTANTS.commandModes.MYFEED || displayState.mode === CONSTANTS.commandModes.SAVED || displayState.mode === CONSTANTS.commandModes.BOOKMARKED ? false : true} />

              </div>

              <div className={clsx('box', 'pl-4', 'is-radiusless')}>
                <Categories onSelectItem={handleCategoryMenuItem} data={categoryData} activeIndex={displayState.activeItem} reset={displayState.mode === CONSTANTS.commandModes.CATEGORIES ? false : true} />
              </div>
            </div>
            <div className={clsx('column', 'mr-2', 'is-auto')}>
              <NavigationContext.Provider value={displayState}><DisplayArea command={displayState} /></NavigationContext.Provider>

            </div>
            <div className="column is-hidden-mobile is-2">
              <div className="box has-background-white mt-2">
                <aside className={clsx('menu', 'ceneralignment')}>
                  <ul className="menu-list">
                    <li key={1}>
                      <button className={clsx('button', 'is-info', 'is-rounded', 'thin-border-button')} onClick={handleCreatePost}>
                        <span className="icon-text">
                          <span className="icon">
                            <Icon path={mdiPlus} size={1}></Icon>
                          </span>
                          <span><strong>Create my travel checklist</strong></span>
                        </span>
                      </button>

                    </li>


                  </ul>
                </aside>

              </div>


              {<div className={clsx('box', 'has-background-white', 'mt-2', (user && user.isLoggedIn) ? 'hide-element' : '')}>
                <aside className={clsx('menu', 'centeralignment')}>
                  <ul className="menu-list">
                    <li key={1} className={clsx('mb-5')}>
                      <button className={clsx('button', 'is-rounded', 'is-fullwidth', 'is-outlined', 'thin-border-button')} onClick={handleCreatePost}>
                        <span className="icon-text">
                          <span className="icon">
                            <Icon path={mdiEmail} size={0.75}></Icon>
                          </span>
                          <span ><strong className={clsx('is-small', 'has-text-weight-medium', 'has-text-grey-dark')}>Login with email</strong></span>
                        </span>
                      </button>

                    </li>
                    {
                      !loadSignIn?<li key={2}>
                      
                      <div id="g_id_onload"
                        data-client_id={CONSTANTS.OAUTH_CLIENT_ID}
                        data-context="signin"
                        data-ux_mode="popup"
                        data-login_uri={socialLoginUrl}
                        data-auto_prompt="false">
                      </div>

                      <div class="g_id_signin"
                        data-type="standard"
                        data-shape="pill"
                        data-theme="outline"
                        data-text="continue_with"
                        data-size="large"
                        data-logo_alignment="left">
                      </div>

                    </li>:<li key={2}>
                      
                      <div id="g_id_onload"
                        data-client_id={CONSTANTS.OAUTH_CLIENT_ID}
                        data-context="signin"
                        data-ux_mode="popup"
                        data-login_uri={socialLoginUrl}
                        data-auto_prompt="false">
                      </div>

                      <div class="g_id_signin"
                        data-type="standard"
                        data-shape="pill"
                        data-theme="outline"
                        data-text="continue_with"
                        data-size="large"
                        data-logo_alignment="left">
                      </div>

                    </li>
                    }
                    
                  </ul>
                </aside>

              </div>}
            </div>
            <div className={clsx('column', 'is-2')} />
          </div> */}
        </div>
      </div>




      <Footer />
    </div>
  )
}
