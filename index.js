const fetch = require('node-fetch')
const qs = require('qs')

const { DEBUG } = process.env

const types = {
  FILL: 1,
  TEXT: 1,
  EFFECT: 1,
  GRID: 1
}

const request = async (apiKey, path, query) => {
  const opts = {
    headers: { 'X-FIGMA-TOKEN': apiKey }
  }
  const params = query ? qs.stringify(query) : ''
  const url = `https://api.figma.com/${path}?${params}`
  console.log('GET', url)
  const res = await fetch(url, opts)
  const obj = await res.json()
  return obj
}

const downloadDoc = async (apiKey, id, query = {}) => {
  console.log('Downloading figma doc', id)
  return request(apiKey, `v1/files/${id}`, { ...query, geometry: 'paths' })
}

const getMe = async (apiKey) => {
  return request(apiKey, 'v1/me')
}

const getTeamStyles = async (apiKey, teamId, query) => {
  return (await request(apiKey, `v1/teams/${teamId}/styles`, query)).meta.styles
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

const iterateDoc = (item, map, pageName) => {
  if (!item) return

  const styles = item.styles || {}
  if (item.type === 'CANVAS') {
    pageName = item.name
  }

  Object.keys(styles).map(type => {
    const pluralType = pluralize(type)
    const propType = getPropType(type)
    const styleId = styles[type]

    DEBUG && console.log('styles types', type, styles[type], propType, item[propType])
    map[pluralType][styleId] = getSafeProp(item[propType])
    if (pageName) {
      map[pluralType][styleId].page = pageName
    }
  })

  return (item.children || []).map(item => iterateDoc(item, map, pageName))
}

const getDocStyles = async (doc, teamStyles) => {
  const { styles, document } = doc
  DEBUG && console.log('styles', styles, 'teamStyles', teamStyles)

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
      
      const type = pluralize(style.styleType.toLowerCase())
      DEBUG && console.log('style', type, key)

      if (teamStyles) {
        const meta = teamStyles.filter(s => s.key === style.key).pop()
        if (meta) {
          style.meta = meta
        }
      }
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
  getMe,
  getTeamStyles,
  getDocStyles
}
