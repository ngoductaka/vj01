import React, { useCallback } from 'react';
import {
    View, Text, SafeAreaView, StyleSheet,
    TouchableOpacity, FlatList, Image
} from 'react-native';
import { Icon } from 'native-base';
import Toast from 'react-native-simple-toast';
import { get } from 'lodash';


import { GradientText } from '../../component/shared/GradientText';
import { useRequest } from '../../handle/api';
import { getDiffTime } from '../../utils/helpers';
import { handleImgLink } from './com/com';


const userImg = "https://www.xaprb.com/media/2018/08/kitten.jpg";

const Notication = (props) => {
    const _handleBack = useCallback(() => {
        props.navigation.goBack();
    }, []);

    const _renderNotiItem = useCallback(({ item, index }) => {
        return <NotiItem
            item={item}
            onPress={() => {
                if (item.question_status) {
                    props.navigation.navigate('QuestionDetail', { questionId: item.question_id })
                } else {
                    Toast.show('Câu hỏi không khả dụng')
                }
            }
            } />
    }, []);
    const [data, loading, err] = useRequest('notification/show', [1]);
    // console.log('datadatadatadata', data)

    return (
        <SafeAreaView style={styles.container}>
            <TollBar leftAction={_handleBack} />
            <View style={styles.content}>
                <FlatList
                    data={get(data, 'data', [])}
                    renderItem={_renderNotiItem}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ marginTop: 50 }}>Bạn chưa có thông báo </Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 10,
    }
});


const TollBar = ({ text = 'Thông báo', leftAction, icon = 'close', iconStyle = {} }) => {
    return (
        <View style={headerStyles.container}>
            {
                leftAction ?
                    <TouchableOpacity onPress={leftAction}>
                        <Icon type='AntDesign' name={icon} style={[{ marginLeft: 8 }, iconStyle]} />
                    </TouchableOpacity> : null
            }
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
                <GradientText
                    colors={['#955DF9', '#aaa4f5', '#aaa4f5', '#aaa4f5']}
                    style={headerStyles.headerText}
                >{text}</GradientText>
            </View>
        </View>
    )
}

const headerStyles = StyleSheet.create({
    container: {
        flexDirection: 'row', alignItems: 'center',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
    },
    headerText: {
        paddingVertical: 5,
        fontSize: 27,
        marginTop: 4,
    }
});


const NotiItem = ({ item, index, onPress }) => {
    return (
        <View style={styleNoti.container}>
            <View>
                <User uri={item.avatar} isCheck={['1', '2'].includes(item.role_id)} />
            </View>
            <TouchableOpacity onPress={onPress} style={styleNoti.content}>
                <Text style={styleNoti.textContent} numberOfLines={2}>{item.content} </Text>
                <Text style={styleNoti.time}>{getDiffTime(item.timestamp)}</Text>
            </TouchableOpacity>
        </View>
    )
};

const styleNoti = StyleSheet.create({
    container: {
        paddingVertical: 10,
        borderBottomWidth: 1, borderBottomColor: '#ddd',
        flexDirection: 'row',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        marginRight: 5,
        marginLeft: 10,
        // alignItems: ''
    },
    textContent: {
        fontSize: 14,
        color: '#333',
        marginLeft: 5
        // textTransform: ''
    },
    textTitle: {
        fontSize: 17,
        color: '#333',
        // textTransform: ''
    },
    time: {
        color: '#888',
        fontSize: 12,
        marginLeft: 5
    }
})

const userStyle = StyleSheet.create({
    imgWapper: {
        height: 30, width: 30,
        borderRadius: 30,
        // overflow: 'hidden',
        marginHorizontal: 5,
        // alignItems: 'center'
        // justifyContent
    },
    imgLargeWapper: {
        height: 40, width: 40,
        borderRadius: 40,
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
    img: { flex: 1, borderRadius: 25 },

    userComment: {
        flexDirection: 'row',
        marginTop: 7,
    }
})


const User = ({ style = {}, uri, isCheck }) => {
    return (
        <View style={[userStyle.imgLargeWapper, style]} >
            <Image style={[userStyle.img, {}]} source={{ uri: handleImgLink(uri) }} />
            {isCheck ? <View style={{ backgroundColor: '#fff', position: 'absolute', right: -3, bottom: -3, borderRadius: 10 }}>
                <Icon style={{ color: 'green', fontSize: 15, fontWeight: 'bolid' }} name="check-circle" type="FontAwesome" />
            </View>: null}
        </View>
    )
}

export default Notication;