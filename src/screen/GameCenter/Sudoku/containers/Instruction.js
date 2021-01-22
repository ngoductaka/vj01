'use strict';

import { Header, Icon } from 'native-base';
import React, { Component } from 'react';

import {
    StyleSheet,
    View,
    Text,
    Pressable,
} from 'react-native';
import { COLOR } from '../../../../handle/Constant';
import { fontMaker, fontStyles } from '../../../../utils/fonts';

import LinearGradient from 'react-native-linear-gradient';

class SudokuInstruction extends Component {

    state = {

    }

    render() {
        return (
            <View style={styles.container} >
                <LinearGradient style={{ flex: 1 }} colors={['#6C4F6A', '#9B5D74']} >
                    <Header style={styles.header}>
                        <Pressable onPress={() => {
                            this.props.navigation.state.params.callback();
                            this.props.navigation.goBack();
                        }} style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }} >
                            <Icon name='arrow-back' type='Ionicons' style={{ color: COLOR.white(1), fontSize: 30 }} />
                        </Pressable>
                        <Text style={{ fontSize: 20, color: COLOR.white(1), ...fontMaker({ weight: fontStyles.SemiBold }) }}>Hướng dẫn</Text>
                        <View style={{ width: 50 }} />
                    </Header>
                    <View style={{ flex: 1, padding: 20 }}>
                        <Text style={{ color: COLOR.white(1), fontSize: 16, ...fontMaker({ weight: fontStyles.Regular }), lineHeight: 28 }}>
                            - Những điều bạn cần làm là điền kín những ô còn lại với điều kiện:
                        </Text>
                        <Text style={{ color: COLOR.white(1), fontSize: 16, ...fontMaker({ weight: fontStyles.Regular }), lineHeight: 28, marginLeft: 15 }}>
                            * Các hàng ngang: Phải có đủ các số từ 1 đến 9, không trùng số và không cần đúng thứ tự.
                        </Text>
                        <Text style={{ color: COLOR.white(1), fontSize: 16, ...fontMaker({ weight: fontStyles.Regular }), lineHeight: 28, marginLeft: 15 }}>
                            * Các hàng dọc: Đảm bảo có đủ các số từ 1-9, không trùng số, không cần theo thứ tự.
                        </Text>
                        <Text style={{ color: COLOR.white(1), fontSize: 16, ...fontMaker({ weight: fontStyles.Regular }), lineHeight: 28, marginLeft: 15 }}>
                            * Mỗi vùng 3 x 3: Phải có đủ các số từ 1-9 và không trùng số nào trong cùng 1 vùng 3 x3.
                        </Text>
                    </View>
                </LinearGradient>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        width: '100%',
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0,
        backgroundColor: '#6C4F6A',
        elevation: 0,
        borderBottomColor: 'transparent'
    }
});


export default SudokuInstruction;
