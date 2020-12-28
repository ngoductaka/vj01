import api from '../../handle/api';

export const search_services = {
    handleSearch,
}
// const param = {
// type: (articles, ... hiện tại mới có articles)
// page: trang bài viết
// lesson_id : id bài học
// book_id : id quyển
// subject_id : id môn
// grade_id : id lớp
// }


function handleSearch(keyword, param) {
    const query = Object.keys(param).reduce((car, cur) => `${car}&${cur}=${param[cur]}`, '')
    if (keyword)
        return api.get(`/elastic/search?q=${keyword}${query}`);
}

