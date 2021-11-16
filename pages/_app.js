import withAuthorization from '../components/Util/Authorization'
import '../styles/globals.css'
import {useEffect, useImperativeHandle, useState} from 'react'
import '../styles/kandyjar_style.css'
import '../styles/utilities.css'
import axios from 'axios'
import { buildGuestUser,buildUser } from '../components/Util/Session'
import {CONSTANTS} from './../components/Util/Constants'
import '@mdi/font/css/materialdesignicons.min.css'
import { AuthorizationContext } from '../components/Util/AuthContext'
import clsx from 'clsx'
import UserNameDialog from '../components/ui/UserNameDialog'
import ErrorPage from '../components/ui/ErrorPage'


function MyApp({ Component, pageProps }) {

  //Initialize the page.
  const loginCheckUrl='/hopsapi/user/checklogin'
  const refreshAccessUrl = '/hopsapi/user/checklogin'

  const [loginStatus,setLoginStatus] = useState(buildGuestUser());
  const [errorCode,setErrorCode] = useState(CONSTANTS.NO_ERROR)
  const [displayState,setDisplayState]=useState({mode:(loginStatus.isLoggedIn?CONSTANTS.commandModes.MYFEED:CONSTANTS.commandModes.POPULAR),
                                                param:(loginStatus.isLoggedIn?loginStatus.id:'')});


  //Function to change the authentication status of the user. 
  const setLogin = (user)=>{ 
    //setLoginStatus(buildUser(user.id,user.role,{}));
    user.initiateHandshake = handleIntiateRequest;
    setLoginStatus(user)
  }



  //Try to refresh expired access using refresh token 
  async function handleIntiateRequest(hardRefresh){
 
    try{


      setInProgress(true)
      const response = await axios.get(loginCheckUrl+(hardRefresh?'?hard_refresh=true':''));
      
      var user = null;
      if(response.data.result==='SUCCESS'){

        if(response.data.data.userId===0){
          localStorage.setItem(CONSTANTS.HOPS_USERNAME_KEY,'')
          user = buildGuestUser();
        }else{
          localStorage.setItem(CONSTANTS.HOPS_USERNAME_KEY,response.data.data.username)
          user = buildUser(response.data.data.userId,response.data.data.role,response.data.data.preferences,response.data.data.username)
        }

         
      }else{

        localStorage.setItem(CONSTANTS.HOPS_USERNAME_KEY,'')
        user = buildGuestUser();
        
      }
      user.handshake=true;
      user.initiateHandshake = handleIntiateRequest;

      setLoginStatus(user);
    
  }catch(error){

    //On failure to communicate with the server.
    setErrorCode(CONSTANTS.FAILED_TO_CONNECT)
    setInProgress(false)
    
  }
  }



  function setInProgress(value){
    var userObject = Object.assign({},loginStatus);
    userObject.handshakeInProgress = value;
    userObject.initiateHandshake = handleIntiateRequest;
    setLoginStatus(userObject);
  }

  function handleDisplayStateChange(displayStateObject){
    setDisplayState(displayStateObject)
  }
  //Effect runs after when the user refreshes the page. 
  //It validates the user authorization status from the server and holds it in the global state.
  useEffect(async ()=>{
    if(!loginStatus.handshake){
      if(!loginStatus.handshakeInProgress){
        handleIntiateRequest();
      }
      //Get the login status from the server and set it in context to be accessed by the pages. 
     
      
    }
  },[loginStatus.handshake])


  //const AuthorizedComponent = withAuthorization(Component)
  //return <AuthorizationContext.Provider value={loginStatus}>{!loginStatus.handshake?<div className={clsx('container')}>Loading...</div>:<Component role={loginStatus.role} onError={setErrorCode} displayState={displayState} onDisplayStateChange={handleDisplayStateChange} error={errorCode} onLoginChange={setLogin} {...pageProps}/>}</AuthorizationContext.Provider>
  return <AuthorizationContext.Provider value={loginStatus}>
            <UserNameDialog onDeactivate={()=>{}}></UserNameDialog>
            <ErrorPage error={errorCode} onClose={setErrorCode}></ErrorPage>
            <Component role={loginStatus.role} onError={setErrorCode} displayState={displayState} onDisplayStateChange={handleDisplayStateChange} error={errorCode} onLoginChange={setLogin} {...pageProps}/>
        </AuthorizationContext.Provider> 
}
export default MyApp
