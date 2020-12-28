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
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

import { Icon, Card } from 'native-base';
import { fontMaker } from '../../utils/fonts';
import { helpers } from '../../utils/helpers';

export const ClassChoosenModal = (props) => {
    const { show = false, onClose = () => { }, showCancel = true, setCurrentClass = () => { }, isShowMore = false } = props;

    const current_class = useSelector(state => state.userInfo.class);

    return (
        <ModalBox
            onClosed={onClose}
            isOpen={show}
            animationDuration={300}
            coverScreen={true}
            backdropPressToClose={!!showCancel}
            swipeToClose={false}
            backdropColor='rgba(0, 0, 0, .7)'
            style={{ width: helpers.isTablet ? width * 4 / 5 : width, height: null, borderTopLeftRadius: 25, borderTopRightRadius: 25, overflow: 'hidden' }}
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
                <View style={styles.titleContainer}>
                    <Text style={{ color: '#282828', fontSize: 20, fontWeight: '600' }}>Chọn Lớp</Text>
                    {showCancel &&
                        <TouchableOpacity onPress={onClose}>
                            <Icon name='ios-close' style={{ fontSize: 36, color: '#ACACAC' }} />
                        </TouchableOpacity>
                    }
                </View>
                <FlatList
                    data={[3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    renderItem={({ item, index }) => {
                        return (
                            <Card
                                style={[
                                    styles.classItem,
                                    index % 2 === 0 && { marginRight: 20 },
                                    current_class == item && { backgroundColor: '#FC8023' },
                                    { borderColor: current_class == item ? '#FC8023' : '#D8D8D8' }
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() => setCurrentClass(item)}
                                    style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', paddingVertical: Platform.OS === 'ios' ? 11 : 9, }}
                                >
                                    <Text style={{ fontSize: Platform.OS === 'ios' ? 17 : 15, color: current_class == item ? 'white' : '#292526', ...fontMaker({ weight: 'SemiBold' }) }}>Lớp {item}</Text>
                                </TouchableOpacity>
                            </Card>
                        );
                    }}
                    keyExtractor={(item, index) => 'class' + index}
                />
                {isShowMore ?
                    <View>
                        <Text style={{ color: '#282828', fontSize: 20, fontWeight: '600', marginTop: 20 }}>Luyện Thi Chuyển Cấp</Text>
                        <View style={{ marginVertical: 20 }}>
                            <Card style={[styles.extendClass, current_class === 12 && { backgroundColor: '#FC8023' }, { borderColor: current_class === 12 ? '#FC8023' : '#D8D8D8' }]}>
                                <TouchableOpacity
                                    onPress={() => setCurrentClass(12)}
                                    style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: Platform.OS === 'ios' ? 11 : 9, }}
                                >
                                    <Text style={{ fontSize: Platform.OS === 'ios' ? 17 : 15, color: current_class === 12 ? 'white' : '#292526', fontWeight: '500', }}>Luyện Thi Vào Lớp 10</Text>
                                </TouchableOpacity>
                            </Card>
                            <Card style={[styles.extendClass, current_class === 12 && { backgroundColor: '#FC8023' }, { borderColor: current_class === 12 ? '#FC8023' : '#D8D8D8' }]}>
                                <TouchableOpacity
                                    onPress={() => setCurrentClass(12)}
                                    style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: Platform.OS === 'ios' ? 11 : 9, }}
                                >
                                    <Text style={{ fontSize: Platform.OS === 'ios' ? 17 : 15, color: current_class === 12 ? 'white' : '#292526', fontWeight: '500' }}>Luyện Thi THPT Quốc Gia</Text>
                                </TouchableOpacity>
                            </Card>
                        </View>
                    </View>
                    : null}
            </View>
        </ModalBox>
    );
}

const styles = {
    titleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    classItem: {
        borderWidth: 1.5,
        flex: 1,
        marginBottom: 20,
        borderRadius: 10
    },
    extendClass: {
        borderWidth: 1.5,
        marginBottom: 20,
        borderRadius: 10
    },
}