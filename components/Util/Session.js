import { CONSTANTS } from "./Constants"
export function buildGuestUser(){
    return {
        isLoggedIn:false,
        role:CONSTANTS.ROLE.GUEST,
        handshake:false,
        id:-1,
        preferences:[],
        handshakeInProgress:false
    }
}
export function buildUser(id,role,preferences){
    if (id<=0){
        throw new Error('User not logged in')
    }
    return {
        isLoggedIn:true,
        role:role,
        handshake:true,
        id:id,
        preferences:preferences,
        handshakeInProgress:false
    }
}