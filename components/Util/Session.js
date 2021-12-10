import { CONSTANTS } from "./Constants"
export function buildGuestUser(){
    return {
        isLoggedIn:false,
        role:CONSTANTS.ROLE.GUEST,
        handshake:false,
        id:-1,
        preferences:[],
        handshakeInProgress:false,
        username:'-'
    }
}
export function buildUser(id,role,preferences,username){
    if (id<=0){
        throw new Error('User not logged in')
    }
    return {
        isLoggedIn:true,
        role:role,
        handshake:true,
        id:id,
        preferences:preferences,
        handshakeInProgress:false,
        username:username
    }
}

export function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    //console.log('cookie string'+decodedCookie)
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        //console.log('csrf:'+c.substring(name.length,c.length))
        return c.substring(name.length, c.length);
      }
    } 
    return "";
  }


  export function isValidUrl(url){
    const urlPattern = /^(?:(?:https):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
    return urlPattern.test(url)
  }

  export function getTimeString(timestamp){
    const timeString = new Date(timestamp);
    const nowString = new Date();
    let elapsedTime = Math.floor((nowString.getTime()-timeString.getTime())/1000);
    if(elapsedTime>0&&elapsedTime<60){
      return elapsedTime+'s ago'
    }else if(elapsedTime>60&&elapsedTime<3600){
      return Math.floor(elapsedTime/60)+'m ago'
    }else if(elapsedTime>3600 && elapsedTime<3600*24){
      elapsedTime = Math.floor(elapsedTime/(3600));
      return elapsedTime+(elapsedTime>1?' hrs ago':' hr ago')
    }else if(elapsedTime>(3600*24)&&elapsedTime<(3600*24*30)){
      elapsedTime = Math.floor(elapsedTime/(3600*24));
      return elapsedTime + (elapsedTime>1?'days ago':'day ago'); 
    }else{
      return timeString.toDateString()
    }

    
  }