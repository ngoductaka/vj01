import api from "../../../handle/api"
// {
//     'bookmark_id' => 'required|integer',
//     'bookmark_type' => 'required|string',
// }
export const delBookmarks = (body) => {
    return api.delete('/users/bookmarks', body)
}