import React, { useState } from 'react';
import { View, Platform, Text, Dimensions } from 'react-native';
import {
    AdIconView,
    MediaView,
    AdChoicesView,
    TriggerableView,
    NativeAdsManager,
    BannerView,
    InterstitialAdManager
} from 'react-native-fbads';

import BannerAd from '../component/shared/BannerAd';



const { width } = Dimensions.get('window');
const widthAd = Math.floor(width - 20);
// import { InterstitialAdManager } from 'react-native-fbads';
// const placementId = '688221958666283_700255297462949'; // android
// export const placementId = '688221958666283_700259274129218'; // ios banner
// export const placementId = '688221958666283_700258647462614'; // ios 
// export const placementId = '688221958666283_700259354129210'; // ios Biểu ngữ tự nhiên
// export const placementId = '688221958666283_700259390795873'; // ios Tự nhiên

export const placementIdFull = Platform.select({
    ios: '688221958666283_877020389786438',
    android: '688221958666283_700255297462949'
}); // ios Chèn giữa full

export const placementIdBanner = Platform.select({
    ios: '688221958666283_700258647462614',//'688221958666283_877020706453073',
    android: '688221958666283_700255357462943'
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
                console.log('===========', error)
                rej(error)
            });

    })
}


export function ViewWithBanner(props) {
    const [fb, setFb] = useState(true);
    if (fb) {
        return (
            <View style={{width: widthAd}}>
                <Text>Quảng cáo facebook</Text>
                <BannerView
                    placementId={placementIdBanner}
                    type="rectangle"//large" //"standard"
                    onPress={() => console.log('click')}
                    onLoad={() => {
                        // setFb(false)
                        console.log('<load facebook banner ads>')
                    }}
                    onError={(err) => {
                        setFb(false)
                        console.log('<err load banner===========>', err)
                    }
                    }
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