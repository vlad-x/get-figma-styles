# get-figma-styles

A small utility to download a Figma doc from the API and sort out all "Local styles" into a single object.

Currently supports text, fill, stroke, grid and effect styles.

## Example

```js
const { downloadDoc, getDocStyles } = require('get-figma-styles')

const { FILE_ID, API_KEY } = process.env

const example = async () => {
  const doc = await downloadDoc(API_KEY, FILE_ID)

  // the doc can be saved on disk to save downloading time during development
  // fs.writeFileSync('figma.json', JSON.stringify(doc, 0, 2))

  const styles = await getDocStyles(doc)
  console.log('styles', styles)

  /* will print an object of the following structure
  {
    fills: {...},
    strokes: {...},
    effects: {...},
    texts: {...},
    grids: {...}
  }*/
}

example().catch(err => console.error(err))
```