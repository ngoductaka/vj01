import { GET_ALL_SCREENS_FOR_ADS, GET_LIST_SUBJECTS } from "../constants";

export const actGetListSubjects = (data) => {
    return ({
        type: GET_LIST_SUBJECTS,
        data
    });
}

export const actGetAllScreensForAds = (data) => {
    return ({
        type: GET_ALL_SCREENS_FOR_ADS,
        data
    });
}
