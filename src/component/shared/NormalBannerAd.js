import React, { useEffect, useState } from "react";
import { Dimensions, View } from 'react-native';
import firebase from 'react-native-firebase';
import { unitId } from "../../handle/Constant";

const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();

const { width } = Dimensions.get('window');

const NormalBannerAd = ({ height = 100, widthAd = width - 20 }) => {
    return (
        <Banner
            unitId={unitId}
            size={`${Math.floor(widthAd)}x${height}`}
            request={request.build()}
            onAdLoaded={() => {
                // console.log('NormalBannerAd_success', 'Advert loaded');
            }}
            onAdFailedToLoad={err => {
                // console.log('NormalBannerAd_err', err.code);
            }}
        />
    );
};

export default NormalBannerAd;
