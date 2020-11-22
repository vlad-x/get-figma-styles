const fs = require('fs')
const fetch = require('node-fetch')

const { DEBUG } = process.env

const types = {
  FILL: 1,
  TEXT: 1,
  EFFECT: 1,
  GRID: 1
}

const downloadDoc = async (apiKey, id) => {
  const params = {
    headers: { 'X-FIGMA-TOKEN': apiKey }
  }
  const url = `https://api.figma.com/v1/files/${id}?geometry=paths`
  console.log('Downloading figma doc', id)
  const res = await fetch(url, params)
  const obj = await res.json()

  return obj
}

const pluralize = str =>
  str.charAt(str.length - 1) === 's'
    ? str
    : str + 's'

const getPropType = type =>
  type === 'text'
    ? 'style'
    : type === 'grid'
      ? 'layoutGrids'
      : pluralize(type)

const getSafeProp = (prop) =>
  prop instanceof Array
    ? prop[0]
    : prop

const iterateDoc = (item, map) => {
  if (!item) return

  const styles = item.styles || {}

  Object.keys(styles).map(type => {
    const pluralType = pluralize(type)
    const propType = getPropType(type)
    const styleId = styles[type]

    DEBUG && console.log('styles types', type, styles[type], propType, item[propType])
    map[pluralType][styleId] = getSafeProp(item[propType])
  })

  return (item.children || []).map(item => iterateDoc(item, map))
}

const getDocStyles = async doc => {
  const { styles, components, document } = doc
  DEBUG && console.log('styles', styles)

  const { name, lastModified, version } = doc
  const styleMap = {
    name,
    lastModified,
    version,
    fills: {},
    strokes: {},
    effects: {},
    texts: {},
    grids: {}
  }

  iterateDoc(document, styleMap)

  Object.keys(styles)
    .map(key => {
      const style = styles[key]
      // console.log('STYLE', style.styleType, style)
      const type = pluralize(style.styleType.toLowerCase())
      DEBUG && console.log('style', type, key)
      if (styleMap[type][key]) {
        styleMap[type][key] = Object.assign(styleMap[type][key], style)
      } else {
        DEBUG && console.log('missing style', type, style)
      }
    })

  return styleMap
}

module.exports = {
  downloadDoc,
  getDocStyles
}
