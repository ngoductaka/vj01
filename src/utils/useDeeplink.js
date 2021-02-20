import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import { helpers } from './helpers';

export const useDeepLink = (navigation) => {
    useEffect(() => {
        console.log('===deep link====')
        Linking
            .getInitialURL()
            .then(url => {
                console.log('url getInitialURL', url)
                handleOpenURL({ url })
            })
            .catch(console.error);

        Linking.addEventListener('url', val => {
            console.log('val addEventListener', val)
            handleOpenURL(val)
        });

        // if (helpers.isAndroid) {
        //     Linking.getInitialURL().then(url => {
        //         navigate(url);
        //     });
        // } else {
        //     Linking.addEventListener('url', handleOpenURL);
        // }
        return () => {
            Linking.removeEventListener('url', handleOpenURL);
        }

    }, []);

    const handleOpenURL = (event) => { // D
        navigate(event.url);
    }
    const navigate = (url) => { // E
        try {
            const route = url.replace(/.*?:\/\//g, '');
            const [_, screen, id, id1] = route.split('/');
            if (screen == 'lesson') {
                if (id == 'question') {
                    navigation.navigate("QuestionDetail", { questionId: id1, });
                } else {
                    navigation.navigate('Lesson', { articleId: id })
                }
            } else if (screen == 'test') {
                navigation.navigate('OverviewTest', {
                    idExam: id,
                    title: 'Thi online',
                    // icon: get(book, 'icon_id'),
                    // subject: get(book, 'title'),
                    // lessonId: lessonId,
                    time: '_',
                    count: '_',
                })

            }
        } catch (err) {
            console.log('=========err link', err)
        }
    }
}