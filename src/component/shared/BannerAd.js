import React, { useEffect, useState } from "react";
import { Dimensions, View, Text } from 'react-native';
import firebase from 'react-native-firebase';
import { useSelector } from 'react-redux';

import { unitId } from "../../handle/Constant";
import { fontMaker, fontStyles } from "../../utils/fonts";

const Banner = firebase.admob.Banner;
const AdRequest = firebase.admob.AdRequest;
const request = new AdRequest();
request.addKeyword('facebook').addKeyword('zalo').addKeyword('skype').addKeyword('school');

const { width } = Dimensions.get('window');
const widthAd = Math.floor(width - 20);

const BannerAd = ({ height = 300, type = 1, isShow = true }) => {

    const [showAd, setShowAd] = useState(false);
    // const [limit, setLimit] = useState(false);

    // const lowDevice = useSelector(state => state.userInfo.low_device);

    useEffect(() => {
        // if (lowDevice) {
        //     if (type > 3) {
        //         setLimit(true);
        //     }
        // }
        if (isShow) {
            setTimeout(() => { setShowAd(true) }, (type + 1) % 25 * 500);
        }
    }, [isShow]);

    return (
        <View style={{ width: widthAd, height: height + 40, alignSelf: 'center' }}>
            <Text style={{ alignSelf: 'center', marginVertical: 5, ...fontMaker({ weight: fontStyles.Regular }) }}>Quảng cáo</Text>
            {showAd ?
                <Banner
                    unitId={unitId}
                    size={`${widthAd}x${height}`}
                    request={request.build()}
                    onAdLoaded={() => {
                        // console.log('admob_tungbt_success', 'Advert loaded');
                    }}
                    onAdFailedToLoad={err => {
                        // console.log('admob_tungbt_err', err.code);
                    }}
                />
                :
                null
            }
        </View>
    );
};

export default BannerAd;
