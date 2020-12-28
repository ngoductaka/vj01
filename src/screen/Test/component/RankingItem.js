import React from 'react';
import {
    View,
    Text,
    Image
} from 'react-native';
import { Icon } from 'native-base';
import numeral from 'numeral';

import { fontMaker, fontStyles } from '../../../utils/fonts';
import { images } from '../../../utils/images';
import { COLOR } from '../../../handle/Constant';

const RakingItem = ({
    rank = 1,
    name = 'Tung bt',
    mainColor = '#FEDE6F',
    style = {},
    src = images.gold_medal
}) => {
    return (
        <View style={{ width: '100%', borderWidth: 1, borderColor: mainColor, borderRadius: 35, height: 70, marginTop: 15, alignItems: 'center', flexDirection: 'row', ...style }}>
            <View style={{ height: 62, width: 62, backgroundColor: '#97928F', justifyContent: 'center', alignItems: 'center', borderRadius: 35, marginLeft: 4 }}>
                <Text style={{ color: 'white', fontSize: 30, ...fontMaker({ weight: fontStyles.Bold }) }}>{name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={{ width: 36, height: 36, backgroundColor: 'white', borderRadius: 20, marginLeft: -10, borderWidth: 2, borderColor: mainColor, justifyContent: 'center', alignItems: 'center' }}>
                <Icon type='FontAwesome5' name='crown' style={{ color: mainColor, fontSize: 16 }} />
            </View>
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <Text numberOfLines={1} style={{ fontSize: 18, ...fontMaker({ weight: fontStyles.Regular }) }}>{name} jabs asjba skajbsa skask aks aks aks </Text>
                <Text style={{ fontSize: 15, ...fontMaker({ weight: fontStyles.Regular }), marginTop: 4, color: 'red' }}>{numeral(10000).format()}</Text>
            </View>
            { rank <= 3 ?
                <View style={{ width: 40, height: 40, marginRight: 10, padding: 1 }}>
                    <Image
                        source={src}
                        style={{ flex: 1, width: null, height: null, resizeMode: 'contain' }}
                    />
                </View>
                :
                <View style={{ padding: 15 }}>
                    <Text style={{ fontSize: 18, ...fontMaker({ weight: fontStyles.Regular }) }}>
                        <Text style={{ color: COLOR.black(.3), fontSize: 14 }}>Xếp hạng: </Text>
                        <Text style={{ fontSize: 18, ...fontMaker({ weight: fontStyles.Regular }) }}>{rank}</Text>
                    </Text>
                </View>
            }
        </View>

    )
}

export default RakingItem;