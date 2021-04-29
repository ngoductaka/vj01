import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, Keyboard, Dimensions, ScrollView } from 'react-native';
import { Icon } from 'native-base';
import { isEmpty, get } from 'lodash';
import HTML from 'react-native-render-html';
import { useSelector } from 'react-redux'
import Toast from 'react-native-simple-toast'

import { GradientText } from '../../../component/shared/GradientText';
import { fontMaker, fontStyles } from '../../../utils/fonts';
import Search from './com/Search';
import AutoComplete from './com/AutoComplete';
import api from '../../../handle/api';
import { useSound } from '../../../component/Sound'
// import { COLOR } from '../../../handle/Constant';
// import History from './com/History';
import { insertItem, KEY, useStorage, getItem } from '../../../handle/handleStorage';
import OptionView from './com/OptionView';
import HeaderSearch from './com/HeaderSearch';
import { COLOR } from '../../../handle/Constant';


const Dictionary = (props) => {
    const [searchText, setSearchText] = useState('');
    const [data, setData] = useState({});

    const [ukSound] = useSound(get(data, 'sounds.uk') ? `http://171.244.27.129:8088${get(data, 'sounds.uk')}` : null);
    const [usSound] = useSound(get(data, 'sounds.us') ? `http://171.244.27.129:8088${get(data, 'sounds.us')}` : null);

    const setPlay = (type) => {
        if (type = 'uk') {
            if (ukSound.isLoaded()) ukSound.play()
        } else {
            if (usSound.isLoaded()) usSound.play()
        }
    }

    const handleRequestSearch = (key) => {
        api.get('http://171.244.27.129:8088/api/find?query=' + key)
            .then(({ data }) => {
                if (data) {
                    setData(data);
                    getItem(KEY.HIS_DICTIONARY).then(historyDic => {
                        if (historyDic) {
                            const checkExit = historyDic.find(h => h.word === data.word)
                            if (!checkExit) insertItem(KEY.HIS_DICTIONARY, { word: data.word, suggest_text: data.suggest_text })
                        } else {
                            insertItem(KEY.HIS_DICTIONARY, { word: data.word, suggest_text: data.suggest_text })
                        }

                    })
                }
            })
    }

    const _handleSave = (data) => {

        getItem(KEY.SAVE_DICTIONARY).then(savedWord => {

            let checkExit = false;
            if (savedWord) checkExit = savedWord.find(h => h.word == data.word)
            else {
                insertItem(KEY.SAVE_DICTIONARY, {
                    word: data.word,
                    suggest_text: data.suggest_text,
                    pronounce: data.pronounce,
                    content_html: data.content_html,
                })
            }

            if (!checkExit) {
                insertItem(KEY.SAVE_DICTIONARY, {
                    word: data.word,
                    suggest_text: data.suggest_text,
                    pronounce: data.pronounce,
                    content_html: data.content_html,
                })
            }
        })
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                    onPress={() => props.navigation.goBack()}
                    style={[styles.shadow, styles.backBtn]}>
                    <Icon type='MaterialCommunityIcons' name={'arrow-left'} style={{ fontSize: 26, color: '#836AEE' }} />
                </TouchableOpacity>
                <GradientText colors={['#955DF9', '#aaa4f5', '#aaa4f5', '#aaa4f5']}
                    style={{ fontSize: 26, marginTop: 4, ...fontMaker({ weight: fontStyles.Bold }) }}
                >Từ điển</GradientText>
                <View style={{ width: 40 }} />
            </View>
            <View style={{ flex: 1 }}>
                <ScrollView style={{ paddingHorizontal: 15, marginTop: 80 }}>
                    {isEmpty(data) ?
                        <OptionView
                            setData={setData}
                            handleRequestSearch={handleRequestSearch}
                            setSearchText={setSearchText}
                            navigation={props.navigation}
                        // updateVal={}
                        />
                        :
                        <View>
                            <TouchableOpacity onPress={() => { setData(null) }}>
                                <Text style={{ alignSelf: 'center', marginBottom: -6 }}>
                                    <Icon style={{ fontSize: 19 }} name="down" type="AntDesign" />
                                </Text>
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{
                                        color: '#0a7be9',
                                        fontSize: 26,
                                        ...fontMaker({ weight: fontStyles.Bold }),
                                    }}>{data.word}</Text>
                                    <Text>{data.pronounce}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableOpacity onPress={() => _handleSave(data)} style={{
                                        marginRight: 10,
                                    }}>
                                        <Icon style={{ color: COLOR.MAIN }} name={0 ? "star" : "staro"} type="AntDesign" />
                                    </TouchableOpacity>
                                    <View>
                                        <TouchableOpacity
                                            style={{ flexDirection: 'row', alignItems: 'center' }}
                                            onPress={() => {
                                                setPlay('us')
                                            }}>
                                            <Icon type="AntDesign" name='sound' style={{ marginRight: 5 }} />
                                            <Text>US</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{ flexDirection: 'row', alignItems: 'center' }}
                                            onPress={() => {
                                                setPlay('uk')
                                            }}>
                                            <Icon type="AntDesign" name='sound' style={{ marginRight: 5 }} />
                                            <Text>UK</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View>
                                <HTML
                                    classesStyles={classesStyles}
                                    html={data.content_html}
                                    imagesMaxWidth={Dimensions.get('window').width - 45}
                                    containerStyle={{ paddingLeft: 10, paddingRight: 10 }}
                                    listsPrefixesRenderers={{ ul: () => null }}
                                />
                            </View>
                        </View>
                    }
                </ScrollView>
                <HeaderSearch setData={setData} initText={searchText} handleRequestSearch={handleRequestSearch} navigation={props.navigation} />
            </View>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    value: {
        color: "#fff",
        fontSize: 30,
        textAlign: "right",
        marginRight: 20,
        // marginBottom: 0
    },
    headClose: {
        alignSelf: 'center',
    },
    closeBtn: { fontSize: 25, color: '#111' },
    backBtn: {
        height: 40, width: 40, justifyContent: 'center', alignItems: 'center',
        borderRadius: 40, shadowColor: 'rgba(0, 0, 0, 0.08)', marginLeft: 7
    },
    shadow: {
        backgroundColor: '#FFFFFF',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 10,
        shadowOffset: { width: 12, height: 13 },
    },
    itemsFun: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 15, backgroundColor: '#fff', marginTop: 20,
        paddingHorizontal: 10, borderRadius: 10
    },
});


const classesStyles = {
    'sub-title': { textAlign: 'center', fontWeight: '800', color: 'red' },
    bold: {
        fontSize: 25, fontWeight: 'bold'
    },
    'color-light-blue': {
        color: '#1198b6', marginVertical: 4
    },
    'green': { borderLeftColor: '#c9dc29', borderLeftWidth: 5, paddingLeft: 5, fontSize: 20, marginVertical: 5 }
};
export default Dictionary;