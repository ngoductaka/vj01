import React, { useState, useEffect } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';
import { COLOR } from '../../../handle/Constant';

const FadingQuestionNumber = ({ style, index, ...props }) => {

    const [opacity, setOpacity] = useState(new Animated.Value(1));

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
            <Animated.Text
                style={[
                    {
                        opacity: opacity,
                        fontSize: 150,
                        color: COLOR.MAIN_GREEN,
                        // transform: [
                        //     {
                        //         scale: opacity.interpolate({
                        //             inputRange: [0, 1],
                        //             outputRange: [.8, 1],
                        //         })
                        //     },
                        // ],
                    },
                    style,
                ]}
            >
                {index}
            </Animated.Text>
        </View>
    );
}

export default FadingQuestionNumber;