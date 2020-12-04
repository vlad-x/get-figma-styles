const { 
  downloadDoc,
  getTeamStyles, 
  getDocStyles 
} = require('./index')
const fs = require('fs')

const { FILE_ID, API_KEY, TEAM_ID } = process.env

const example = async () => {
  const doc = await downloadDoc(API_KEY, FILE_ID)
  fs.writeFileSync('figma.json', JSON.stringify(doc, 0, 2))
  // const doc = JSON.parse(fs.readFileSync('figma.json', 'utf-8'))

  const styles = await getDocStyles(doc, await getTeamStyles(API_KEY, TEAM_ID, { page_size: 1000 }))
  console.log('styles', arrangeByPages(styles))
}


const arrangeByPages = doc => {
  const pages = {}
  const {     
    name,
    lastModified,
    version,
    ...styles
  } = doc
  // console.log('====>', styles)
  Object.keys(styles).map(type => {
    Object.keys(styles[type]).map(id => {
      const item = styles[type][id]
      pages[item.page] = pages[item.page] || {}
      pages[item.page][type] = pages[item.page][type] || {}
      pages[item.page][type][id] = item
    })
  })
  return {
    name,
    lastModified,
    version,    
    pages
  }
}
example().catch(err => console.error(err))
