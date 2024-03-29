import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';

import { onOpenNotification } from './notificationHandler';

class LocalPushNotificationService {
    configure = () => {
        PushNotification.configure({
            onRegister: function (token) {
                console.log("[LocalNotificationService] onRegister: ", token);
            },
            onNotification: function (notification) {
                console.log("[LocalNotificationService--hande] onNotification: ", notification.data);
                if (!notification?.data) {
                    return;
                }
                notification.userInteraction = true;
                onOpenNotification(Platform.OS === 'ios' ? notification.data.item : notification.data);

                if (Platform.OS === 'ios') {
                    // (required) Called when a remote is received or opened, or local notification is opened
                    notification.finish(PushNotificationIOS.FetchResult.NoData);
                }
            },

            // IOS ONLY (optional): default: all - Permissions to register
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             * - if you are not using remote notification or do not have Firebase installed, use this:
             *     requestPermissions: Platform.OS === 'ios'
             */
            requestPermissions: true,

        });
    }

    unregister = () => {
        PushNotification.unregister();
    }

    showNotification = (id, title, message, data = {}, options = {}) => {
        PushNotification.localNotification({
            // Android Only Properties
            ...this.buildAndroidNotification(id, title, message, data, options),
            // iOS and Android Properties
            ...this.buildIOSNotification(id, title, message, data, options),
            title: title,
            message: message,
            playSound: options.playSound || false,
            soundName: options.soundName || 'default',
            userInteraction: false
        });
    }

    buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
        return {
            id,
            autoCancel: true,
            largeIcon: options.largeIcon || 'ic_launcher',
            smallIcon: options.smallIcon || 'ic_notification',
            bigText: message || '',
            subText: title || '',
            vibrate: options.vibrate || true,
            vibration: options.vibration || 300,
            priority: options.priority || 'high',
            importance: options.importance || 'high',
            data
        };
    }

    buildIOSNotification = (id, title, message, data = {}, options = {}) => {
        return {
            alertAction: options.alertAction || 'view',
            category: options.category || '',
            userInfo: {
                id,
                item: data
            }
        }
    }

    cancelAllLocalNotifications = () => {
        if (Platform.OS === 'ios') {
            PushNotificationIOS.removeAllDeliveredNotifications();
        } else {
            PushNotification.cancelAllLocalNotifications();
        }
    }

    removeDeliveredNotificationByID = (notificationId) => {
        console.log('[LocalNotificationService] removeDeliveredNotificationByID: ', notificationId);
        PushNotification.cancelLocalNotifications({ id: `${notificationId}` });
    }

}

export const localNotificationService = new LocalPushNotificationService();