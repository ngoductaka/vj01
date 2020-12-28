import { BackHandler } from 'react-native';
import { helpers } from "../../utils/helpers";
import SimpleToast from 'react-native-simple-toast';

let currentCount = 0;
// export const useDoubleBackPress = (focused, handler) => {
//     if (!focused || helpers.isIOS) return;
//     const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
//         if (currentCount === 1) {
//             handler();
//             subscription.remove();
//             return true;
//         }
//         backPressHandler();
//         return true;
//     });
// };

const backPressHandler = () => {
    if (currentCount < 1) {
        currentCount += 1;
        SimpleToast.show("Nhấn lần nữa để thoát");
    }
    setTimeout(() => {
        currentCount = 0;
    }, 2000);
};