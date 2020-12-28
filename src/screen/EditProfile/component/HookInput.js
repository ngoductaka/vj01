import React, { useState } from 'react';
import { SafeAreaView, View, TextInput, Text, StyleSheet } from 'react-native';

import { COLOR } from '../../../handle/Constant';
import { fontMaker, fontStyles } from '../../../utils/fonts';


export const useHookInput = ({ placeholder = 'Nguyễn Văn A', initVal = '', label = 'Họ và tên (*)' }) => {

    const [focus, setFocus] = useState(false);
    const [value, setValue] = useState(initVal);

    const view = (
        <View style={styles.container}>
            <Text style={[styles.label, { color: focus ? COLOR.MAIN : COLOR.black(.3) }]}>{label}</Text>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor={COLOR.black(.3)}
                onFocus={() => setFocus(true)}
                onBlur={() => {
                    setFocus(false);
                }}
                style={[styles.input, focus ? { backgroundColor: 'white', borderWidth: 1, borderColor: COLOR.MAIN } : { borderWidth: 1, backgroundColor: COLOR.black(.03), borderColor: COLOR.black(.03), }]}
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
        padding: 14,
        fontSize: 16,
        borderRadius: 8,
        color: COLOR.black(1),
        marginTop: 10,
        ...fontMaker({ weight: fontStyles.Regular })
    },
});
