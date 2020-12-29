import React from 'react';
import {View, Image} from 'react-native';
import { get } from 'lodash';

import { endpoints } from "../../constant/endpoints";

export const RenderListImg = ({ listImg }) => {
    if (!listImg || !listImg[0]) return null;
    if (listImg.length == 1) {
        return <RenderOne img={listImg[0]} />
    } else if (listImg.length == 2) {
        return <RenderTwo listImg={listImg} />
    } else {
        return (
            <View>
                <RenderOne img={listImg[0]} />
                <RenderTwo listImg={[listImg[1], listImg[2]]} />
            </View>
        )

    }
};

export const RenderOne = ({ img }) => {
    return (
        <View style={{
            overflow: 'hidden',
            borderRadius: 5,
            height: 200,
            flex: 1,
            marginVertical: 5
        }}>
            <Image
                resizeMode='cover'
                source={{ uri: `${endpoints.MEDIA_URL}${get(img, 'path', '')}` }}
                style={{
                    height: null,
                    width: null,
                    flex: 1
                }}
            />
        </View>
    )
}

export const RenderTwo = ({ listImg }) => {
    return (
        <View style={{ flexDirection: 'row' }}>
            {
                listImg.map((img, index) => {
                    return (
                        <View
                            key={index + ''}
                            style={{
                                overflow: 'hidden',
                                borderRadius: 5,
                                height: 200,
                                flex: 1,
                                marginLeft: index ? 10:0,
                                marginVertical: 5
                            }}>
                            <Image
                                resizeMode='cover'
                                source={{ uri: `${endpoints.MEDIA_URL}${get(img, 'path', '')}` }}
                                style={{
                                    height: null,
                                    width: null,
                                    flex: 1
                                }}
                            />
                        </View>
                    )
                })
            }
        </View>
    )
}