import api from './api';
import { endpoints } from '../constant/endpoints';

const headers = {
    'Content-Type': 'multipart/form-data'
}

const uploadImage = (data) => {
    
    return api.post(endpoints.MEDIA_URL+'api/question/upload', data, headers)
};

export default {
    uploadImage,
}