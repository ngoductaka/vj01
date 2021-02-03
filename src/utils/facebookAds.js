import React from 'react';
import {View} from 'react-native';
import {
    AdIconView,
    MediaView,
    AdChoicesView,
    TriggerableView,
    NativeAdsManager,
    BannerView,
    InterstitialAdManager
} from 'react-native-fbads';
// import { InterstitialAdManager } from 'react-native-fbads';
// const placementId = '688221958666283_700255297462949'; // android
// export const placementId = '688221958666283_700259274129218'; // ios banner
export const placementId = '688221958666283_700258647462614'; // ios 

// const adsManager = new NativeAdsManager(placementId, 12);
// import { InterstitialAdManager } from 'react-native-fbads';

// InterstitialAdManager.showAd(placementId)
//   .then((didClick) => {})
//   .catch((error) => {
//       console.log('===========', error)

//   });

export function ViewWithBanner(props) {
    return (
        <View>
            <BannerView
                placementId={placementId}
                type="standard"
                onPress={() => console.log('click')}
                onLoad={() => console.log('loaded=======')}
                onError={(err) => console.log('error load====== ads facebook', err)}
            />
        </View>
    );
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