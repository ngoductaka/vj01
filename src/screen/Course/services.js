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
    return api.get('courses'+stringParams, endpoints.BASE_URL_COURSE);
}
const getDetailCourse = courseId => {
    return api.get(`courses/${courseId}/detail`, endpoints.BASE_URL_COURSE);
}

const getMyCourses = () => api.get(`courses/users/my-course`, endpoints.BASE_URL_COURSE);

export {
    getCouse, getMyCourses,
    getDetailCourse,
}