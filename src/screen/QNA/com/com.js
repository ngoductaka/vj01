import React, { useState } from 'react';
import {
    View, FlatList, Text, StyleSheet, Platform,
    TouchableOpacity, Dimensions, Image, ScrollView,
    SafeAreaView,
} from 'react-native';
import { Icon } from 'native-base';
import { fontMaker, fontStyles } from '../../../utils/fonts';
import { GradientText } from '../../../component/shared/GradientText';
import { endpoints } from '../../../constant/endpoints';


const userImg = "https://www.xaprb.com/media/2018/08/kitten.jpg";

const TollBar = ({ text = 'Hỏi đáp', leftAction, icon = 'ios-arrow-back', iconStyle = {} }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {
                leftAction ?
                    <TouchableOpacity onPress={leftAction}>
                        <Icon name={icon} style={[{ marginLeft: 8 }, iconStyle]} />
                    </TouchableOpacity> : null
            }
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
                <GradientText
                    colors={['#955DF9', '#aaa4f5', '#aaa4f5', '#aaa4f5']}
                    style={styles.headerText}
                >{text}</GradientText>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerText: {
        paddingVertical: 5,
        // textAlign: 'center',
        fontSize: 20,
        fontSize: 26,
        marginTop: 4,
        ...fontMaker({ weight: fontStyles.Bold })
    }
})


const handleImgLink = (link) => {
    try {
        if (!link) return "https://www.xaprb.com/media/2018/08/kitten.jpg"
        return link.includes('http') ? link : endpoints.BASE_HOI_DAP + link;
    } catch (err) {
        return link;
    }
}




export {
    TollBar,
    handleImgLink,
}