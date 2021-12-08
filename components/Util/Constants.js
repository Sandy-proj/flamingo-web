 export class CONSTANTS {
    static  commandModes = {
        SEARCH:'Search',
        POPULAR:'Popular',
        TRENDING:'Trending',
        FRESH:'Fresh',
        MYFEED:'My Posts',
        SAVED:'Saved lists',
        BOOKMARKED:'Bookmarked',
        MYLISTS:'Saved',
        CATEGORIES:'Categories'
    }
    static PAGE_SIZE=10;
    static MAX_PAGES=3;
    static messageTypes = {
        SUCCESS :1,
        ERROR:2,
        PROGRESS:3,
        HIDDEN:4
    }
    static modes = {
        EDIT:1,
        VIEW:2,
        USE:3
    }
    static ROLE = {
        GUEST:'GUEST',
        REGISTERED:'REGISTERED',
        VERIFIED:'VERIFIED'
    }
    static ACTION_MENU = {
        EDIT:'Edit',
        SAVE:'Save',
        DOWNLOAD:'Download',
        LIKE:'Like',
        BOOKMARK:'Bookmark',
        SHOW_NUMBERS:'Show numbers',
        CLOSE:'Close',
        DELETE:'Delete',
        REMOVE:'Remove'
    }
    static NO_ERROR=0;
    static FAILED_TO_CONNECT=1;
    static SUCCESS='SUCCESS'
    static REQUEST_TIMEOUT=1000*60; //30 Seconds for a request timeout
    static SIGN_UP_URL = '/hopsapi/user/sign_up';
    static USER_NAME_AVAILABLE_URL = '/hopsapi/user/check_username_availability/'
    static EMAIL_VALIDATION_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    static PASSWORD_VALIDATION_PATTERN= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^()_])[A-Za-z\d@$!%*?&^()_]{8,}$/
    //static USERNAME_VALIDATION_PATTERN = /^[a-zA-Z0-9_]{5,}[a-zA-Z]+[0-9]*$/;(/^[a-zA-Z0-9_]{5,32}/)
    static USERNAME_VALIDATION_PATTERN = (/^[a-zA-Z0-9_]{5,32}$/);
    static GET_SUCCESS = 200;
    static POST_SUCCESS = 201;
    static ACCOUNT_VERIFICATION_URL='/hopsapi/user/verify_email';
    static VERIFICATION_REQUEST_URL='/hopsapi/user/resend_verification';
    static FORGOT_PASSWORD_URL = '/hopsapi/user/request_password_reset';
    static LOGIN_URL = '/hopsapi/user/login';
    static VERIFY_PASSWORD_RESET = '/hopsapi/user/verify_password'
    static RESET_PASSWORD_URL = '/hopsapi/user/update_password'
    static PROFILE_URL = '/hopsapi/user/user_profile'
    static USERNAME_UPDATE_URL = '/hopsapi/user/update_username'
    static GET_COMMENTS_URL = '/hopsapi/resources/comments'
    static POST_COMMENTS_URL = '/hopsapi/resources/addcomment'
    static DELETE_COMMENT_URL = '/hopsapi/resources/comment/delete'
    static HOPS_USERNAME_KEY='hops_username'
    static LIST_ITEM_MAX_LENGTH = 75;
    static LIST_ITEM_DETAIL_MAX_LENGTH = 240;
    static LIST_ITEM_TITLE_MAX_LENGTH = 100;
    static LIST_ITEM_LIMIT=100;
    static REQUEST_PARAM_KEY = 'param_k'
    static REQUEST_COOKIE_KEY = 'header_k'
    static LINK_TYPE = 'LINK'
    static TEXT_TYPE = 'TEXT'

    
    static OAUTH_CLIENT_ID = "788036490312-dnncf6lf0gj1h1qp8nnqeuri5ssksrp9.apps.googleusercontent.com"
    static HOPS_SOCIAL_URL = 'https://api.hopsquare.com/user/social_login'
    //static HOPS_SOCIAL_URL = '/socialapi/user/social_login'
    // static HOPS_SERVER_BASE='http://localhost:3001/'
    // static HOPS_WEB_SERVER_BASE='http://localhost:3000/'
    // static HOPS_GET_SERVER_RESOURCE='http://localhost:3001/resources/resource'
   


        static HOPS_SERVER_BASE='http://api.hopsquare.com/'
    static HOPS_WEB_SERVER_BASE='http://www.hopsquare.com/'
    static HOPS_GET_SERVER_RESOURCE='http://api.hopsquare.com/resources/resource'
}
