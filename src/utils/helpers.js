import { Platform, Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { isIphoneX, getStatusBarHeight, getBottomSpace } from 'react-native-iphone-x-helper';
import moment from 'moment';

const statusBarHeight = getStatusBarHeight();
const bottomSpace = getBottomSpace();
const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';
const isTablet = DeviceInfo.getModel().indexOf('iPad') > -1 || DeviceInfo.isTablet();
const isIpX = isIphoneX();

export const scrollToTop = (scrollRef) => {
    if (scrollRef.current && scrollRef.current.scrollResponderScrollTo) {
        scrollRef.current.scrollResponderScrollTo({ x: 0 })
    }
}

const openUrl = (url) => {
    Linking.canOpenURL(url)
        .then((supported) => {
            if (!supported) {
            } else {
                return Linking.openURL(url);
            }
        })
        .catch((err) => console.error('An error occurred', err));
}

export const removeDiacritics = (sen) => {
    return String(sen.normalize("NFD").replace(/[\u0300-\u036f]/g, "")).toLowerCase();
}

export const convertMoney = (number) => {
    try {
        return (number).toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$&.');
        //    return Number((number).toFixed(1)).toLocaleString()
        // return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'VND' }).format(number);
    } catch (err) {
        console.log('err convert num', err)
        return number
    }
}

export const getCurrentDate = () => {
    const currentTime = new Date();
    const day = currentTime.getDay() == 0 ? 'Chủ nhật' : 'Thứ ' + Number(currentTime.getDay() + 1);
    return day + ', ' + `ngày ${currentTime.getDate()} ` + `tháng ${currentTime.getMonth() + 1} ` + `tháng ${currentTime.getFullYear()}`;
}

const convertTime = (seconds) => {
    const h = parseInt(seconds / 3600);
    const m = parseInt(seconds / 60) - 60 * h;
    const s = parseInt(seconds % 60);
    // return ((h > 0 && (h < 10 ? ('0' + h + ':') : (h + ':')))
    return ((h > 0 ? (h + ':') : '')
        + ((m < 10) ? '0' + m : m)
        + ':' + (s < 10 ? '0' + s : s));
};

const generateCodeRandomly = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

const checkValidMail = value => {
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
};

const checkValidPhone = (phone) => {
    const regexPhone = new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/);
    return regexPhone.test(phone);
}

const checkBlankField = value => {
    return value.trim.length == 0;
};


const objNoData = (obj) => {
    for (var key in obj) {
        if (obj[key] !== null && obj[key] != "")
            return true;
    }
    return false;
}

const convertNum = (view) => {
    if (view < 1000) {
        return view
    } else if (view < 10000) {
        const k = Number(view / 1000).toFixed(2);
        return `${k}k`
    } else if (view < 100000) {
        const k = Number(view / 1000).toFixed(1);
        return `${k}k`
    } else if (view < 1000000) {
        const k = Number(view / 1000).toFixed(0);
        return `${k}k`
    } else {
        const k = Number(view / 1000000).toFixed(2);
        return `${k}m`
    }
}

const default_name = ['Jack cần cù', 'Jack chăm chỉ', 'Jack năng động', 'Jack hồn nhiên', 'Jack yêu đời', 'Jack giỏi giang'];

const randomName = () => {
    const index = Math.floor(Math.random() * default_name.length);
    return default_name[index];
}

const convertIndex = (index) => {
    if (index < 10) return '0' + index;
    return index;
}

export const getDiffTime = (time, now = moment()) => {
    const diffMonth = now.diff(moment(time), "month")
    if (diffMonth) return `${diffMonth} tháng`;

    const diffday = now.diff(moment(time), "days")
    if (diffday) return `${diffday} ngày`;

    const diffHours = now.diff(moment(time), "hours")
    if (diffHours) return `${diffHours} giờ`;

    const diffMinutes = now.diff(moment(time), "minutes")
    if (diffMinutes > 1) return `${diffMinutes} phút`;
    return "Vừa xong"

    // const diffSecond = now.diff(moment(time), "seconds")
    // if (diffSecond) return `${diffSecond} giây`;

    // if(diffSecond< 1)

    // return `0 giây`

}

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const changeTimeView = (time) => {
    console.log('-as-a-s-as-a-s', time);
    const temp = new Date(time.replace(/-/g, '/'));
    const now = Date.now();
    const diffTime = now - temp;
    if (new Date().getDate() - temp.getDate() == 1) {
        let tempHour = temp.getHours();
        if (tempHour < 10) {
            tempHour = '0' + tempHour;
        }
        let tempMin = temp.getMinutes();
        if (tempMin < 10) {
            tempMin = '0' + tempMin;
        }
        return `Hôm qua, lúc ${tempHour}:${tempMin}`;
    } else if (new Date().getDate() == temp.getDate() && diffTime < 24 * 60 * 60 * 1000) {
        if (diffTime < 60 * 60 * 1000) {
            return `${Math.floor(diffTime / (60 * 1000))} phút trước`;
        } else {
            return `${Math.floor(diffTime / (60 * 60 * 1000))} giờ trước`;
        }
    }
    const dayTemp = (temp.getDate() >= 0 && temp.getDate() < 10) ? '0' + temp.getDate().toString() : temp.getDate().toString();
    const hourTemp = (temp.getHours() >= 0 && temp.getHours() < 10) ? '0' + temp.getHours().toString() : temp.getHours().toString();
    const minTemp = (temp.getMinutes() >= 0 && temp.getMinutes() < 10) ? '0' + temp.getMinutes().toString() : temp.getMinutes().toString();
    return `Ngày ${dayTemp}-${(temp.getMonth() + 1).toString()}, lúc ${hourTemp}:${minTemp}`;
}

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}


export const helpers = {
    getRandom,
    statusBarHeight,
    bottomSpace,
    isIOS,
    isTablet,
    isIpX,
    convertTime,
    openUrl,
    generateCodeRandomly,
    checkValidMail,
    checkValidPhone,
    checkBlankField,
    objNoData,
    convertNum,
    isAndroid,
    convertIndex,
    randomName,
    capitalizeFirstLetter,
    changeTimeView,
    default_name
}
