import React, { useState, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const FadingOutCom = ({ style, correct, ...props }) => {

    const [opacity, setOpacity] = useState(new Animated.Value(1));

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            delay: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View
            // {...props}
            style={[
                {
                    width: 300,
                    height: 300,
                    opacity: opacity,
                    transform: [
                        {
                            scale: opacity.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1.3, .4],
                            })
                        },
                    ],
                },
                style,
            ]}
        >
            {
                correct ?
                    <LottieView
                        autoPlay
                        style={{ width: null, height: null, flex: 1 }}
                        source={require('../../../public/check-mark-yes.json')}
                    />
                    :
                    <LottieView
                        autoPlay
                        style={{ width: null, height: null, flex: 1 }}
                        source={require('../../../public/incorrect.json')}
                    />
            }

        </Animated.View>
    );
}

export default FadingOutCom;