import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { Icon } from 'native-base';
import { withNavigation } from 'react-navigation';
import { images, mapImg, mapHeaderImage } from '../../utils/images';
import { helpers } from '../../utils/helpers';
import { fontMaker } from '../../utils/fonts';

const handleSource = (icon = 0) => images[`${mapImg[icon]}1`];

const WhileHeader = (props) => {
    const {
        title = '',
        navigation,
    } = props;

    return (
        <View style={{ height: null, minHeight: 48, }}>
            <View style={{ marginTop: helpers.isIOS ? (helpers.isIpX ? helpers.statusBarHeight : 10) : 2, paddingVertical: 15, flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', marginLeft: 5, alignSelf: 'baseline', paddingHorizontal: 10 }}>
                    <Icon type='MaterialCommunityIcons' name='arrow-left' style={{ fontSize: 26, color: 'black' }} />
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: 5 }}>
                    <Text numberOfLines={1} style={{ color: 'black', fontSize: 17, ...fontMaker({ weight: 'Black' }), marginRight: 40 }}>{title}</Text>
                </View>
            </View>
        </View>
    )
};

export default withNavigation(WhileHeader);

