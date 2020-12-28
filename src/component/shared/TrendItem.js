import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Icon, Card } from 'native-base';
import { handleImgSrc, images } from '../../utils/images';
import LinearGradient from 'react-native-linear-gradient';
import { fontMaker } from '../../utils/fonts';

const CONTAINER_HEIGHT = 50;

const gradientColors = [
    ['#fff', '#fff'],
    ['#ECDABE', '#E9C8A8'],
];

const TrendItem = (props) => {
    const {
        title = '',
        subTitle = null,
        img,
        style = {},
        series = '',
        showBorder,
        onPressItem = () => { },
        subIcon = -1,
        type = 1
    } = props;
    return (
        <Card
            style={{
                flex: 1, marginTop: 10, borderRadius: 10, overflow: 'hidden',
                ...style
            }}
        >
            <TouchableOpacity onPress={onPressItem} style={[styles.container]}>
                <RenderImageIfNeeded icon={img} subIcon={subIcon} />
                <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text numberOfLines={2} style={styles.title}>{title || 'title'}</Text>
                    {subTitle && <Text numberOfLines={2} style={styles.subtitle}>{subTitle || 'subTitle'} {series && `- ${series}`}</Text>}
                </View>
            </TouchableOpacity>
        </Card>
    );
}

/* render image function */
const RenderImageIfNeeded = ({ icon, subIcon = -1 }) => {
    return icon ?
        <View style={styles.image}>
            <Image style={{ flex: 1, width: null, height: null }} resizeMode="cover" source={handleImgSrc(icon, subIcon)} />
        </View>
        :
        <View style={styles.image}>
            {/* <Icon name='ios-book' style={{ fontSize: CONTAINER_HEIGHT }} /> */}
            <Image source={images.lich_su1} style={{ flex: 1, width: null, height: null }} />
        </View>
};

export default TrendItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15
    },
    title: {
        fontSize: 15,
        color: '#000',
        ...fontMaker({ weight: 'Bold' })
    },
    subtitle: {
        fontSize: 13,
        color: '#393E3C',
        marginTop: 4,
        ...fontMaker({ weight: 'Regular' })
    },
    image: {
        width: CONTAINER_HEIGHT,
        height: CONTAINER_HEIGHT
    }
});
