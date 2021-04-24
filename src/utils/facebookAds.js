import React, { useState } from 'react';
import { View, Platform, Text, Dimensions } from 'react-native';
import {
    AdIconView,
    MediaView,
    AdChoicesView,
    TriggerableView,
    NativeAdsManager,
    BannerView,
    InterstitialAdManager,
    AdSettings
} from 'react-native-fbads';

import BannerAd from '../component/shared/BannerAd';

const initAdSetting = async () => {
    try {
        // AdSettings.setMediationService('foobar');
        // const trackingStatus = await AdSettings.requestTrackingPermission();
        // if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
        //     AdSettings.setAdvertiserIDCollectionEnabled(true);
        //     AdSettings.setAdvertiserTrackingEnabled(true);
        // }
        // const trackingStatus = await AdSettings.getTrackingStatus();
        // console.log('trackingStatus', trackingStatus)

        // if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
        //     AdSettings.setAdvertiserIDCollectionEnabled(true);
        // }

    } catch (err) {
        console.log('------err init ads settings-----', err)
    }
}

setTimeout(() => {
    console.log('===========ads=============')
    initAdSetting()
    .catch(err => {
        console.log('dnd====', err)
    })
}, 1000)


const { width } = Dimensions.get('window');
const widthAd = Math.floor(width - 20);

const iosAdds = {
    bieu_ngu: '688221958666283_877020706453073',
    bn_tu_nhien: '688221958666283_700259354129210',
    tu_nhien: '688221958666283_700259390795873',
    rectange: '688221958666283_700259274129218',
    full: '688221958666283_877020389786438',
}

const androidAdds = {
    bieu_ngu: '688221958666283_700255614129584',
    tu_nhien: '688221958666283_700255357462943',
    rectangle: '688221958666283_889808461840964',
    full: '688221958666283_700255297462949',
}

export const placementIdFull = Platform.select({
    ios: iosAdds.full,
    android: androidAdds.full,
}); // ios Chèn giữa full

export const placementIdBanner = Platform.select({
    ios: iosAdds.rectange,//'688221958666283_700259390795873',
    android: androidAdds.rectangle,
}); // ios Biểu ngữ


export const placementIdBanner2 = Platform.select({
    ios: "688221958666283_700259317462547",//'688221958666283_700259390795873',
    android: '688221958666283_700255430796269',
}); // ios Biểu ngữ

export const fbFull = () => {
    return new Promise((res, rej) => {
        // return null;
        InterstitialAdManager.showAd(placementIdFull)
            .then((didClick) => {
                console.log('<click full ads test>')
                res(didClick)
            })
            .catch((error) => {
                console.log('===========fullfacebook', error)
                rej(error)
            });
    })
}


export function ViewWithBanner({ index = 0 } = {}) {
    const [fb, setFb] = useState(true);
    if (fb) {
        return (
            <View style={{ width: widthAd }}>
                {/* <Text>Quảng cáo facebook</Text> */}
                <BannerView
                    placementId={index > 10 ? placementIdBanner : placementIdBanner2}
                    type="rectangle"//large" //"standard"
                    onPress={() => console.log('click')}
                    onLoad={() => {
                        // setFb(false)
                        console.log('<load facebook banner ads>')
                    }}
                    onError={(err) => {
                        setFb(false)
                        console.log('<err load banner===========>', err)
                    }}
                />
            </View>
        );
    } else {
        return <BannerAd />

    }
}


// class AdComponent extends React.Component {
//     render() {
//         return (
//             <View>
//                 <AdChoicesView style={{ position: 'absolute', left: 0, top: 0 }} />
//                 <AdIconView style={{ width: 50, height: 50 }} />
//                 <MediaView style={{ width: 160, height: 90 }} />
//                 {/* <TriggerableView>
//             <Text>{this.props.nativeAd.description}</Text>
//           </TriggerableView> */}
//             </View>
//         );
//     }
// }

// export default AdComponent;