import JSZip from 'jszip'
import { saveAs } from 'file-saver'

let zip = JSZip()

const download = (productName) => {
  zip.generateAsync({ type: 'blob' }).then(function (blob) {
    saveAs(blob, `${productName}.zip`)
  })
}

async function createFile(url, fileName) {
  let response = await fetch(url)
  let data = await response.blob()
  let metadata = {
    type: 'image/jpeg',
  }
  // ... do something with the file or return it
  return new File([data], fileName, metadata)
}

export default function downloadZip(arr, productName) {
  const modifiedArr = arr.map((item) => {
    const file = createFile(item.image_url, item.image)
    return { ...item, file: file }
  })
  if (arr.length) {
    for (const element of modifiedArr) {
      zip.file(element.image, element.file, {
        binary: true,
      })
    }

    download(productName)
  }
}
