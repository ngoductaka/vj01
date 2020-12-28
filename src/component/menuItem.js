import React from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Icon } from 'native-base';
import { images, mapImg, maxIcon } from '../utils/images';
import { fontMaker } from '../utils/fonts';
import { helpers } from '../utils/helpers';
import * as Animatable from 'react-native-animatable'

const { width } = Dimensions.get('window');
export const NUMBER_COLUMS = helpers.isTablet ? 6 : 4;
const CONTAINER_WIDTH = (width - 50) / NUMBER_COLUMS;

const ItemMenuDetail = (props) => {
  const {
    title = null,
    icon,
    index,
    container_width = CONTAINER_WIDTH,
    onPressItem = () => { },
    link = null,
    style = {}
  } = props;
  return (
    <Animatable.View animation="zoomIn" delay={index*100} style={{ width: container_width, alignItems: 'center', marginTop: 10, ...style }}>
      <TouchableOpacity onPress={onPressItem}>
        <View style={[styles.container, { width: container_width }]}>
          <RenderImageIfNeeded icon={icon} index={index} link={link} />
          <View style={{ paddingHorizontal: 4, marginTop: 10 }}>
            <Text numberOfLines={3} style={styles.index}>{title || 'no data'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
}

export const handleSrc = (icon, index = -1) => {
  if (mapImg[icon]) {
    if (index === -1) {
      return images[`${mapImg[icon]}1`];
    }
    const surplus = (index) % maxIcon[icon] + 1;
    return images[`${mapImg[icon]}${surplus}`]
  } else {
    return images.vat_ly;
  }
}
/* render image function */
const RenderImageIfNeeded = ({ icon, index = -1, link }) => {
  if (link) return (
    <View style={[styles.image, {
      width: 80,
      height: 80,
    }]}>
      <Image style={{ flex: 1, width: null, height: null, borderRadius: 80 }} resizeMode="cover" source={{
        uri: link
      }} />
    </View>
  )
  return !isNaN(icon) ?
    <View style={styles.image}>
      <Image style={{ flex: 1, width: null, height: null }} resizeMode="cover" source={handleSrc(icon, index)} />
    </View>
    :
    <View style={styles.fakeIcon}>
      <Image source={images.lich_su1} style={{ flex: 1, width: null, height: null }} />
    </View>
};

export default ItemMenuDetail;

const styles = StyleSheet.create({
  icon: {
    fontSize: 30,
    color: '#000',
  },
  container: {
    width: CONTAINER_WIDTH,
    alignItems: 'center',
    marginBottom: 12
  },
  image: {
    width: 50,
    height: 50
  },
  index: {
    fontSize: 15, textAlign: 'center', marginVertical: 6, color: '#595353', ...fontMaker({ weight: 'Regular' })
  },
  fakeIcon: {
    width: 65, height: 65, padding: 7
  }
});
