import React from 'react';
import {
    View, Text, SafeAreaView, StyleSheet,
    Image, Dimensions, ImageBackground, FlatList
} from 'react-native';
import { Icon, Tab, Tabs, Toast, } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { get } from 'lodash';

import { TollBar, handleImgLink } from './com/com';
import { Colors } from '../../utils/colors';
import { useRequest } from '../../handle/api';
import RenderData, { RenderDataJson } from '../../component/shared/renderHtmlQuestion';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { COLOR } from '../../handle/Constant';
import { getDiffTime } from '../../utils/helpers';


const { width } = Dimensions.get('screen');

const UserProfile = (props) => {
    const userId = props.navigation.getParam('userId', '');
    const _handleBack = () => {
        props.navigation.goBack();
    }
    const [userData, err, loading] = useRequest(`qa-user/profile/${userId}`, [userId]);


    return (
        <SafeAreaView style={styles.container}>
            <View style={{ backgroundColor: '#dfdf' }}>
                <LinearGradient start={{ x: 1, y: 0 }} end={{ x: 0.1, y: 1 }} colors={['rgba(153, 143, 255, .8)', '#A27BFC', '#7e73eb', 'rgba(39, 17, 250, 0.7)']}>
                    <ImageBackground source={require('../../public/image/top_right_1.png')} style={{
                        // height: helpers.isIpX ? 295 : 270,
                        // paddingTop: helpers.isIpX ? 10 : 20
                    }}>
                        <TollBar icon="close" leftAction={_handleBack} text="" />
                        <View style={{ alignItems: 'center', marginBottom: 50 }}>
                            <User uri={get(userData, 'data.avatar', '')} />
                            <Text style={{
                                marginTop: 10, fontSize: 23,
                                color: '#fff', fontWeight: 'bold'
                            }}>{get(userData, 'data.name', '')}</Text>
                        </View>
                    </ImageBackground>
                </LinearGradient>
            </View>
            <View style={{}}>
                <View style={{
                    position: 'absolute',
                    top: -20,
                    // display: 'flex', 
                    // justifyContent: 'center',
                    // alignItems: 'center',
                    // backgroundColor: 'red',
                    width: width
                }}>
                    <View style={[{

                        // display: '',
                        flexDirection: 'row',
                        // marginTop: 50,
                        backgroundColor: '#fff',
                        justifyContent: 'space-between',
                        marginHorizontal: 35,
                        borderRadius: 10,
                        padding: 10,
                        paddingHorizontal: 20,
                        // width: width * 2 / 3,
                    }, styles.shadowStyle]}>
                        <View style={{ alignItems: 'center' }}>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <Icon name="heart" style={{ fontSize: 15, color: 'red' }} />
                                <Text style={{ fontSize: 16, color: 'red' }}>{get(userData, 'data.love_count', '')}</Text>
                            </View>
                            <Text style={{ color: '#333', marginLeft: 4 }}>Yêu thích</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: 'red', fontSize: 16, }}>{get(userData, 'data.point', '')}</Text>
                            <Text style={{ color: '#333' }} >Điểm</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <Icon type="MaterialCommunityIcons" name="podium-gold" style={{ fontSize: 15, color: 'red' }} />
                                <Text style={{ fontSize: 16, marginLeft: 4, color: 'red' }}>{get(userData, 'data.level', '')}</Text>
                            </View>
                            <Text style={{ color: '#333' }}>Xếp hạng</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ marginTop: 60, flex: 1, }}>
                <Tabs
                    // onChangeTab={(e) => setCurrentTab(e.i)}
                    // page={currentTab}
                    tabContainerStyle={{ height: 33, borderTopWidth: 0, borderTopColor: 'white', elevation: 0 }}
                    tabBarUnderlineStyle={{ height: 2, backgroundColor: Colors.pri }}
                    tabBarActiveTextColor={Colors.pri} tabBarBackgroundColor={Colors.white}
                >
                    <Tab
                        textStyle={styles.textStyle}
                        activeTextStyle={styles.activeTextStyle}
                        activeTabStyle={styles.activeTabStyle}
                        tabStyle={styles.tabStyle}
                        heading="Đã trả lời"
                    >
                        <View style={{ flex: 1, paddingTop: 20 }}>
                            {/* <Text>asdf - -asdf</Text> */}
                            <FlatList
                                data={get(userData, 'data.list_answer', [])}
                                renderItem={({ item, index }) => {
                                    if(item.question_status == 0) return null;
                                    // console.log('itemitemitem', item.question_status)
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (item.question_status == 0) {
                                                    Toast.show('Câu hỏi đã bị xoá do vi phạm')
                                                } else {
                                                    props.navigation.navigate('QuestionDetail', { questionId: item.question_id, contentQuestion: '' })
                                                }
                                            }}
                                            style={{
                                                paddingHorizontal: 8, marginBottom: 15,
                                            }}
                                        >
                                            <View style={{
                                                overflow: 'hidden',
                                                backgroundColor: '#f9f9f9'
                                            }}>
                                                <RenderDataJson indexItem={index} content={item && item.content && item.content.slice(0, 2) || ''} />
                                            </View>
                                            <View style={{ marginTop: 8 }}>
                                                <Text style={{ textAlign: 'right', marginBottom: 5, color: COLOR.MAIN }}>
                                                    <Text style={{ color: '#222', paddingRight: 10 }}>{getDiffTime(item.timestamp)} trước   </Text>
                                                    xem chi tiết >
                                                </Text>
                                            </View>

                                        </TouchableOpacity>
                                    )
                                }}
                                keyExtractor={({ item, index }) => `${index}`}
                            />
                        </View>

                    </Tab>
                    <Tab
                        textStyle={styles.textStyle}
                        activeTextStyle={styles.activeTextStyle}
                        activeTabStyle={styles.activeTabStyle}
                        tabStyle={styles.tabStyle}
                        heading="Đã Hỏi"
                    >
                        <View style={{ paddingTop: 20 }}>
                            <FlatList
                                data={get(userData, 'data.list_question', [])}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (item.question_status == 0) {
                                                    Toast.show('Câu hỏi đã bị xoá do vi phạm')
                                                } else {
                                                    props.navigation.navigate('QuestionDetail', { questionId: item.id, contentQuestion: '' })
                                                }
                                            }}
                                            style={{ paddingHorizontal: 8, marginBottom: 15, borderBottomColor: '#dedede', borderBottomWidth: 1 }}
                                        >
                                            <View style={{
                                                overflow: 'hidden',
                                                backgroundColor: '#f9f9f9'
                                            }}>
                                                <RenderDataJson indexItem={index} content={item && item.content && item.content.slice(0, 2) || ''} />
                                            </View>
                                            <View style={{ marginTop: 8 }}>
                                                <Text style={{ textAlign: 'right', marginBottom: 5, color: COLOR.MAIN }}>
                                                    <Text style={{ color: '#222', paddingRight: 10 }}>{getDiffTime(item.timestamp)} trước   </Text>
                                                xem chi tiết >
                                            </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}
                                keyExtractor={({ item, index }) => `${index}`}
                            />
                        </View>
                    </Tab>
                </Tabs>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    shadowStyle: { shadowColor: 'black', shadowOffset: { width: -2, height: 2 }, shadowOpacity: 0.6, elevation: 2 },

    // container: { flex: 1 },
    tabContainerStyle: {
        backgroundColor: Colors.white,
    },
    activeTabStyle: {
        backgroundColor: Colors.white,
    },
    tabStyle: {
        backgroundColor: Colors.white,
    },
    textStyle: {
        fontSize: 18,
        color: '#000'
    },
    activeTextStyle: {
        fontSize: 19,
        paddingVertical: 3,
        color: Colors.pri,
        textTransform: 'none'
    },
    // section: { ...fontMaker({ weight: 'Bold' }), fontSize: 18, marginVertical: 7, marginTop: 10 },

})



