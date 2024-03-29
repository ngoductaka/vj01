import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Header = ( props ) => (
    <View style={styles.header} >
        {/* <Image style={styles.image}  source={require('../images/logo.png')} /> */}
        <Text style={styles.title} >adasd</Text>
    </View>
);

const styles = StyleSheet.create({
    header: {
        paddingLeft: 20,
        paddingTop: 25,
        backgroundColor: '#222',
        flexDirection: 'row',
        height: 80,
        zIndex: 1
    },
    title: {
        height: 20,
        color: 'white',
        flex: 2,
        marginTop: 15,
        fontWeight: 'bold',
        fontSize: 16,
    },
    image: {
        flex: 1,
        resizeMode: 'contain',
        width: 50,
        height: 50,
    },
});

export default Header;
