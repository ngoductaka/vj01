import React from 'react';
import { StatusBar, View, Text, TouchableOpacity, Image, Platform, SafeAreaView } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Header, Icon } from 'native-base';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

import { COLOR, fontSize } from '../../handle/Constant';
import { images } from '../../utils/images';
import { helpers, getCurrentDate } from '../../utils/helpers';
import { fontMaker } from '../../utils/fonts';

// #1.2.6

const NormalHeader = (props) => {
    const {
        navigation,
        onLeftAction = () => { navigation.navigate('Profile') },
        onPressSearch = () => { },
        onRightAccount = () => { }
    } = props;

    const userInfo = useSelector(state => state.userInfo);

    return (
        <View style={{ height: null }}>
			<StatusBar backgroundColor={'#fff'} barStyle='dark-content' />
            <LinearGradient
                colors={['#D34026', '#FB862B']}
                style={{ borderBottomLeftRadius: 48, borderBottomRightRadius: 48 }}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
                <View style={{ marginTop: helpers.isIOS ? (helpers.isIpX ? helpers.statusBarHeight : 10) : 2, paddingVertical: 15 }}>
                    <View style={{ paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', }}>
                        <TouchableOpacity style={{ width: 48, height: 48, borderRadius: 24, overflow: 'hidden', }} onPress={onLeftAction}>
                            {userInfo.logged_in ?
                                (
                                    userInfo.user.thumbnail ?
                                        <Image
                                            resizeMode="contain"
                                            style={{ flex: 1, width: null, height: null }}
                                            source={{
                                                uri: userInfo.user.thumbnail.includes('https') ? userInfo.user.thumbnail : `https://khoahoc.vietjack.com${userInfo.user.thumbnail}`,
                                                // priority: FastImage.priority.normal,
                                            }}
                                            // resizeMode={FastImage.resizeMode.cover}
                                        />
                                        :
                                        <View style={{ backgroundColor: '#97928F', flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                                            <Text style={{ color: 'white', fontSize: 20, ...fontMaker({ weight: 'Bold' }) }}>{userInfo.user.first_name && userInfo.user.first_name.charAt(0).toUpperCase()}</Text>
                                        </View>
                                )
                                :
                                (
                                    <View style={{ flex: 1, backgroundColor: 'white', padding: 3 }}>
                                        <Image
                                            source={images.logo_ios}
                                            style={{ flex: 1, width: null, height: null, resizeMode: 'contain' }}
                                        />
                                    </View>
                                )
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onPressSearch} style={{ backgroundColor: '#fff', flex: 1, paddingVertical: 4, borderRadius: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: 15 }}>
                            <Icon style={{ color: '#AAAAAA', fontSize: 26 }} name='search' />
                            <Text style={{ color: '#BABABA', marginLeft: 6, fontSize: 15, ...fontMaker({ weight: 'Light' }) }}>Xin chào, bạn muốn học gì nào? </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                        <Text style={{ fontSize: 15, color: 'white', ...fontMaker({ weight: 'Regular' }) }}>{getCurrentDate()}</Text>
                    </View>
                </View>
            </LinearGradient>
        </View>
    )
};

export default withNavigation(NormalHeader);