const font = {
    Roboto: {
        weights: {
            Black: '800',
            Bold: '700',
            SemiBold: '600',
            Light: '300',
            Regular: '400',
            Thin: '100'
        },
        styles: {
            Italic: 'italic'
        }
    }
}

export const fontStyles = {
    "Black": "Black",
    "Bold": "Bold",
    "SemiBold": "SemiBold",
    "Light": "Light",
    "Regular": "Regular",
    "Thin": "Thin",
}

// generate styles for a font with given weight and style
export const fontMaker = (options = {}) => {
    let { weight, style, family } = Object.assign({
        weight: null,
        style: null,
        family: 'Roboto'
    }, options)

    const { weights, styles } = font[family]

    if (Platform.OS === 'android') {
        weight = weights[weight] ? weight : ''
        style = styles[style] ? style : ''

        const suffix = weight + style

        return {
            fontFamily: family + (suffix.length ? `-${suffix}` : '')
        }
    } else {
        weight = weights[weight] || weights.Normal
        style = styles[style] || 'normal'

        return {
            fontFamily: family,
            fontWeight: weight,
            fontStyle: style
        }
    }
}