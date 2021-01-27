import { endpoints } from "../../constant/endpoints"

export const convertImgLink = (link) => {
    if (link && link.includes('http')) {
        console.log('------link', link)
        return link;
    }
    return `${endpoints.BASE_COURSE_IMG}${link}`
}