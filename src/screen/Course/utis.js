import { endpoints } from "../../constant/endpoints"

export const convertImgLink = (link) => {
    if (link && link.includes('http')) {
        return link;
    }
    return `${endpoints.BASE_COURSE_IMG}${link}`
}


export const convertPdfLink = (link) => {
    if (link && link.includes('http')) {
        return link;
    }
    return `${endpoints.BASE_COURSE_PDF}${link}`
}