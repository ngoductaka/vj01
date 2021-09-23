import ImagePickerCrop from "react-native-image-crop-picker";
import {Dimensions} from 'react-native';

const { width, height } = Dimensions.get('window');
const defaultConfig = {
  storageOptions: {
    skipBackup: true,
    path: "images"
  },
  cameraType: "front"
};
const options = {
  storageOptions: {
    skipBackup: true,
    cameraRoll: true,
    waitUntilSaved: true
  }
};

class ImagePickerModule {
  constructor(config) {
    this.config = config || defaultConfig;
  }

  setConfig(config) {
    this.config = config;
  }

  launchCamera(multiple, { onChooseImage, onDidCancel, onError, cropping }) {
    ImagePickerCrop.openCamera({
      compressImageMaxWidth: 1920,
      compressImageMaxHeight: 1080,
      freeStyleCropEnabled: true,
      cropping: true,
      multiple: multiple,
      useFrontCamera: true,
      mediaType: "photo",
      width: 350,
      height: 100,
    })
      .then(response => {
        // console.log("ImagePicker Success: ", response);
        onChooseImage && onChooseImage(response);
      })
      .catch(err => {
        console.log("ImagePicker Error: ", err);
        onError && onError();
      });

  }

  launchLibrary(otherOption, { onChooseImage, onDidCancel, onError }) {
    try {
      ImagePickerCrop.openPicker({
        compressImageMaxWidth: 1920,
        compressImageMaxHeight: 1080,
        freeStyleCropEnabled: true,
        mediaType: "photo",
        cropping: true,
        width: 350,
        height: 100,
        ...otherOption,
      })
        .then(response => {
          // console.log("ImagePicker Success: ", response);
          onChooseImage && onChooseImage(response);
        })
        .catch(err => {
          onError && onError();
          console.log("ImagePicker Error: ", err);
        });
    } catch (error) {
      console.log('--------error===', error)
    }
  }
}

const picker = new ImagePickerModule();

export default picker;
