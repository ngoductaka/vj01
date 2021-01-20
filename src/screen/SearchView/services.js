import api from '../../handle/api';

const saveKeyword = (body) => api.post('search/keyword', body);

export {
    saveKeyword
}