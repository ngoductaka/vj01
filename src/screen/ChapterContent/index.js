import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Icon } from "native-base";
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade,
} from "rn-placeholder";
import { useSelector, useDispatch } from 'react-redux';

const { height, width } = Dimensions.get('window');

const ChapterContent = (props) => {

    const listLesson = props.navigation.getParam('listLesson', []);
    // console.log('--------', listLesson);


    return (
        <SafeAreaView style={styles.base}>
            <FlatList
                style={{ flex: 1 }}
                data={listLesson}
                renderItem={({ item, index }) => {
                    return (
                        <View style={{}}>
                            <Text>{item.title}</Text>
                        </View>
                    );
                }}
                keyExtractor={(item, index) => 'chapter_content' + index}
            />
        </SafeAreaView>
    )
};

const styles = {
    base: { flex: 1 }
}

export default ChapterContent;