const userStyle = StyleSheet.create({
    imgWapper: {
        height: width / 3, width: width / 3,
        borderRadius: width / 3,
        // overflow: 'hidden',
        marginHorizontal: 5,
        // alignItems: 'center'
        // justifyContent
    },
    imgLargeWapper: {
        height: width / 3, width: width / 3,
        borderRadius: width / 3,
        // overflow: 'hidden',
        marginHorizontal: 5,
        // alignItems: 'center'
        // justifyContent
    },
    userCount: {
        height: 25,
        // width: 25,
        paddingHorizontal: 5,
        borderRadius: 25,
        // overflow: 'hidden',
        marginHorizontal: 5,
        // alignItems: 'center'
        // justifyContent
    },
    img: { flex: 1, borderRadius: width / 3 },

    userComment: {
        flexDirection: 'row',
        marginTop: 7,
    }
})
const userImg = "https://www.xaprb.com/media/2018/08/kitten.jpg";


const User = ({ style = {}, uri }) => {
    return (
        <View style={[userStyle.imgLargeWapper, style]} >
            <Image style={[userStyle.img, {}]} source={{ uri: handleImgLink(uri) }} />
            <View style={{ backgroundColor: '#fff', position: 'absolute', right: -3, bottom: -3, borderRadius: 10 }}>
                {/* <Icon style={{ color: 'green', fontSize: 15, fontWeight: 'bolid' }} name="check-circle" type="FontAwesome" /> */}
            </View>
        </View>
    )
}
export default UserProfile;