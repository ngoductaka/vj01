import React, { useEffect, useState } from "react";
import { Dimensions, View } from 'react-native';
import firebase from 'react-native-firebase';
import { unitId } from "../../handle/Constant";

const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();

const { width } = Dimensions.get('window');

const BannerBottomAd = ({ height = 100 }) => {
    return (
        <View style={{ width: '100%' }}>
            <Banner
                unitId={unitId}
                size={`${Math.floor(width)}x${height}`}
                request={request.build()}
                onAdLoaded={() => {
                    // console.log('BannerBottomAd_success', 'Advert loaded');
                }}
                onAdFailedToLoad={err => {
                    // console.log('BannerBottomAd_err', err.code);
                }}
            />
        </View>
    );
};

export default BannerBottomAd;
