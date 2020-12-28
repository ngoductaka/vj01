import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Animated } from 'react-native';
import Sound from 'react-native-sound';

let whoosh;

export const Countdown = (props) => {
    const {
        style = {}
    } = props;

    const [count, setCount] = useState(3);
    const [opacity, setOpacity] = useState(new Animated.Value(1));

    useEffect(() => {
        whoosh = new Sound('start.mp3', Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }
            // Play the sound with an onEnd callback
            whoosh.play((success) => {
                if (success) {
                    whoosh.play();
                    // console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        });
        whoosh.setVolume(1);
        whoosh.setNumberOfLoops(1);
        return () => {
            whoosh.stop();
            whoosh.release();
        };
    }, []);

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
        }).start(() => {
            if (count > 0) {
                setCount(count - 1);
                setOpacity(new Animated.Value(1));
            }
        });
    }, [opacity]);

    return (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
            <Animated.Text
                style={[
                    {
                        fontSize: 100,
                        color: 'white',
                        opacity: opacity,
                        transform: [
                            {
                                scale: opacity.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [3, 1],
                                })
                            },
                        ],
                    },
                ]}
            >
                {count > 0 ? count : 'GO!'}
            </Animated.Text>
        </View>
    )
};