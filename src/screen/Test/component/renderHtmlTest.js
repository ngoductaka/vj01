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
    FlatList,
    TouchableOpacity
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import Toast from 'react-native-simple-toast';

import { WebView } from 'react-native-webview';
import { get, isEmpty } from 'lodash';
import HTML from 'react-native-render-html';
import {
    IGNORED_TAGS, alterNode, makeTableRenderer,
    cssRulesFromSpecs, defaultTableStylesSpecs,

} from 'react-native-render-html-table-bridge';
import FastImage from 'react-native-fast-image'

const cssRules = cssRulesFromSpecs(defaultTableStylesSpecs);

import Sound from '../../../component/Sound';
import { COLOR } from '../../../handle/Constant';
import MathJax from '../../../utils/custom_web_view';

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

export const ImageSVG = props => {
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

const RenderImg = ({ uri, height, widthImg, indexItem, setShowImg = () => { } }) => {
    try {
        if (!uri) { console.log('uriuriuriuri', uri); return null };

        if (height && widthImg) {
            return (
                <TouchableOpacity onPress={() => {
                    Toast.showWithGravity("Click 2 lần để phóng to", Toast.SHORT, Toast.CENTER);
                    setShowImg({ uri, size: { height, width: widthImg } })
                }} key={indexItem + 'img'} style={{ height, width: widthImg > width ? width - 5 : widthImg }}>
                    <Image
                        resizeMode="contain"
                        style={{ flex: 1, height: null, width: null }}
                        source={{
                            uri,
                            // priority: FastImage.priority.normal,
                        }}
                    // resizeMode={FastImage.resizeMode.contain}
                    />
                </TouchableOpacity>
            )
        }
        const [size, setSize] = useState(null)
        const onSuccess = useCallback(
            (width, height) => {
                const cWidth = getWidth(width);
                setSize({ height: height * (cWidth / width), width: cWidth });
            }
            , [uri]);

        useEffect(() => {
            try {
                Image.getSize(uri, onSuccess, () => {
                    setSize(null)
                });
            } catch (err) {
                console.log('asdfasdf34234', err)
            }
        }, [uri])
        return (
            <TouchableOpacity
                onPress={() => {
                    Toast.showWithGravity("Click 2 lần để phóng to", Toast.SHORT, Toast.CENTER);
                    setShowImg({ uri, size })
                }}
                key={indexItem + 'img'}
                style={size || {}}
            >
                {size && uri ?
                    <Image
                        resizeMode="contain"
                        style={{ flex: 1, height: null, width: null }}
                        source={{
                            uri,
                            // priority: FastImage.priority.normal,
                        }}
                    // resizeMode={FastImage.resizeMode.contain}
                    />
                    : null}
            </TouchableOpacity>
        )
    } catch (err) {

    }
}

const getWidth = (svgWidth, type) => {
    if (type == "answer" || type == 'reason') return svgWidth >= width - 71 ? width - 71 : svgWidth
    return svgWidth >= width - 35 ? width - 35 : svgWidth
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

const RenderData = ({ typeRender = "", indexItem = '', content, setShowImg = () => { } }) => {
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
                data.map((row, indexRow) => RenderRow({ indexItem, row, indexRow, typeRender, setShowImg }))
            }
        </View >
    )
}
// 
export const RenderRow = ({ indexItem = '', row, indexRow, typeRender, setShowImg = () => { } }) => {
    try {

        return (
            <View key={`${indexItem}_row_${indexRow}`} style={styleContent.viewRow}>
                {typeRender == 'reason' && indexRow == 0 ? <Text style={{ fontSize: 20, color: COLOR.CORRECT }}>Đáp án:</Text> : null}
                {
                    row.map(({ type = '', content, params = {} }, index) => {
                        if (type == 'text_bold') {
                            return <RenderItemPow
                                key={indexRow + indexItem + index + 'text'}
                                indexRow={index}
                                content={content}
                                style={{ fontSize: 22, fontWeight: '600' }}
                            />
                        }
                        if (type == 'text_title') {
                            return <RenderItemPow
                                key={indexRow + indexItem + index + 'text'}
                                indexRow={index}
                                content={content}
                                style={{ fontSize: 26, fontWeight: '900' }}
                            />
                        } else if (type === 'text') {
                            return <RenderItemPow
                                key={indexRow + indexItem + index + 'text'}
                                indexRow={index}
                                content={content}
                            />
                        } else if (type === 'svg') {
                            const { height: svgH = 5, width: svgW = 20 } = params;
                            if (isNaN(svgH) || isNaN(svgW)) return null;
                            if (!content.includes('svg')) {
                                return null;
                            }
                            const heightConvert = svgH * 10;
                            const widthConvert = getWidth(svgW * 10, typeRender);
                            if (widthConvert > width - 150 && typeRender != 'answer') {
                                return (
                                    <TouchableOpacity
                                        key={indexRow + indexItem + index + 'ios_svg'}
                                        onPress={() => {
                                            Toast.showWithGravity("Click 2 lần để phóng to", Toast.SHORT, Toast.CENTER);
                                            setShowImg({
                                                type: 'svg',
                                                content,
                                                size: {
                                                    width: widthConvert, height: heightConvert
                                                }
                                            })
                                        }}
                                    >
                                        <SvgXml
                                            xml={content}
                                            width={widthConvert}
                                            height={heightConvert}
                                            color="#000"
                                        />
                                        {/* {
                                            Platform.OS === 'ios' ?
                                                <SvgXml
                                                    xml={content}
                                                    width={widthConvert}
                                                    height={heightConvert}
                                                    color="#000"
                                                /> :
                                                <ImageSVG
                                                    source={{ uri: `data:image/svg+xml;utf8,` + content }}
                                                    style={{ height: heightConvert, width: widthConvert }}
                                                />
                                        } */}
                                    </TouchableOpacity>
                                )
                            }
                            return (
                                Platform.OS === 'ios' ?
                                    <SvgXml
                                        xml={content}
                                        width={widthConvert}
                                        height={heightConvert}
                                        color="#000"
                                    /> :
                                    <ImageSVG
                                        source={{ uri: `data:image/svg+xml;utf8,` + content }}
                                        style={{ height: heightConvert, width: widthConvert }}
                                    />
                            )

                        } else if (type.includes('sub') || type.includes('sub')) {
                            return <RenderItemPow key={indexRow + indexItem + index + 'sub'} type={type} content={content} />
                        } else if (type === 'img') {
                            const { height: imgH = 0, width: imgW = 0 } = params;
                            if (isNaN(imgH) || isNaN(imgW)) return null;
                            const widthConvert = getWidth(imgW, typeRender);
                            // return RenderImg(content, imgH, widthConvert, `${indexItem}-${index}-img`, typeRender)
                            return <RenderImg
                                setShowImg={setShowImg}
                                uri={content}
                                height={imgH}
                                widthImg={widthConvert}
                                indexItem={`${indexItem}-${index}-img`}
                                key={`${indexItem}-${index}-img`}
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
                            return <RenderTable key={indexRow + indexItem + 'table' + index} style={{ height: 400, width: width }} content={content} />
                        } else if (type === 'mathml') {
                            return <MathJax html={content} />
                          }
                    })
                }

            </View>
        )

    } catch (err) {
    }
}
const styleContent = StyleSheet.create({
    viewRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap'
    }
})

export default RenderData;