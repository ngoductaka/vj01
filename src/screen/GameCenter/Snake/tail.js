import React, { Component } from "react";
import { Image, StyleSheet, View } from "react-native";
import { images } from "../../../utils/images";
import Constants from './Constants';

class Tail extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        let tailList = this.props.elements.map((el, idx) => {
            return <View key={idx} style={{ width: this.props.size, height: this.props.size, position: 'absolute', left: el[0] * this.props.size, top: el[1] * this.props.size }}>
                <Image source={images.gift} style={{ flex: 1, width: null, height: null }} />
            </View>
        });

        return (
            <View style={{ width: Constants.GRID_SIZE * this.props.size, height: Constants.GRID_SIZE * this.props.size }}>
                {tailList}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    finger: {
        backgroundColor: '#888888',
        position: "absolute"
    }
});

export { Tail };