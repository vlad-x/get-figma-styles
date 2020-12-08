# get-figma-styles

A small utility to download a Figma doc from the API and sort out all "Local styles" into a single object.

Currently supports text, fill, stroke, grid and effect styles.

## Example
1. get the Figma file ID
https://www.figma.com/file/<FILE_ID>/....
(between the slashes)

2. get your Figma API key:
go to your profile and create a new token in the
Personal Access Tokens section

3. set environment variables>:

`export FILE_ID=...your file id`
and
`export API_KEY=...your figma token`

run the example:

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

# Contributors
[![Geopic](https://avatars0.githubusercontent.com/u/29524044?s=32&u=bae6d7c1bf20e6fcd6d0e0e6d9ebab7e1fe5749d&v=4)](https://github.com/geopic) Geopic - TypeScript definitions

