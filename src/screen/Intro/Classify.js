import React, { userEffect, userState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, SafeAreaView } from 'react-native';
import { Icon } from 'native-base';
import AppIntroSlider from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-community/async-storage';

const Classify = (props) => {

    const { navigation } = props;

    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => navigation.navigate('InAppStack')}>
                    <Text>ajgsjhagsh</Text>
                </TouchableOpacity>
                <Text>ajsjahg</Text>
            </SafeAreaView>
        </View>
    )
}

const styles = StyleSheet.create({

});

export default Classify;
