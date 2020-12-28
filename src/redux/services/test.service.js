import api from '../../handle/api';

export const test_services = {
    getTestDashboard,
    handleSubmitExam
}

function getTestDashboard(exam_id) {
    return api.get(`/exams/${exam_id}/dashboard`);
}

function handleSubmitExam(exam_id, body) {
    return api.post(`/exams/${exam_id}`, body);
}

