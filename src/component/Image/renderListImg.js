import React, { useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { get } from 'lodash';

import { endpoints } from "../../constant/endpoints";

export const RenderListImg = ({ listImg, setVisible = () => { } }) => {
    if (!listImg || !listImg[0]) return null;
    if (listImg.length == 1) {
        return <RenderOne img={listImg[0]} setVisible={() => setVisible({ index: "0", data: listImg })} />
    } else if (listImg.length == 2) {
        return <RenderTwo listImg={listImg} setVisible={val => setVisible({ index: '' + val, data: listImg })} />
    } else {
        return (
            <View>
                <RenderOne img={listImg[0]} setVisible={() => setVisible({ index: "0", data: listImg })} />
                <RenderTwo listImg={[listImg[1], listImg[2]]} setVisible={val => setVisible({ index: '' + (val + 1), data: listImg })} />
            </View>
        )
    }
}

export const RenderOne = ({ img, setVisible }) => {
    return (
        <TouchableOpacity
            onPress={setVisible}
            style={{
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
        </TouchableOpacity>
    )
}

export const RenderTwo = ({ listImg, setVisible }) => {
    return (
        <View style={{ flexDirection: 'row' }}>
            {
                listImg.map((img, index) => {
                    return (
                        <TouchableOpacity
                            key={index + ''}
                            onPress={() => setVisible(index)}
                            style={{ flex: 1, }}>
                            <View
                                style={{
                                    overflow: 'hidden',
                                    borderRadius: 5,
                                    height: 200,
                                    flex: 1,
                                    marginLeft: index ? 10 : 0,
                                    marginVertical: 5,
                                    display: 'flex'
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
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    )
}