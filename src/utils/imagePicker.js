import ImagePickerCrop from "react-native-image-crop-picker";

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
      cropping: false,
      multiple: multiple,
      useFrontCamera: true,
      mediaType: "photo",
    })
      .then(response => {
        console.log("ImagePicker Success: ", response);
        onChooseImage && onChooseImage(response);
      })
      .catch(err => {
        console.log("ImagePicker Error: ", err);
        onError && onError();
      });

  }

  launchLibrary(multiple, { onChooseImage, onDidCancel, onError }) {
    ImagePickerCrop.openPicker({
      multiple: multiple,
      compressImageMaxWidth: 1920,
      compressImageMaxHeight: 1080,
      mediaType: "photo"
    })
      .then(response => {
        console.log("ImagePicker Success: ", response);
        onChooseImage && onChooseImage(response);
      })
      .catch(err => {
        onError && onError();
        console.log("ImagePicker Error: ", err);
      });
  }
}

const picker = new ImagePickerModule();

export default picker;
