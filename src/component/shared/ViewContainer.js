import React, { useState, useRef } from 'react';
import {
    View, ScrollView, Text, StyleSheet, Dimensions, TouchableOpacity, Image, StatusBar
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { withNavigation } from 'react-navigation';

import { Loading } from '../../handle/api';
import { Icon } from 'native-base';
import { images } from '../../utils/images';
import { COLOR, fontSize } from '../../handle/Constant';
import { helpers } from '../../utils/helpers';
import { fontMaker, fontStyles } from '../../utils/fonts';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const ViewContainer = (props) => {

    const { isLoading, style, contentStyle = { padding: 10 }, isHome = false, err, LoadingCom, navigation, children, headerView, title = 'Trang chủ', showRight = true, showLeft = false, onLeft = () => navigation.goBack(), percent = '70%' } = props;

    const [showHeader, setShowHeader] = useState(null);
    const classRef = useRef(null);

    const _onScroll = (event) => {
        const currentOffset = event.nativeEvent.contentOffset.y;
        if (currentOffset > 60) {
            if (!showHeader) setShowHeader(true);
        } else {
            if (showHeader) setShowHeader(false);
        }
    }
    return (
        <View style={[{ flex: 1, backgroundColor: 'white' }, style]}>
            <StatusBar
                backgroundColor={'#fff'}
                barStyle="dark-content"
            />
            <View style={styles.container}>
                <Loading isLoading={isLoading} err={err} com={LoadingCom}>
                    <ScrollView
                        ref={classRef}
                        contentContainerStyle={contentStyle}
                        style={{ flex: 1 }}
                        scrollEventThrottle={120}
                        onScroll={_onScroll}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* {!isHome &&
                            <Animatable.View animation="slideInRight" style={{ position: 'absolute', top: 0, right: 0, width: width / 2, height: 200 }}>
                                <Image
                                    source={images.header2}
                                    style={{ flex: 1, width: null, height: null, resizeMode: 'cover' }}
                                />
                            </Animatable.View>
                        } */}
                        {headerView}
                        {children}
                    </ScrollView>
                    {!isHome ?
                        (
                            <>
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center',
                                    position: 'absolute', backgroundColor: showHeader ? 'white' : 'transparent',
                                    width: '100%',
                                    // paddingVertical: helpers.isIOS ? 8 : 3,
                                    paddingHorizontal: 20, paddingTop: helpers.isIOS ? helpers.statusBarHeight : 0,
                                }}>
                                    {showLeft ?
                                        <TouchableOpacity
                                            onPress={onLeft}
                                            style={[styles.searchHeader, showHeader ? {} : styles.shadow, { shadowColor: 'rgba(0, 0, 0, 0.08)', marginLeft: -10, marginTop: helpers.isIOS ? 2 : 0 }]}>
                                            <Icon type='MaterialCommunityIcons' name={'arrow-left'} style={{ fontSize: 26, color: '#836AEE' }} />
                                        </TouchableOpacity>
                                        :
                                        <View style={{ width: 40, marginTop: 50 }} />
                                    }
                                    {
                                        showHeader ?
                                            <Animatable.View animation='fadeIn'
                                                style={{
                                                    flex: 1, paddingHorizontal: 15, justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                <Text numberOfLines={1}
                                                    style={{
                                                        ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 20,
                                                    }}>{title}</Text>
                                            </Animatable.View> : null}

                                    <View style={{ width: 40, marginTop: 50 }} />
                                </View>
                            </>
                        )
                        :
                        (
                            showHeader ?
                                <View style={{
                                    flexDirection: 'row', alignItems: 'center', position: 'absolute',
                                    backgroundColor: showHeader ? 'white' : 'transparent',
                                    width: '100%',
                                    paddingHorizontal: 20,
                                    paddingTop: helpers.isIOS ? helpers.statusBarHeight : 0,
                                }}>
                                    {
                                        showHeader === true ?
                                            <Animatable.View animation='fadeIn' style={{ flex: 1, paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                                                <Text numberOfLines={1} style={{ ...fontMaker({ weight: fontStyles.SemiBold }), fontSize: 20 }}>{title}</Text>
                                            </Animatable.View>
                                            : null
                                    }
                                </View>
                                :
                                null
                        )
                    }
                </Loading>
            </View>
        </View >
    )
}



const styles = StyleSheet.create({
    appleButton: {
        width: '100%',
        paddingVertical: 20,
        marginTop: 15
    },
    container: {
        flex: 1,
    },
    searchHeader: {
        width: 40, height: 40,
        borderRadius: 20,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'white',
    },
    shadow: {
        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 10,
        shadowOffset: { width: 12, height: 13 },
    },
    btn: { marginTop: 20, flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 20, borderRadius: 25, },
})

export default withNavigation(ViewContainer);

