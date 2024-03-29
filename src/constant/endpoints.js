const root = 'https://apps.vietjack.com:8081';
// const root = 'http://test.vietjack.com:8181';
// const root = 'http://45.124.87.227:8181';
export const endpoints = {
    BASE_URL: `${root}/api`,
    ROOT_URL: `${root}`,

    BASE_URL_COURSE: `${root}`,
    MEDIA_URL: 'https://media.vietjack.com:6969/',
    BASE_URL_EXAM: 'https://khoahoc.vietjack.com/mobile-api/v2/exam/',
    BASE_HOI_DAP: 'https://hoidap.vietjack.com',

    hoi_dap_api: 'https://hoidapvietjack.com',
    // hoi_dap_api: 'http://test.vietjack.com:8088',

    BASE_COURSE_IMG: 'https://khoahoc.vietjack.com/',
    BASE_COURSE_PDF: 'https://video.vietjack.com',

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

export const endpoints_ = {
    BASE_URL: 'http://45.124.87.227:8181/api',

    BASE_URL_COURSE: 'https://apps.vietjack.com:8181',
    MEDIA_URL: 'https://media.vietjack.com:6969/',
    BASE_URL_EXAM: 'https://khoahoc.vietjack.com/mobile-api/v2/exam/',
    BASE_HOI_DAP: 'https://hoidap.vietjack.com',
    BASE_COURSE_IMG: 'https://khoahoc.vietjack.com/',
    BASE_COURSE_PDF: 'https://video.vietjack.com',

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