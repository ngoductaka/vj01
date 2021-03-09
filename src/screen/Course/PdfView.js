import React from 'react';
import { StyleSheet, Dimensions, View, SafeAreaView, TouchableOpacity } from 'react-native';

import Pdf from 'react-native-pdf';
import { Icon } from 'native-base';
import { convertPdfLink } from './utis';
const fake = 'https://video.vietjack.com/upload1/admin@vietjack.com/resources/raw-file-bai-tap-ve-cac-dai-luong-dac-trung-trong-dao-dong-dieu-hoa-con-lac-lo-xo-1563348032.pdf';
const PdfView = props => {
    const uri = props.navigation.getParam('uri', fake)

    // const source = { uri, cache: false };
    //const source = require('./test.pdf');  // ios only
    //const source = {uri:'bundle-assets://test.pdf'};

    //const source = {uri:'file:///sdcard/test.pdf'};
    //const source = {uri:"data:application/pdf;base64,JVBERi0xLjcKJc..."};

    return (
        <SafeAreaView style={styles.container}>
            <Pdf
                source={{ uri: convertPdfLink(uri), cache: false }}
                onLoadComplete={(numberOfPages, filePath) => {
                    // console.log(`number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                    // console.log(`current page: ${page}`);
                }}
                onError={(error) => {
                    console.log(error);
                }}
                onPressLink={(uri) => {
                    console.log(`Link presse: ${uri}`)
                }}
                style={styles.pdf}
            />
            <TouchableOpacity onPress={() => props.navigation.goBack()} style={styles.closeBtn}>
                <Icon name="close" />
            </TouchableOpacity>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
        position: 'relative'
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    closeBtn: {
        position: 'absolute',
        borderRadius: 40,
        height: 40, width: 40,

        top: 25, right: 10,
        backgroundColor: '#bbb',
        opacity: 0.8,
        justifyContent: 'center', alignItems: 'center'
    }
});


export default PdfView;