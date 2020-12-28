import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import * as Animatable from 'react-native-animatable';
import {
    View,
    Dimensions,
    Text, StyleSheet,
    TouchableOpacity
} from 'react-native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import { get, cloneDeep } from 'lodash';

import AwesomeAlert from 'react-native-awesome-alerts';
import BackHeader from '../History/Component/BackHeader';

const handleCheckLoose = (data) => {
    for (let row = 3; row >= 0; row--) {
        for (let col = 3; col >= 0; col--) {
            if (get(data, [row, col, 'val'], NaN) === get(data, [row - 1, col, 'val'], NaN)
                || get(data, [row, col, 'val'], NaN) === get(data, [row, col - 1, 'val'], NaN)) {
                return false;
            }
        }
    }
    return true;
}
const base = {
    val: 0,
    ani: null,
}
const { width } = Dimensions.get('window');
const [initArr] = randomInsert([
    [{ ...base }, { ...base }, { ...base }, { ...base }],
    [{ ...base }, { ...base }, { ...base }, { ...base }],
    [{ ...base }, { ...base }, { ...base }, { ...base }],
    [{ ...base }, { ...base }, { ...base }, { ...base }],

])

const [initArrFail] = randomInsert([
    [{ ...base, val: 2 }, { ...base, val: 4 }, { ...base, val: 2 }, { ...base, val: 4 }],
    [{ ...base, val: 4 }, { ...base, val: 2 }, { ...base, val: 4 }, { ...base, val: 2 }],
    [{ ...base, val: 2 }, { ...base, val: 4 }, { ...base, val: 2 }, { ...base, val: 4 }],
    [{ ...base, val: 4 }, { ...base, val: 2 }, { ...base, val: 4 }, { ...base, val: 2 }],

])
// fadeOutDown
const fadeOutDown = {
    0: {
        opacity: 1,
        scale: 1,
    },
    0.5: {
        opacity: 1,
        scale: 0.3,
    },
    1: {
        opacity: 0,
        scale: 0,
    },
};
const plusIn = 'bounce'
const plusIn1 = {
    0: {
        scale: 1.5,
    },
    0.5: {
        scale: 0.9,
    },
    1: {
        scale: 1,
    },
}
const Game2048 = () => {
    const [data, setData] = useState(initArr);
    const [isLoosed, setLoosed] = useState(false);
    const that = useRef(null);
    const config = {
        velocityThreshold: 0.3,
        directionalOffsetThreshold: 80
    };
    const [reload, setReload] = useState(0)

    const onSwipe = useCallback((gestureName, gestureState) => {
        const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
        let newData = data;
        let direct = '';
        switch (gestureName) {
            case SWIPE_UP:
                newData = convertUp(data);
                direct = 'up';
                break;
            case SWIPE_DOWN:
                newData = convertDown(data);
                direct = 'down';
                break;
            case SWIPE_LEFT:
                newData = convertLeft(data);
                direct = 'left';
                break;
            case SWIPE_RIGHT:
                newData = convertRight(data);
                direct = 'right';
                break;
            default:
                direct = '';
        }

        if (direct) {
            const [newDataWithInsert, score, isLoose] = randomInsert(newData, that.current === direct)
            setData(newDataWithInsert);
            that.current = direct;
            setReload(score);
            if (isLoose) {
                setLoosed(true);
            }
            // alert('you are loose')
        }

    }, [data, reload]);

    return (
        <View style={{ flex: 1 }}>
            <BackHeader
                title={'2048'}
                showRight={false}
            />
            <GestureRecognizer
                onSwipe={onSwipe}
                config={config}
                style={{
                    flex: 1,
                }}
            >
                <View style={styles.container}>
                    <Text style={{ fontSize: 16 }}>Score: {reload}</Text>
                    <View style={styles.main}>
                        {
                            data.map((item, indexRow) => {
                                return (
                                    <View style={styles.row} key={`${reload}${indexRow}`}>
                                        {
                                            item.map((i, indexCol) => {
                                                return (
                                                    <Animatable.View animation={i.ani}
                                                        style={[
                                                            styles.cell,
                                                            {
                                                                backgroundColor: handleColor(i.val),
                                                            }
                                                        ]}
                                                        key={`${reload}${indexRow}${indexCol}`}>
                                                        <Text
                                                            numberOfLines={2}
                                                            allowFontScaling
                                                            // adjustsFontSizeToFit={true}
                                                            // minimumFontScale={0.5}
                                                            style={{
                                                                textAlign: 'center',
                                                                fontSize: ((width - 20) / 4 - 10) / 3 - 2,
                                                                color: i > 1022 ? '#f9f6f2' : '#706e60'
                                                            }}
                                                        >{i.val ? String(i.val) : ''}</Text>
                                                    </Animatable.View>
                                                )
                                            })
                                        }
                                    </View>
                                )
                            })
                        }
                    </View>

                    <AwesomeAlert
                        show={isLoosed}
                        showProgress={false}
                        title="Game Over"
                        message="Do you want a new game"
                        closeOnTouchOutside={true}
                        closeOnHardwareBackPress={false}
                        showCancelButton={true}
                        showConfirmButton={true}
                        cancelText="Close"
                        confirmText="New Game"
                        confirmButtonColor="#DD6B55"
                        onCancelPressed={() => {
                            setLoosed(false)
                        }}
                        onConfirmPressed={() => {
                            setLoosed(false); setReload(0); setData(initArr)
                        }}
                    />
                </View>
            </GestureRecognizer>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#fff2cd",//"#f7d87e"
        justifyContent: 'center',
        alignItems: 'center',
    },
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',

        width: width - 20,
        height: width - 20,
        backgroundColor: '#bbada0',
        borderRadius: 10
    },
    row: {
        // flex: 1,
        // width: '100%',
        // display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        // alignSelf: 'baseline',
        // backgroundColor: 'blue',
        // height: 100,
        // width: 100,
    },
    cell: {
        justifyContent: 'center',
        alignItems: 'center',
        width: (width - 20) / 4 - 10,
        height: (width - 20) / 4 - 10,
        backgroundColor: '#aeaeae',
        borderRadius: 10,
        // shadow
        borderWidth: 1,
        borderColor: '#ccc',
        borderBottomWidth: 3,
        borderRightWidth: 3,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 1,
        // marginLeft: 5,
        // marginRight: 5,
        // marginTop: 10,
    }
})
export default Game2048;


