import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, AppState } from 'react-native';
import { COLOR } from '../../../handle/Constant';
import { Icon } from 'native-base';
import Sound from 'react-native-sound';
import { helpers } from '../../../utils/helpers';
import { getItem, KEY, saveItem } from '../../../handle/handleStorage';

let whoosh;
let interval;
let timeout;

const SoundPlayer = (props) => {
    const {
        end = false
    } = props;

    const [count, setCount] = useState(0);
    const [soundOn, setSoundOn] = useState(true);

    useEffect(() => {
        AppState.addEventListener("change", _handleAppStateChange);

        return () => {
            AppState.removeEventListener("change", _handleAppStateChange);
        };
        // async function getInitData() {
        //     const sound = await getItem(KEY.soundOn);
        //     console.log('------------', sound);
        //     if (sound == '1') {
        //         setSoundOn(true);
        //     } else {
        //         setSoundOn(false);
        //     }
        // }
        // getInitData();
    }, []);

    const _handleAppStateChange = (nextAppState) => {
        if (helpers.isAndroid) {
            if (nextAppState == 'background') {
                if (whoosh) {
                    whoosh.pause();
                }
            }
            if (nextAppState == 'active') {
                if (whoosh) {
                    whoosh.play();
                    whoosh.setNumberOfLoops(-1);
                }
            }
        }
    };
    useEffect(() => {
        if (end) {
            if (whoosh) {
                whoosh.stop();
            }
            clearInterval(interval);
            clearTimeout(timeout);
        }
    }, [end]);

    useEffect(() => {
        // console.log('askjhas', soundOn);
        // saveItem(KEY.soundOn, soundOn ? '1' : '0');
        if (soundOn) {
            whoosh = new Sound('bg.mp3', Sound.MAIN_BUNDLE, (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                    return;
                }
                if (count == 0) {
                    timeout = setTimeout(() => {
                        // Play the sound with an onEnd callback
                        whoosh.play((success) => {
                            if (success) {
                                whoosh.play();
                                if (helpers.isIOS) {
                                    const duration = whoosh.getDuration();
                                    interval = setInterval(() => {
                                        whoosh.play();
                                    }, duration);
                                }
                                console.log('successfully finished playing');
                            } else {
                                console.log('playback failed due to audio decoding errors');
                            }
                        });
                    }, 4000);
                } else {
                    whoosh.play((success) => {
                        if (success) {
                            whoosh.play();
                            if (helpers.isIOS) {
                                const duration = whoosh.getDuration();
                                interval = setInterval(() => {
                                    whoosh.play();
                                }, duration);
                            }
                            console.log('successfully finished playing');
                        } else {
                            console.log('playback failed due to audio decoding errors');
                        }
                    });
                }

            });
            whoosh.setVolume(1);
            whoosh.setNumberOfLoops(-1);
        }
        return () => {
            if (whoosh) {
                whoosh.stop();
            }
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [soundOn, count]);

    return (
        <TouchableOpacity onPress={() => {
            setSoundOn(!soundOn);
            setCount(count + 1);
        }} style={{ backgroundColor: '#E6E6E6', width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
            <Icon type='MaterialCommunityIcons' name={soundOn ? 'music' : 'music-off'} style={{ color: 'black', fontSize: 26 }} />
        </TouchableOpacity>
    )
};

const styles = {
    iconPause: {
        fontSize: 16, color: COLOR.white(1),
    },
}

export default SoundPlayer;
