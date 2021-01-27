import api from '../../handle/api';
import { endpoints } from '../../constant/endpoints';

const convertObj2Params = (obj) => {
    if (obj) {
        return str = "?" + Object.keys(obj).map(function (prop) {
            return [prop, obj[prop]].map(encodeURIComponent).join("=");
        }).join("&");
    }
    return '';
}

const getCouse = (params) => {
    const stringParams = convertObj2Params(params);
    console.log('stringParams----', stringParams)
    return api.get('courses', endpoints.BASE_URL_COURSE);

}

export {
    getCouse,
}