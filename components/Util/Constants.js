 export class CONSTANTS {
    static  commandModes = {
        SEARCH:'Search',
        POPULAR:'Popular',
        TRENDING:'Trending',
        MYFEED:'Home',
        SAVED:'Saved',
        BOOKMARKED:'Bookmarked',
        MYLISTS:'My Lists'
    }
    static PAGE_SIZE=10;
    static MAX_PAGES=10;
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
    static REQUEST_TIMEOUT=1000*20; //20 Seconds for a request timeout
}