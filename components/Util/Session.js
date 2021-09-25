import { CONSTANTS } from "./Constants"
export function buildGuestUser(){
    return {
        isLoggedIn:false,
        role:CONSTANTS.ROLE.GUEST,
        handshake:true,
        id:-1,
        preferences:[]
    }
}
export function buildUser(id,role,preferences){
    if (id<=0){
        throw error('User not logged in.')
    }
    return {
        isLoggedIn:true,
        role:role,
        handshake:true,
        id:id,
        preferences:preferences
    }
}