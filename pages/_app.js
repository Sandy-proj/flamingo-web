import withAuthorization from '../components/Util/Authorization'
import '../styles/globals.css'
import {useEffect, useImperativeHandle, useState} from 'react'
import '../styles/kandyjar_style.css'
import '../styles/utilities.css'
import axios from 'axios'
import {CONSTANTS} from './../components/Util/Constants'
import '@mdi/font/css/materialdesignicons.min.css'


function MyApp({ Component, pageProps }) {
  const loginCheckUrl='/hopsapi/checklogin'

  const [loginStatus,setLoginStatus] = useState({isLoggedIn:false,role:CONSTANTS.ROLE.GUEST,handshake:false,userId:-1});
  const [checkLogin,setCheckLogin]=useState(false)

  const setLogin = ({isLoggedIn,role,userId})=>{ 
    //Cookie based authentication. 
    console.log('not here'+userId)
    setLoginStatus({isLoggedIn:isLoggedIn,role:role,handshake:loginStatus.handshake,userId:userId});



  }

  useEffect(async ()=>{
    console.log('need to shake hand!')
    if(!loginStatus.handshake){
      //Get the login status from the server. If loggedin set the login status, 
      try{
        console.log('shaking hand')
        const response = await axios.get(loginCheckUrl);
        console.log(response.data.isLoggedIn); 
        if(response.data.status==='SUCCESS'){
         
          setLoginStatus({isLoggedIn:response.data.isLoggedIn,role:response.data.role,handshake:true,userId:response.data.userId});
          
        }else{
          setLoginStatus({isLoggedIn:false,role:'GUEST',handshake:true,userId:-1});
        }
        
      }catch(error){
        console.log('error') 
      }
      
    }
  },[loginStatus.handshake])
  console.log('status = ' + loginStatus.isLoggedIn)

  const AuthorizedComponent = withAuthorization(Component);
  return <AuthorizedComponent setLogin={setLogin} loginStatus={loginStatus} {...pageProps} />
}
export default MyApp