const jumpVertical = (data, row, col, val, listAni, first = true) => {
    let next = col + val;
    if (val === -1 && next < 0 || val === 1 && next > 3) return 1;
    if (data[col][row].val === 0) return 1;
    if (data[next][row].val & 1) { // le
        return 1;
    }
    if (data[next][row].val === 0) {
        data[next][row].val = data[col][row].val;
        data[col][row].val = 0;
        // data[col][row].ani = fadeOutDown
    } else if (data[next][row].val === data[col][row].val) {
        data[next][row].val = 2 * data[col][row].val + 1;
        // if(first && listAni) {
        // 	listAni.push({row: next, col: row, ani: plusIn})
        // }
        data[col][row].val = 0;
        return 1;
    } else {
        return 1
    }
    return jumpVertical(data, row, next, val, null, false)
}
const convertDown = (input) => {
    const data = cloneDeep(input);
    const listAni = [];
    for (let row = 3; row >= 0; row--) {
        for (let col = 2; col >= 0; col--) {
            data[col][row].ani = null;
            jumpVertical(data, row, col, 1, listAni)
        }
    }
    listAni.map(i => {
        const { row, col, ani } = i;
        data[row][col].ani = ani;
    })
    return data;
}
const convertUp = (data) => {
    for (let row = 3; row >= 0; row--) {
        for (let col = 1; col <= 3; col++) {
            data[col][row].ani = null;
            jumpVertical(data, row, col, -1)
        }
    }
    return data;
}







