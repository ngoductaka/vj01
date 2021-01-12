import React from 'react';
import { StyleSheet, TouchableOpacity, View, } from 'react-native';
import { Icon } from 'native-base';



import { GradientText } from '../shared/GradientText';
import { fontMaker, fontStyles } from '../../utils/fonts';


export const HeaderBarWithBack = ({ text = 'Khoá học', RightCom = null, leftAction = () => { } }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>

            <TouchableOpacity
                onPress={leftAction}
                style={{
                    padding: 8,
                }}
            >
                <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 20, }}>
                    <Icon type='AntDesign' name='arrowleft' style={{ fontSize: 26, color: 'rgba(0, 0, 0, 0.7)' }} />
                </View>
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center', marginRight: 10 }}>
                <GradientText
                    colors={['#955DF9', '#aaa4f5', '#aaa4f5', '#aaa4f5']}
                    style={styles.headerText}
                >{text}</GradientText>
            </View>
            {RightCom && RightCom}
        </View>
    )
}


const HeaderBar = ({ text = 'Khoá học', RightAction = () => { } }) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
            <GradientText
                colors={['#955DF9', '#aaa4f5', '#aaa4f5', '#aaa4f5']}
                style={styles.headerText}
            >{text}</GradientText>

            {/* <View style={{ flexDirection: 'row' }}> */}
            <TouchableOpacity onPress={RightAction} style={{ padding: 8, borderRadius: 40, height: 40, width: 40, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' }}>
                <Icon style={{ fontSize: 19 }} name="bell" type="FontAwesome5" />
            </TouchableOpacity>
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
    },
})

export default HeaderBar;