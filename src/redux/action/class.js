import { GET_LIST_SUBJECTS } from "../constants";

export const actGetListSubjects = (data) => {
    return ({
        type: GET_LIST_SUBJECTS,
        data
    });
}