const coreHandleHorizontal = (data, row, col, next) => {
    if (data[row][col].val === 0) return 1;
    if (data[row][next].val & 1) { // le
        return 1;
    }
    if (data[row][next].val === 0) {
        data[row][next].val = data[row][col].val;
        data[row][col].val = 0;
    } else if (data[row][next].val === data[row][col].val) {
        data[row][next].val = 2 * data[row][col].val + 1;
        data[row][col].val = 0;
        return 1;
    } else {
        return 1
    }
}

const jumpLeft = (data, row, col) => {
    let next = col - 1;
    if (next < 0) return 1;
    if (coreHandleHorizontal(data, row, col, next)) return 1;
    return jumpLeft(data, row, next)
}
const jumpRight = (data, row, col) => {
    let next = col + 1;
    if (next > 3) return 1;
    if (coreHandleHorizontal(data, row, col, next)) return 1;
    return jumpRight(data, row, next)

}
const convertLeft = (data) => {
    for (let row = 3; row >= 0; row--) {
        for (let col = 1; col <= 3; col++) {
            data[row][col].ani = null;
            jumpLeft(data, row, col)
        }
    }
    return data;
}

const convertRight = (data) => {
    for (let row = 3; row >= 0; row--) {
        for (let col = 2; col >= 0; col--) {
            data[row][col].ani = null;
            jumpRight(data, row, col)
        }
    }
    return data;
}
function randomInsert(data, isSameDirect = false) {
    let isUpdate = false;
    const emptyPotion = [];
    let score = 0;
    for (let row = 3; row >= 0; row--) {
        for (let col = 3; col >= 0; col--) {
            if (data[row][col].val === 0) {
                emptyPotion.push({ row, col })
            }
            if (data[row][col].val & 1) { // le
                data[row][col].val = data[row][col].val - 1;
                isUpdate = true;
            }
            if (data[row][col].ani == 'zoomInUp') data[row][col].ani = ''
            score += data[row][col].val
        }
    }
    if (emptyPotion.length === 0) {
        if (handleCheckLoose(data)) {
            console.log(' --- loose --- ')
            return [data, score, true];
        }
    } else if (!isSameDirect || isUpdate) {
        const intR = Math.floor(Math.random() * 10);

        const numEmpty = emptyPotion.length - 1;
        const ran1 = Math.floor(Math.random() * numEmpty);
        const indexRand1 = emptyPotion[ran1];
        if (intR < 7) {
            data[[indexRand1.row]][[indexRand1.col]].val = 2;
            data[[indexRand1.row]][[indexRand1.col]].ani = 'zoomInUp';
        } else {
            const ran2 = Math.floor(Math.random() * numEmpty);
            const indexRand2 = emptyPotion[ran2];
            data[[indexRand2.row]][[indexRand2.col]].val = 2;
            data[[indexRand2.row]][[indexRand2.col]].ani = 'zoomInUp';
            data[[indexRand1.row]][[indexRand1.col]].val = 2;
            data[[indexRand1.row]][[indexRand1.col]].ani = 'zoomInUp';
        }
        // const ran2 = Math.floor(Math.random() * numEmpty);

        // const indexRand2 = emptymapPotion[ran2];
        // data[[indexRand2.row]][[indexRand2.col]] = 2;
    }
    return [data, score];
}


const show = (data) => {
    data.map(i => {
        console.log(i.map(z => z.ani).join(' '));
    })
}

const colorMap = {
    '0': '#cdc0b5',
    '2': '#eee4da',
    '4': '#ede0c8',
    '8': '#f2b179',
    '16': '#f59562',
    '32': '#f37c5e',
    '64': '#f15d3a',
    '128': '#edcf72',
    '256': '#edcc64',
    '512': '#e0c060',
    '1024': '#b53154',
    '2048': '#9a0b5f',
    '4096': '#65053d',
    '8192': '#420707',
    '16384': '#3a0335',
    '32768': '#000',
}

const handleColor = (i) => {
    return colorMap[i] ? colorMap[i] : '#cdc0b5'
}


const stylesModal = StyleSheet.create({
    content: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitle: {
        fontSize: 20,
        marginBottom: 12,
    },
});