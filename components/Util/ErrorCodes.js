export class CommonErrorCodes{
    static  AUTH={
        USER_NOT_FOUND : '000',
        BAD_CREDENTIALS:'001',
        LOGIN_EXPIRED:'002',
        UNAUTHORIZED:'003'

    }
    static  USER={
        EMAIL_ID_UNAVAILABLE:'004',
        USERNAME_UNAVAILABLE:'005',
        FAILED_TO_CREATE:'006',
        EMAIL_HANDSHAKE_FAILURE:'007',
        PASSWORD_HANDSHAKE_FAILURE:'008',
        FAILED_MAIL_DELIVERY:'009',
        FAILED_VERIFICATION:'010',
        VERIFICATION_EXPIRED:'011',
        NOT_FOUND:'012',
        UNAUTHORIZED:'013',
        INVALID_EMAIL_ID:'014',
        TOO_MANY_REQUESTS:'015',
        INVALID_PASSWORD:'016',
        INVALID_USERNAME:'017'
    }
    // static readonly AUTH_FAIL='000';
    // static readonly MAIL_DELIVERY_ERROR='001';
    // static readonly USER_CREATION_ERROR='002';
    // static readonly BAD_CREDENTIALS = '003';
    // static readonly EMAIL_ID_UNAVAILABLE = '004';
    // static readonly CREDENTIAL_PARSING_ERROR='005';
    // static readonly EMAIL_VERIFICATION_SET_UP_FAILURE = '006';
    // static readonly PASSWORD_VERIFICATION_SET_UP_FAILURE = '007';
    // static readonly AUTHENTICATION_ISSUE_EXCEPTION='008'
}