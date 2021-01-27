import React, { Component } from "react";
import { Image, StyleSheet, View } from "react-native";
import { images } from "../../../utils/images";

class Head extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const x = this.props.position[0];
        const y = this.props.position[1];
        return (
            <View style={[styles.finger, { width: this.props.size, height: this.props.size, left: x * this.props.size, top: y * this.props.size }]}>
                <Image source={images.head} style={{ width: null, height: null, flex: 1 }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    finger: {
        position: "absolute"
    }
});

export { Head };