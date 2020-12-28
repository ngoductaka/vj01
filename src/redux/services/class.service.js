import api from '../../handle/api';

export const class_services = {
    getAllSubjectsInClass
}

function getAllSubjectsInClass(cls) {
    return api.get(`/subjects?grade_id=${cls}`);
}