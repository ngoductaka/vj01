import React, {
  useState,
  useCallback,
  useEffect,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

import { WebView } from 'react-native-webview';
import { get, isEmpty } from 'lodash';
import HTML from 'react-native-render-html';
import {
  IGNORED_TAGS, alterNode, makeTableRenderer,
  cssRulesFromSpecs, defaultTableStylesSpecs,

} from 'react-native-render-html-table-bridge';
import FastImage from 'react-native-fast-image';
import Toast from 'react-native-simple-toast';

const cssRules = cssRulesFromSpecs(defaultTableStylesSpecs);

import Sound from '../Sound';
import { fontMaker, fontStyles } from '../../utils/fonts';
import BannerAd from './BannerAd';
import { endpoints } from '../../constant/endpoints';
import { handleImgSrc, handleImgTest } from '../../utils/images';

const config = {
  WebViewComponent: WebView,
  cssRules,
};

const renderers = {
  table: makeTableRenderer(config)
};

const htmlConfig = {
  alterNode,
  renderers,
  ignoredTags: IGNORED_TAGS
};

const { width, height } = Dimensions.get('window');

const RenderTable = (props) => {

  return (
    <View style={props.style}>
      <ScrollView style={props.style}>
        <HTML html={props.content} {...htmlConfig} />
      </ScrollView>
    </View>
  )
}

const getHTML = (svgContent, style) => `
<html>
  <head>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
        background-color: transparent;
      }
      svg {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    ${svgContent}
  </body>
</html>
`;

const SvgImage = (props) => {
  const [state, setState] = useState({ fetchingUrl: null, svgContent: null });

  useEffect(() => {
    doFetch(props)
  }, []);

  useEffect(() => {
    if (get(props, 'source.uri')) doFetch(props);
  }, [props.source]);

  const doFetch = async (props) => {
    let uri = props.source && props.source.uri;
    if (uri) {
      props.onLoadStart && props.onLoadStart();
      if (uri.match(/^data:image\/svg/)) {
        const index = uri.indexOf('<svg');
        setState({ fetchingUrl: uri, svgContent: uri.slice(index) });
      } else {
        try {
          const res = await fetch(uri);
          const text = await res.text();
          setState({ fetchingUrl: uri, svgContent: text });
        } catch (err) {
          console.error('got error', err);
        }
      }
      props.onLoadEnd && props.onLoadEnd();
    }
  }
  const onNavigationStateChange = (navState) => {
    // this.setState({
    //   height: navState.title,
    // });
  }
  const { svgContent } = state;
  if (svgContent) {
    const flattenedStyle = StyleSheet.flatten(props.style) || {};
    const html = getHTML(svgContent, flattenedStyle);
    return (
      <View pointerEvents="none" style={[props.style, props.containerStyle]}>
        <WebView
          originWhitelist={['*']}
          scalesPageToFit={true}
          useWebKit={false}
          style={[
            {
              width: 150,
              height: 60,
              backgroundColor: 'transparent',
            },
            props.style,
          ]}
          // injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=width, initial-scale=0.5, maximum-scale=0.5, user-scalable=2.0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
          // automaticallyAdjustContentInsets={true}
          // javaScriptEnabled={false}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          source={{ html }}
          // 
          automaticallyAdjustContentInsets={false}
          scrollEnabled={false}
          onNavigationStateChange={onNavigationStateChange}
        // style={{ width: Dimensions.get('window').width, height: this.state.webViewHeight }}

        />
      </View>
    );
  } else {
    return (
      <View
        pointerEvents="none"
        style={[props.containerStyle, props.style]}
      />
    );
  }

}

const ImageSVG = props => {
  const source = resolveAssetSource(props.source);
  if (source && (source.uri && source.uri.match('.svg'))) {
    const style = props.style || {};
    if (source.__packager_asset && typeof style !== 'number') {
      if (!style.width) {
        style.width = source.width;
      }
      if (!style.height) {
        style.height = source.height;
      }
    }
    return <SvgImage {...props} source={source} style={style} />;
  } else {
    return <Image {...props} />;
  }
};


const handleImgLink = (link) => {
  try {
    if (!link) return "https://avancar.gov.br/avancar-web/images/slideshow/not-found.png"
    return link.includes('http') ? link : `${endpoints.BASE_HOI_DAP}${uri}`;
  } catch (err) {
    return link;
  }
}

const RenderImg = ({ uri, height, widthImg, indexItem, setShowImg, isAnwser }) => {
  try {

    const convertEndPoint = handleImgLink(uri);
    if (height && widthImg) {
      return (
        <TouchableOpacity onPress={() => {
          if (widthImg > width - 150 && setShowImg) {
            Toast.showWithGravity("Click 2 lần để phóng to", Toast.SHORT, Toast.CENTER);
            setShowImg({ uri: convertEndPoint, size: { height, width: widthImg } })
          }
        }} key={indexItem + 'img'} style={{ height, width: widthImg > width ? width - 5 : widthImg }}>
          <Image
            resizeMode="contain"
            style={{ flex: 1, height: undefined, width: undefined }}
            source={{
              uri: convertEndPoint
              // 'https://hoidap.vietjack.com/storage/upload/images/1589295123-imagejpg.jpg',
              // priority: FastImage.priority.normal,
            }}
          // resizeMode={FastImage.resizeMode.contain}
          />
        </TouchableOpacity>
      )
    }
    const [size, setSize] = useState({ width: width, height: width })
    const onSuccess = useCallback(
      (width, height) => {
        const cWidth = getWidth(width, isAnwser);
        setSize({ height: height * (cWidth / width), width: cWidth });
      }
      , [uri]);

    useEffect(() => {
      Image.getSize(uri, onSuccess);
    }, [uri]);
    // console.log(`${endpoints.BASE_HOI_DAP}${uri}`, '=======')
    // console.log(convertEndPoint, '111=======0000', size);

    return (
      <TouchableOpacity onPress={() => {
        if (size.width && size.width > width - 150 && setShowImg) {
          Toast.showWithGravity("Click 2 lần để phóng to", Toast.SHORT, Toast.CENTER);
          setShowImg({ uri, size })
        }
      }} key={indexItem + 'img'} style={size}>
        <Image
          resizeMode="contain"
          style={{ flex: 1, height: undefined, width: undefined }}
          source={{
            uri: 'https://hoidap.vietjack.com/storage/upload/images/1589295123-imagejpg.jpg',
            // priority: FastImage.priority.normal,
          }}
        // resizeMode={FastImage.resizeMode.contain}
        />
      </TouchableOpacity>
    )
  } catch (err) {

  }
}

const getWidth = (svgWidth, isAnwser) => {
  if (isAnwser) {
    return svgWidth >= width - 70 ? width - 70 : svgWidth
  } else {
    return svgWidth >= width - 20 ? width - 20 : svgWidth
  }
}

const RenderItemPow = ({ content = '', indexRow, style }) => {
  return content.split(' ').map((i, indexP) => <Text key={indexRow + 'row1' + indexP} style={[styleItem.text, style]}>{' ' + i}</Text>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  viewRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap'
  }
})

