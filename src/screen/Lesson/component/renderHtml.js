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
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';

import { WebView } from 'react-native-webview';
import { get } from 'lodash';
import MathJax from '../../../utils/custom_web_view';

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

const RenderImg = (uri, height, widthImg, indexItem) => {
    if (height && widthImg) {
        return (
            <View key={indexItem + 'img'} style={{ height, width: widthImg > width ? width - 5 : widthImg }}>
                <Image
                    style={{ flex: 1, height: undefined, width: undefined }}
                    resizeMode="contain"
                    source={{ uri: uri }}
                />
            </View>
        )
    }
    const [size, setSize] = useState({ width: 200, height: 50 })
    const onSuccess = useCallback(
        (width, height) => {
            setSize({ height, width: getWidth(width) });
        }
        , [uri]);

    useEffect(() => {
        Image.getSize(uri, onSuccess);
    }, [uri])
    return (
        <View key={indexItem + 'img'} style={size}>
            <Image
                style={{ flex: 1, height: undefined, width: undefined }}
                resizeMode="contain"
                source={{ uri: uri }}
            />
        </View>
    )
}

const getWidth = (svgWidth) => {
    return svgWidth >= width - 10 ? width - 10 : svgWidth
}

const RenderItemPow = ({ content = '', indexRow }) => {
    return content.split(' ').map((i, indexP) => <Text key={indexRow + 'row1' + indexP} style={styleItem.text}>{' ' + i}</Text>);
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
    text: { fontSize: 20, color: '#000' },
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
                data.map((row, indexRow) => {
                    return (
                        <View key={`${indexItem}_row_${indexRow}`} style={styles.viewRow}>
                            {
                                row.map(({ type = '', content, params = {} }, index) => {
                                    if (type === 'text') return <RenderItemPow key={indexRow + indexItem + index + 'text'} indexRow={index} content={content} />
                                    else if (type === 'svg') {
                                        const { height: svgH = 5, width: svgW = 20 } = params;
                                        if (isNaN(svgH) || isNaN(svgW)) return null;
                                        if (!content.includes('svg')) {
                                            return null;
                                        }
                                        const heightConvert = svgH * 10;
                                        const widthConvert = getWidth(svgW * 10);
                                        if (Platform.OS === 'ios') {
                                            return (
                                                <SvgXml
                                                    key={indexRow + indexItem + index + 'ios_svg'}
                                                    xml={content} width={widthConvert}
                                                    height={heightConvert}
                                                    color="#000" />
                                            )
                                        }
                                        return <ImageSVG
                                            key={indexRow + indexItem + index + 'android'}
                                            source={{ uri: `data:image/svg+xml;utf8,` + content }}
                                            style={{ height: heightConvert, width: widthConvert }}
                                        />

                                    } else if (type.includes('sub') || type.includes('sub')) {
                                        return <RenderItemPow key={indexRow + indexItem + index + 'sub'} type={type} content={content} />
                                    } else if (type === 'img') {
                                        const { height: imgH = 0, width: imgW = 0 } = params;
                                        if (isNaN(imgH) || isNaN(imgW)) return null;
                                        const widthConvert = getWidth(imgW);
                                        return RenderImg(content, imgH, widthConvert, `${indexItem}-${index}-img`)
                                    } else if (type === 'ul') {
                                        return (
                                            <View key={indexRow + indexItem + 'ul' + index}>
                                                {
                                                    content.map((itemCont, indexLi) => <Text key={indexRow + indexItem + 'li' + indexLi + index} style={{ fontSize: 18 }}>{`${indexLi + 1} ${itemCont}`}</Text>)
                                                }
                                            </View>
                                        )
                                    } else if (type === 'table') {
                                        return <RenderTable key={indexRow + indexItem + 'table' + index} style={{ height: 400, width: width }} content={content} />
                                    } else if (type === 'mathml') {
                                      return <MathJax html={content} />
                                    }
                                })
                            }

                        </View>
                    )
                })
            }
        </View >
    )
}

export default RenderData;