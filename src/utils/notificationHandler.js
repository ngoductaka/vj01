import firebase from 'react-native-firebase';
import { get } from 'lodash';
import { useSelector } from 'react-redux';

import NavigationService from '../Router/NavigationService';
import { saveItem, KEY, getItem } from '../handle/handleStorage';
import { common_services, user_services } from '../redux/services';
import { localNotificationService } from './notificationServices'
import { helpers } from './helpers';
import api from '../handle/api';

//1
export const _checkPermission = async () => {
    firebase.messaging().hasPermission()
        .then(enabled => {
            if (enabled) {
                _getToken();
            } else {
                _requestPermission();
            }
        });
}

//2
export const _requestPermission = async () => {
    firebase.messaging().requestPermission()
        .then(() => {
            _getToken();
        })
        .catch(error => {
            // console.log('permission rejected');
        });
}

//3
export const _getToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
        const saved_firebase_token = await getItem(KEY.firebase_token);
        if (saved_firebase_token != fcmToken) {
            saveItem(KEY.firebase_token, fcmToken);
            try {
                const result = await common_services.updateDeviceToken(fcmToken, saved_firebase_token);
                console.log('result-------', result);
            } catch (error) {
                console.log(error);
            }
        }
    }
}

export const _createAndroidNotificationChannel = () => {
    const channel = new firebase.notifications.Android.Channel('vietjack-jsmile-channel-stg-test', 'Test Channel', firebase.notifications.Android.Importance.Max)
        .setDescription('My apps test channel');

    firebase.notifications().android.createChannel(channel);
}
export const _createNotificationListeners = async () => {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    firebase.notifications().onNotification((notification) => {
        // Alert.alert(title, body);
        const { title, body } = notification;
        const options = {
            soundName: 'default',
            playSound: true
        };
        console.log('foreground=======', notification.data)

        localNotificationService.showNotification(
            0,
            notification.title,
            notification.body,
            notification.data,
            options
        );

        // if (Platform.OS === 'android') {
        //     const localNotification = new firebase.notifications.Notification({
        //         sound: 'default',
        //         show_in_foreground: true,
        //     })
        //         .setNotificationId(notification.notificationId)
        //         .setTitle(notification.title)
        //         .setSubtitle(notification.subtitle)
        //         .setBody(notification.body)
        //         .setData(notification.data)
        //         .android.setChannelId('vietjack-jsmile-channel-stg-test') // e.g. the id you chose above
        //         // .android.setSmallIcon('ic_stat_notification') // create this icon in Android Studio
        //         .android.setColor('#000000') // you can set a color here
        //         // .android.setLargeIcon(get(notification, 'data.logo_right_side', 'https://apps.vietjack.com:8081/logo_icon.png'))
        //         .android.setLargeIcon('https://apps.vietjack.com:8081/logo_icon.png')

        //         // .android.setAutoCancel(true)
        //         // .android.setLargeIcon(icon)
        //         // .android.setBigPicture('https://apps.vietjack.com:8081/logo_icon.png')
        //         .android.setPriority(firebase.notifications.Android.Priority.High);

        //     firebase.notifications()
        //         .displayNotification(localNotification)
        //         .catch(err => console.error('12231wec3e23', err));

        // } else {
        // }
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    firebase.notifications().onNotificationOpened((notificationOpen) => {
        console.log('=====1111111', notificationOpen)
        console.log('=====2222222', get(notificationOpen, 'notification.data', ''))
        console.log('=====3333333', get(notificationOpen, 'notification.data.item', ''))
        handleData(Platform.OS === 'ios' ? get(notificationOpen, 'notification.data', '') : get(notificationOpen, 'notification.data', ''))
        // handleData()
        /*
        * Triggered for data only payload in foreground
        * */
        // firebase.messaging().onMessage((message) => {
        //     //process data message
        //     console.log(message, '=====================aaaadddaaa1111--------', message);
        // });
    });


    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        // console.log('11111------', Platform.OS === 'ios' ? get(notificationOpen, 'notification.data', '') : get(notificationOpen, 'notification.data', ''))

        handleData(Platform.OS === 'ios' ? get(notificationOpen, 'notification.data', '') : get(notificationOpen, 'notification.data', ''));
        // handleData()
        /*
        * Triggered for data only payload in foreground
        * */
        // firebase.messaging().onMessage((message) => {
        //     //process data message
        //     console.log('=====================aaaaaa2222--------', JSON.stringify(message));
        // });
    }
}



const data1 = {
    "logo_right_side": "http://app-vietjack-server-v2.deve/logo_icon.png",
    "redirect_to": "{\"lesson\": {\"id\": 5359, \"parts\": [{\"id\": 408990, \"partable\": {\"id\": 40795, \"title\": \"Trả lời câu hỏi Toán 12 Giải tích Bài 2 trang 13\"}, \"lesson_id\": 5359, \"partable_id\": 40795, \"partable_type\": \"App\\\\Models\\\\Article\"}], \"title\": \"Bài 2: Cực trị của hàm số\", \"book_id\": 110, \"menu_item_id\": 8532}}",
    "score": "850", "time": "2020-10-20 16:28:55"
}


const data2 = {
    "google.delivered_priority": "normal",
    "google.original_priority": "normal",
    "logo_right_side": "http://app-vietjack-server-v2.deve/logo_icon.png",
    "redirect_to": "{\"lesson\": {\"id\": 5554, \"parts\": [{\"id\": 419908, \"partable\": {\"id\": 3216, \"title\": \"17 câu trắc nghiệm: Cộng, trừ và nhân số phức có đáp án\"}, \"lesson_id\": 5554, \"partable_id\": 3216, \"partable_type\": \"App\\\\Models\\\\Exam\"}], \"title\": \"Bài 2 : Cộng, trừ và nhân số phức\", \"book_id\": 110, \"menu_item_id\": 8552}}",
    "score": "850", "time": "2020-10-20 16:20:41"
}

const data3 = {
    "google.delivered_priority": "normal",
    "google.original_priority": "normal",
    "logo_right_side": "http://app-vietjack-server-v2.deve/logo_icon.png",
    "redirect_to": "{\"lesson\": {\"id\": 5178, \"parts\": [{\"id\": 439942, \"partable\": {\"id\": 6547, \"title\": \"Giải SGK - Unit 2 City life - Getting started\", \"author\": {\"id\": 144993, \"name\": \"Cô Đỗ Lê Diễm Ngọc\"}, \"author_id\": 144993}, \"lesson_id\": 5178, \"partable_id\": 6547, \"partable_type\": \"App\\\\Models\\\\Video\"}], \"title\": \"Unit 2: City life\", \"book_id\": 61, \"menu_item_id\": 5191}}",
    "score": "850",
    "time": "2020-10-20 16:20:26"
}

const updateSeenStatus = async (notiId) => {
    try {
        const result = await api.post(`/notification/${notiId}/update-seen`);
        console.log('updateSeenStatus', result);
    } catch (error) {
        console.log('1212121212', error);
    }
}

// const handleData = (val = '') => {
const handleData = async (val_ = '') => {
    console.log('akjshdjkag000sdkasjkdgashjd', val_);
    try {
        // post user click
        const notiDataRaw = get(val_, 'notification', null);
        // console.log('la sao ta', notiDataRaw);
        let notiData = null;
        if (notiDataRaw) {
            notiData = JSON.parse(notiDataRaw);
        }
        if(val_.type == 'question') {
            NavigationService.navigate('QuestionDetail', {
                questionId: val_.question,
            })
        }
        // console.log('la sao ta 2222222', notiData);
        if (notiData && notiData.id) {
            const result = await user_services.postUserClickNoti({
                notification_id: get(notiData, 'id', null),
                type: null,//'article', // => 'nullable|string:article|exam|video',
                data: null//val_// => 'nullable',
            });
            console.log('-------1111---', result);
            updateSeenStatus(notiData.id);
            const streaming_link = get(notiData, 'streaming_link');
            if (streaming_link) {
                helpers.openUrl(streaming_link);
            }
        }

        const val = val_.redirect_to || val_.item.redirect_to;

        const dataDoc = JSON.parse(val);
        const data = get(dataDoc, 'lesson.parts[0]', {});

        if (data.partable_type.includes('Article')) {
            const { id, title } = data.partable || {};
            // NavigationService.navigate("Lesson", { articleId: id, lesson_id: get(dataDoc, 'lesson.id', '') })
            NavigationService.navigate("LessonOverview", {
                // key: item.url, subjectID, title: item.title
                lessonId: get(dataDoc, 'lesson.menu_item_id', ''),
            });

        } else if (data.partable_type.includes('Video')) {
            const { id, title } = data.partable || {};

            NavigationService.navigate('CoursePlayer', {
                lectureId: id,
            })

        } else if (data.partable_type.includes('Exam')) {
            const { id, title } = data.partable || {};
            NavigationService.navigate('OverviewTest', {
                idExam: id, title,
                lessonId: get(dataDoc, 'lesson.menu_item_id', ''),
                // time: get(item, 'partable.duration', 0),
                // count: get(item, 'partable.questions_count', 0),
                // source: 'LessonOverview'
            })
        }

    } catch (err) {
        console.log('-----err==', err)
    }

}


export const onOpenNotification = (val) => {
    console.log('val.item=====', get(val, 'item'), val);
    handleData(val.item || val);
    // handleData(data3.redirect_to);


    // if (Platform.OS === 'android') {
    //     console.log(val, '===========123sd123===========')
    //     const localNotification = new firebase.notifications.Notification({
    //         sound: 'default',
    //         show_in_foreground: true,
    //     })
    //         .setNotificationId(val.notificationId)
    //         .setTitle(val.title)
    //         .setSubtitle(val.subtitle)
    //         .setBody(val.body)
    //         .setData(val.data)
    //         .android.setChannelId('vietjack-jsmile-channel-stg-test') // e.g. the id you chose above
    //         // .android.setSmallIcon('ic_stat_notification') // create this icon in Android Studio
    //         .android.setColor('#000000') // you can set a color here
    //         // .android.setLargeIcon(get(notification, 'data.logo_right_side', 'https://apps.vietjack.com:8081/logo_icon.png'))
    //         .android.setLargeIcon('https://apps.vietjack.com:8081/logo_icon.png')

    //         // .android.setAutoCancel(true)
    //         // .android.setLargeIcon(icon)
    //         // .android.setBigPicture('https://apps.vietjack.com:8081/logo_icon.png')
    //         .android.setPriority(firebase.notifications.Android.Priority.High);

    //     firebase.notifications()
    //         .displayNotification(localNotification)
    //         .catch(err => console.error('12231wec3e23', err));

    // }

}