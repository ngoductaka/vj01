export const endpoints = {

    // base url
    // BASE_URL: 'https://apps.vietjack.com:8081/api',
    BASE_URL: 'http://103.28.37.214:6969/api',
    BASE_URL_COURSE: 'http://103.28.37.214:6969',
    MEDIA_URL: 'https://media.vietjack.com:6969/',
    // BASE_URL:'https://testapps.vietjack.com:4443/api',
    BASE_URL_EXAM: 'https://khoahoc.vietjack.com/mobile-api/v2/exam/',
    BASE_HOI_DAP: 'https://hoidap.vietjack.com',

    PREFIX: {
        ACCOUNT: '/account',
        EXAM: '/exam',
    },

    // common
    GET_APP_VERSION: '/latest-version',
    LAST_LOGIN: '/users/last-login',
    ACTIVE_DAILY: '/users/active-daily',

    // account
    UPDATE_DEVICE_TOKEN: '/device-token',
    CREATE_NEW_TOKEN: '/create-new-token',
    SOCIAL_LOGIN: '/auth/social-login',
    LOG_OUT: '/logout',
}