
import React, { useState, useEffect, memo } from 'react';
import { View, ActivityIndicator, Image } from 'react-native';
import FastImage from 'react-native-fast-image';

const FastImg = ({ height, width, uri, index = 0 }) => {
    const [showImg, setShowImg] = useState(false);
    useEffect(() => {
        setTimeout(() => { setShowImg(true) }, index * 20);
    }, []);
    return (
        <View style={{ height, width }}>
            {showImg ?
                <Image
                    resizeMode="contain"
                    style={{ flex: 1 }}
                    source={{
                        uri,
                        // priority: FastImage.priority.low 
                    }}
                // resizeMode={FastImage.resizeMode.contain}
                />
                :
                <ActivityIndicator />
            }
        </View>
    );
};

export default FastImg;