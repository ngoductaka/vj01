import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AnimatedCircularProgress from 'react-native-animated-circular-progress';

const BarLoading = ({

}) => {

    return (
        <AnimatedCircularProgress
            backgroundColor='#1D1D1D'
            color='#E6E6E6'
            startDeg={0}
            endDeg={360}
            radius={18}
            innerRadius={0}
            duration={3000}
            style={{  }}
        />
    )
}

export default BarLoading;

const styles = StyleSheet.create({
    progress: {
        marginRight: 10,
    },
});