import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, Keyboard, TouchableOpacity } from 'react-native';
import Search from './Search';
import AutoComplete from './AutoComplete';


const HeaderSearch = ({ handleRequestSearch, navigation, initText }) => {

    const [searchText, setSearchText] = useState('');
    const [showAutoComplete, setIsShowAuto] = useState('');

    const handleSaveSearchingKey = useCallback((val) => {
        handleRequestSearch(val)
    }, [])

    useEffect(() => {
        setSearchText(initText);
        handleRequestSearch(initText);
        setIsShowAuto(false)
    }, [initText])

    return (
        <View style={{ height: 65, marginTop: 15, position: 'absolute', left: 0, right: 0 }}>
            <Search
                setIsBlank={() => { setSearchText(''), setIsShowAuto(false) }}
                handleSaveSearchingKey={handleSaveSearchingKey}
                showFilter={false}
                setIsShowAuto={setIsShowAuto}
                handleTypeKeyword={setSearchText}
                initKey={searchText}
                placeholder="Tra từ điển anh việt"
                setSearchText={setSearchText}
                navigation={navigation} />
            {/*  */}
            {showAutoComplete ?
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        setIsShowAuto(false);
                        Keyboard.dismiss();
                    }}
                    style={{
                        position: 'absolute', top: 60,
                        left: 0, right: 0,
                        // backgroundColor: '#111'
                    }}
                >
                    <View>
                        <AutoComplete
                            setShowAutoText={setIsShowAuto}
                            searchText={searchText}
                            // gradeId={filter.cls}
                            setSearchText={(val) => {
                                console.log('-----', val)
                                setSearchText(val);
                                handleRequestSearch(val)
                            }}
                            handleSaveSearchingKey={handleSaveSearchingKey}
                        />
                    </View>
                </TouchableOpacity>
                : null}
        </View>
    )
};

export default HeaderSearch;