const styleItem = StyleSheet.create({
  text: { fontSize: 18, color: '#111' },
})

const RenderData = ({ indexItem = '', content }) => {
  let data = [];
  try {
    data = JSON.parse(content);
  } catch (err) {
    return null;
  }
  if (isEmpty(data)) return null;
  return (
    <View style={styles.container}>
      {
        data.map((row, indexRow) => RenderRow({ indexItem, row, indexRow }))
      }
    </View >
  )
}

export const RenderDataJson = ({ indexItem = '', content, isAnwser, setShowImg }) => {
  // console.log('contentcontentcontentcontentcontentcontent', content, typeof content)
  if (isEmpty(content) || !Array.isArray(content)) return null;
  return (
    <View style={styles.container}>
      {
        content.map((row, indexRow) => RenderRow({ indexItem, row, indexRow, isAnwser, setShowImg }))
      }
    </View >
  )
}
// 
export const RenderRow = ({ indexItem = '', row, indexRow, setShowImg, isAnwser }) => {
  try {
    return (
      <View key={`${indexItem}_row_${indexRow}`} style={styles.viewRow}>
        {
          row.map(({ type = '', content, params = {} }, index) => {
            if (type == 'text_bold') {
              return <RenderItemPow
                key={indexRow + indexItem + index + 'text'}
                indexRow={index} content={content}
                style={{
                  ...fontMaker({ weight: fontStyles.Bold }),
                  color: '#000',
                  fontSize: 20
                }}
              />
            }
            if (type == 'text_title') {
              return <RenderItemPow
                key={indexRow + indexItem + index + 'text'}
                indexRow={index} content={content}
                style={{
                  ...fontMaker({ weight: fontStyles.Bold }),
                  color: '#000',
                  fontSize: 26
                }}
              />

            } else if (type === 'text') {
              return <RenderItemPow
                key={indexRow + indexItem + index + 'text'}
                indexRow={index} content={content}
              />
            }
            else if (type === 'svg') {
              const { height: svgH = 5, width: svgW = 20 } = params;
              if (isNaN(svgH) || isNaN(svgW)) return null;
              if (!content.includes('svg')) {
                return null;
              }
              const heightConvert = svgH * 10;
              const widthConvert = getWidth(svgW * 10, isAnwser);
              // console.log('contentcontentcontent', content)
              return (
                <TouchableOpacity
                  // key={indexRow + indexItem + index + 'ios_svg'}
                  onPress={() => {
                    if (widthConvert > width - 200 && setShowImg) {
                      Toast.showWithGravity("Click 2 lần để phóng to", Toast.SHORT, Toast.CENTER);
                      setShowImg({
                        type: 'svg',
                        content,
                        size: {
                          width: widthConvert, height: heightConvert
                        }
                      })
                    }
                  }}
                >

                  <SvgXml
                    key={indexRow + indexItem + index + 'ios_svg'}
                    xml={content} width={widthConvert}
                    height={heightConvert}
                    color="#000"
                  />
                  {/* {(Platform.OS === 'ios') ?
                    <SvgXml
                      key={indexRow + indexItem + index + 'ios_svg'}
                      xml={content} width={widthConvert}
                      height={heightConvert}
                      color="#000"
                    />
                    : <ImageSVG
                      key={indexRow + indexItem + index + 'android'}
                      source={{ uri: `data:image/svg+xml;utf8,` + content }}
                      style={{ height: heightConvert, width: widthConvert }}
                    />} */}

                </TouchableOpacity>
              )


            } else if (type.includes('sub') || type.includes('sub')) {
              return <RenderItemPow key={indexRow + indexItem + index + 'sub'} type={type} content={content} />
            } else if (type === 'img') {
              const { height: imgH = 0, width: imgW = 0 } = params;
              if (isNaN(imgH) || isNaN(imgW)) return null;
              const widthConvert = getWidth(imgW, isAnwser);
              return <RenderImg
                setShowImg={setShowImg}
                uri={content}
                height={(widthConvert / imgW) * imgH}
                widthImg={widthConvert}
                indexItem={`${indexItem}-${index}-img`}
                isAnwser
              />
            } else if (type === 'ul') {
              return (
                <View key={indexRow + indexItem + 'ul' + index}>
                  {
                    content.map((itemCont, indexLi) => <Text key={indexRow + indexItem + 'li' + indexLi + index} style={{ fontSize: 18 }}>{`${indexLi + 1} ${itemCont}`}</Text>)
                  }
                </View>
              )
            } else if (type === 'table') {
              return (
                <View>
                  <RenderTable
                    key={indexRow + indexItem + 'table' + index}
                    style={{
                      // marginTop: 70, 
                      width: width - 20,
                      // backgroundColor: 'red',
                      // height: 400,
                    }}
                    content={content} />
                </View>)
            } else if (type == 'audio') {
              return <View style={{ width: width - 20 }}>
                <Sound url={content} />
              </View>
            } else if (type == 'ads') {
              return <BannerAd type={index} />
            }
            else return null;
          })
        }

      </View>

    )

  } catch (err) {
    // console.log('asfasfasfasfdasdfasdfasdfasfasdfasdfasdf', err)
  }
}

export default RenderData;