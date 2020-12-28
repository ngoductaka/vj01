import { endpoints } from "../../constant/endpoints";
import api from "../../handle/api";

export const common_services = {
    getAppVersion,
    updateDeviceToken,
    postActiveDaily
}

async function postActiveDaily(body) {
    try {
        return await api.post(`${endpoints.ACTIVE_DAILY}`, body);
    } catch (error) {
        return error;
    }
}

async function getAppVersion() {
    try {
        return await api.get(`${endpoints.GET_APP_VERSION}`);
    } catch (error) {
        return error;
    }
}

async function updateDeviceToken(deviceToken, oldToken) {
    try {
        return await api.post(`${endpoints.UPDATE_DEVICE_TOKEN}`, {
            token: deviceToken,
            oldToken
        });
    } catch (error) {
        return error;
    }
}