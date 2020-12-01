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

  const styles = await getDocStyles(doc, await getTeamStyles(API_KEY, TEAM_ID))
  console.log('styles', styles)
}

example().catch(err => console.error(err))
