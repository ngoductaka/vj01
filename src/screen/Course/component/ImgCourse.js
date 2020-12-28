import React from 'react';
import {
    View,
    Image,
} from 'react-native';
import FastImage from 'react-native-fast-image';


const ImgCourse = ({ style = {} }) => {
    return (
        <View>
            <Image
                style={[{ height: 200 }, style]}
                resizeMode={'stretch'}
                // resizeMode="contain"
                source={{
                    uri: 'https://khoahoc.vietjack.com/upload/admin@vietjack.com/course/webpnet-resizeimage-22-1574410558.png',
                }}
            />
        </View>
    )
}

export {
    ImgCourse
}