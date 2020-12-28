import React from 'react';
import {
    Dimensions,
} from 'react-native';
import ModalBox from 'react-native-modalbox';

const { width, height } = Dimensions.get('window');

import { helpers } from '../../utils/helpers';

export const BottomModal = (props) => {
    const { show = false, content = null, onClose = () => { }, showCancel = true } = props;
    return (
        <ModalBox
            onClosed={onClose}
            isOpen={show}
            backdropPressToClose={!!showCancel}
            swipeToClose={!!showCancel}
            backdropColor='rgba(0, 0, 0, .7)'
            style={{ width: helpers.isTablet ? 480 : width, height: null, backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25, overflow: 'hidden' }}
            position='bottom'
        >
            {content}
        </ModalBox>
    );
}