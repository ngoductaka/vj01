import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { get } from 'lodash';

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

export default SvgImage;

// 
// const webViewScript = `
//   setTimeout(function() { 
//     window.postMessage(document.documentElement.scrollHeight); 
//   }, 500);
//   true; // note: this is required, or you'll sometimes get silent failures
// `;


// ...
// constructor(props) {
//     super(props);
//     this.state = {
//       webheight:100,
//     }

// ...

// <WebView style={{height: this.state.webheight}}
//   automaticallyAdjustContentInsets={false}
//   scrollEnabled={false}
//   source={{uri: "http://<your url>"}}
//   onMessage={event => {
//     this.setState({webheight: parseInt(event.nativeEvent.data)});
//   }}
//   javaScriptEnabled={true}
//   injectedJavaScript ={webViewScript}
//   domStorageEnabled={true}
// ></WebView>