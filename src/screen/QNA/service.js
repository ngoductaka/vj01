import api from '../../handle/api';


// const param = {
// type: (articles, ... hiện tại mới có articles)
// page: trang bài viết
// lesson_id : id bài học
// book_id : id quyển
// subject_id : id môn
// grade_id : id lớp
// }


const handleSearch = (keyword, param = {}) => {
    const query = Object.keys(param).reduce((car, cur) => {
        if (param[cur])
            return `${car}&${cur}=${param[cur]}`
        else return car;
    }, '')
    if (keyword)
        return api.get(`/elastic/search?type=question&q=${keyword}${query}`);
}

const handleLike = (id, data) => {
    return api.post(`/vote/question/${id}`, data)
}

const handleLikeAnwser = (id, data) => {
    return api.post(`vote/answer/${id}`, data)
    
}


const handleFollow = (questionID) => {
    return api.post(`question/follow/${questionID}`)
}

const handleReport = () => {
    
}

export const search_services = {
    handleSearch, handleLike, handleLikeAnwser,
    handleFollow, handleReport
}