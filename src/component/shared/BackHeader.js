import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { Icon } from 'native-base';
import { withNavigation } from 'react-navigation';
import { images, mapImg, mapHeaderImage } from '../../utils/images';
import { helpers } from '../../utils/helpers';
import { fontMaker } from '../../utils/fonts';

const handleSource = (icon = 0) => images[`${mapImg[icon]}1`];

const NormalHeader = (props) => {
    const {
        title = '',
        subtitle = '',
        navigation,
        icon = 0,
        idSubjectTest = 0
    } = props;

    return (
        <View style={{ height: null, minHeight: 48, }}>
            <ImageBackground style={{ width: '100%', height: null, borderBottomLeftRadius: 48, borderBottomRightRadius: 48, overflow: 'hidden' }} source={mapHeaderImage(idSubjectTest)}>
                <View style={{ marginTop: helpers.isIOS ? (helpers.isIpX ? helpers.statusBarHeight : 10) : 2, paddingVertical: 15, flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', marginLeft: 5, flex: 6, alignSelf: 'baseline' }}>
                        <Icon type='MaterialCommunityIcons' name='arrow-left' style={{ fontSize: 26, color: 'white' }} />
                        <View style={{ marginLeft: 4, marginTop: 3 }}>
                            <Text numberOfLines={1} style={{ color: 'white', fontSize: 17, ...fontMaker({ weight: 'Black' }), marginRight: 40 }}>{title}</Text>
                            {subtitle.trim().length > 0 && <Text numberOfLines={2} style={{ color: 'white', fontSize: 13, marginTop: 6, ...fontMaker({ weight: 'Regular' }), }}>{subtitle}</Text>}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('SearchView', { searchText: '' })} style={{ flexDirection: 'row', marginRight: 5, flex: 1.5, justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'flex-start' }}>
                        <View style={{ marginRight: 4 }}>
                            <Text style={{ color: 'white', fontSize: 15, ...fontMaker({ weight: 'Regular' }), }}>Tìm kiếm</Text>
                        </View>
                        <Icon type='MaterialCommunityIcons' name='magnify' style={{ fontSize: 26, color: 'white', marginTop: 3 }} />
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center', marginTop: -20 }}>
                    <Image
                        style={{ width: 60, height: 60 }}
                        source={handleSource(icon)}
                    />
                </View>
            </ImageBackground>
        </View>
    )
};

export default withNavigation(NormalHeader);

