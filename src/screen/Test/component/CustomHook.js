import React, { useState } from 'react';
import { SafeAreaView, View, TextInput, Text, StyleSheet } from 'react-native';

import { COLOR } from '../../../handle/Constant';
import { fontMaker, fontStyles } from '../../../utils/fonts';


export const useHookTextInput = ({ placeholder = 'Nguyễn Văn A', label = 'Họ và tên (*)' }) => {

    const [focus, setFocus] = useState(false);
    const [value, setValue] = useState('');

    const view = (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={COLOR.black(.3)}
                onFocus={() => setFocus(true)}
                onBlur={() => {
                    setFocus(false);

                }}
                style={[styles.input, focus && { backgroundColor: 'white', borderWidth: 1, borderColor: COLOR.MAIN }]}
                onChangeText={(text) => setValue(text)}
                value={value}
            />
        </View>
    );

    return [value, view];

}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    label: {
        ...fontMaker({ weight: fontStyles.Regular }),
        color: COLOR.black(.3)
    },
    input: {
        padding: 10,
        backgroundColor: COLOR.black(.03),
        borderRadius: 8,
        marginTop: 10,
        borderWidth: 1,
        fontSize: 16,
        borderColor: COLOR.black(.03),
        ...fontMaker({ weight: fontStyles.Regular })
    },
});
