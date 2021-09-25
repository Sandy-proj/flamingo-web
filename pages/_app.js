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


function MyApp({ Component, pageProps }) {

  //Initialize the page.
  const loginCheckUrl='/hopsapi/checklogin'

  const [loginStatus,setLoginStatus] = useState(buildGuestUser());
  const [errorCode,setErrorCode] = useState(CONSTANTS.NO_ERROR)
  const [displayState,setDisplayState]=useState({mode:(loginStatus.isLoggedIn?CONSTANTS.commandModes.MYFEED:CONSTANTS.commandModes.POPULAR),param:(loginStatus.isLoggedIn?loginStatus.id:'')});


  //Function to change the authentication status of the user. 
  const setLogin = (user)=>{ 
    setLoginStatus(user);
  }

  function handleDisplayStateChange(displayStateObject){
    setDisplayState(displayStateObject)
  }
  //Effect runs after when the user refreshes the page. 
  //It validates the user authorization status from the server and holds it in the global state.
  useEffect(async ()=>{
    if(!loginStatus.handshake){
      //Get the login status from the server and set it in context to be accessed by the pages. 
      try{
          const response = await axios.get(loginCheckUrl);
          if(response.data.status==='SUCCESS'){
         
            setLoginStatus(buildUser(response.data.id,response.data.role,response.data.preferences))        

          }else{
            setLoginStatus(buildGuestUser());
          }
        
      }catch(error){
        //On failure to communicate with the server.
        setErrorCode(CONSTANTS.FAILED_TO_CONNECT)
        
      }
      
    }
  },[loginStatus.handshake])

  const AuthorizedComponent = withAuthorization(Component)
  return <AuthorizationContext.Provider value={loginStatus}><AuthorizedComponent displayState={displayState} onDisplayStateChange={handleDisplayStateChange} error={errorCode} onLoginChange={setLogin} {...pageProps}/></AuthorizationContext.Provider>
 }
export default MyApp
