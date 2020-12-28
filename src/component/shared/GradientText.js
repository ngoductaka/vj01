import React from 'react';
import { Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-community/masked-view';
import { fontSize } from '../../handle/Constant';
import { fontMaker, fontStyles } from '../../utils/fonts';

export const GradientText = ({ colors = ['#F5576F', '#F580CE', '#E95771'], ...props }) => {
    return (
        <MaskedView maskElement={<Text {...props} style={{ fontSize: fontSize.h3, ...fontMaker({ weight: fontStyles.SemiBold }), ...props.style }}>{props.children}</Text>}>
            <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={[{ fontSize: fontSize.h3 }, { opacity: 0, ...fontMaker({ weight: fontStyles.SemiBold }), }, { ...props.style }]}>{props.children}</Text>
            </LinearGradient>
        </MaskedView>
    );
}
