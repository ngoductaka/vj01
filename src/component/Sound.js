import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, AppState, ActivityIndicator } from 'react-native';
import { Icon } from "native-base";
import Slider from '@react-native-community/slider';

import Sound from 'react-native-sound';

const SoundComponent = React.memo(({ url }) => {
	const [play, setPlay] = useState(false);
	const [sound] = useSound(url);
	const [currentTime, currentPosison, setPosison] = useCurrentTimeSound(sound, play, setPlay);
	useEffect(() => {
		AppState.addEventListener("change", _handleAppStateChange);

		return () => {
			AppState.removeEventListener("change", _handleAppStateChange);
		};
	}, []);

	const _handleAppStateChange = (nextAppState) => {
		if (
			nextAppState == "background" || nextAppState == 'inactive'
		) {
			setPlay(false);
			sound.pause()
			sound.release();
		}
	};

	const loaded = sound.isLoaded();

	useEffect(() => {
		return () => {
			sound.pause()
			sound.release();
		}
	}, [sound]);

	const playAudio = () => {
		if (loaded)
			setPlay(p => {
				if (!p) sound.play();
				else sound.pause();
				return !p;
			});
	}

	const _handleSlide = (value) => {
		setPosison(value);
	}

	const _renderIcon = (play) => {
		return loaded ?
			<>
				<TouchableOpacity style={styles.icon} onPress={playAudio}>
					{play ? <Icon name='md-pause' /> : <Icon name='md-play' />}
				</TouchableOpacity>
				<View style={styles.time}>
					<Text>{currentTimeConvert}/{durationConvert}</Text>
				</View>
				<Slider
					style={{ flex: 1, height: 40, marginRight: 10 }}
					minimumValue={0}
					maximumValue={1}
					minimumTrackTintColor="blue"
					maximumTrackTintColor="#000000"
					value={currentPosison}
					onValueChange={_handleSlide}
				/>
			</> :
			<ActivityIndicator />
	}

	const currentTimeConvert = convertTime(currentTime);
	const durationConvert = convertTime(sound.getDuration());

	return (
		<View style={styles.container} onPress={playAudio}>
			{_renderIcon(play)}
		</View>
	)
});

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',

		height: 50,
		paddingBottom: 5,
		paddingTop: 5,
		// width: '100%',
		margin: 10,
		borderColor: '#ddd',
		borderRadius: 100,
		paddingLeft: 10,

		borderWidth: 2,
	},
	time: { height: 40, justifyContent: 'center', alignItems: 'flex-start' },
	icon: { height: 40, width: 40, justifyContent: 'center', alignItems: 'center' },
	loadIcon: {
		height: 30,
		width: 30,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 100,
		backgroundColor: 'red',
	}
});

const convertTime = (seconds) => {
	const m = parseInt(seconds / 60);
	const s = parseInt(seconds % 60);
	return ((m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s));
};

const useSound = (url) => {
	const [sound, setSound] = useState(new Sound('', null));

	useEffect(() => {
		// apiFace(url)
		// 	.then(result => {
		const ns = new Sound(url, null, (err) => {
			if (err) {
				// console.log('url=====: ', url, 'err sound -----: ', err);
			}
			else setSound(ns);
		});
		// })
	}, []);

	return [sound];
}

const useCurrentTimeSound = (sound, play, setPlay) => {
	const loaded = sound.isLoaded();
	const duration = sound.getDuration()

	const [currentTime, setCurrentTime] = useState(0);
	const [currentPosison, setCurrentPosison] = useState(0);
	const setPosison = value => {
		sound.setCurrentTime(value * duration);
		setCurrentTime(value * duration);
	}

	useEffect(() => {
		const timeout = setInterval(() => {
			if (loaded && play) {
				sound.getCurrentTime((seconds) => {
					setCurrentTime(seconds);
					setCurrentPosison(seconds / duration)
					if (convertTime(duration) == convertTime(seconds)) {
						setPlay(false);
						sound.setCurrentTime(0);
						setCurrentPosison(0)
					}
				})
			}
		}, 1000);
		return () => {
			clearInterval(timeout);
		}
	}, [sound, play]);

	return [currentTime, currentPosison, setPosison];

}
const releaseSound = (sound) => {
	useEffect(() => {
		return () => {
			sound.pause()
			sound.release();
		}
	}, []);
}

export default SoundComponent;
