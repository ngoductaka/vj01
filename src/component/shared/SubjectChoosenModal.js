import React from 'react';
import {
    Text,
    Platform,
    View,
    TouchableOpacity,
    Dimensions,
    FlatList,
} from 'react-native';
import ModalBox from 'react-native-modalbox';
import LottieView from 'lottie-react-native';

import MenuItem, { NUMBER_COLUMS } from '../../component/menuItem';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { mapTestIcon, mapImg } from '../../utils/images';

const { width } = Dimensions.get('window');

export const SubjectChoosenModal = (props) => {
    const {
        show = false, onClose = () => { }, showCancel = true,
        isLoadingClass, onCloseSubject, errLoadingClass, listSubjectInClass, handleSelectSubject
    } = props;
    return (
        <ModalBox
            onClosed={onClose}
            isOpen={show}
            animationDuration={300}
            coverScreen={true}
            backdropPressToClose={!!showCancel}
            swipeToClose={!!showCancel}
            backdropColor='rgba(0, 0, 0, .7)'
            style={{ width: width, height: null, borderTopLeftRadius: 25, borderTopRightRadius: 25, overflow: 'hidden' }}
            position='bottom'
        >
            <View
                style={{
                    backgroundColor: 'white',
                    padding: 20,
                    maxHeight: 3 * Dimensions.get('window').height / 4,
                    marginBottom: getBottomSpace()
                }}
            >
                <Text style={{ color: '#282828', fontSize: 20, fontWeight: '600' }}>Chọn Môn</Text>
                <View style={{ paddingTop: 30, paddingBottom: 10 }}>
                    {!errLoadingClass ?

                        <FlatList
                            data={listSubjectInClass}
                            style={{ marginTop: 5 }}
                            showsVerticalScrollIndicator={false}
                            numColumns={NUMBER_COLUMS}
                            renderItem={({ item, index }) => {
                                return _renderMenuItem(item, index, handleSelectSubject);
                            }}
                            ListEmptyComponent={() => {
                                if (isLoadingClass) {
                                    return <LottieView
                                        autoPlay
                                        loop
                                        style={{ width: 195, height: 195, alignSelf: 'center' }}
                                        source={require('../../public/201-simple-loader.json')}
                                    />
                                }
                                return <View style={{ height: 200 }}>
                                    <Text style={{ color: 'black', fontSize: 20, alignSelf: 'center' }}>Tài liệu đang được biên soạn ...</Text>
                                </View>
                            }}
                            keyExtractor={(item, index) => 'class' + index}
                        />
                        : <View>
                            <LottieView
                                autoPlay
                                loop
                                style={{ width: 205, height: 205, alignSelf: 'center', marginBottom: 20 }}
                                source={require('../../public/5401-loading-19-satellite-dish.json')}
                            />
                            <TouchableOpacity onPress={onCloseSubject} style={{ alignSelf: 'center', borderWidth: 1, borderRadius: 8, borderColor: 'rgba(0, 0, 0, 0.4)', paddingHorizontal: 30, paddingVertical: 6 }}>
                                <Text style={{ color: 'black', fontSize: 20, }}>Thử lại</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>
        </ModalBox>
    );
}

const _renderMenuItem = (menuItem, index, handleNavigation) => {
    return (
        <MenuItem
            title={menuItem.title}
            // icon={mapTestIcon[menuItem.icon_id]}
            icon={menuItem.icon_id}
            index={index}
            onPressItem={() => handleNavigation(menuItem)}
        />
    )
}