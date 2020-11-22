const { downloadDoc, getDocStyles } = require('./index')
const fs = require('fs')

const { FILE_ID, API_KEY } = process.env

const example = async () => {
  const doc = await downloadDoc(API_KEY, FILE_ID)
  // fs.writeFileSync('figma.json', JSON.stringify(doc, 0, 2))
  // const doc = JSON.parse(fs.readFileSync('figma.json', 'utf-8'))

  const styles = await getDocStyles(doc)
  console.log('styles', styles)
}

example().catch(err => console.error(err))
