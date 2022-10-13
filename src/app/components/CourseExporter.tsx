import { useEffect } from 'react'
import { on } from '../../events'
import * as JSZip from 'jszip'

function CourseExporter() {
  function typedArrayToBuffer(array) {
    return array.buffer.slice(
      array.byteOffset,
      array.byteLength + array.byteOffset
    )
  }

  async function exportZip(message) {
    let { lessons, thumbnails, rootName } = message
    let zip = new JSZip()
    let files = lessons.concat(thumbnails)

    for (let file of files) {
      const { path, bytes } = file
      const cleanBytes = typedArrayToBuffer(bytes)
      let blob = new Blob([cleanBytes], { type: 'application/octet-stream' })
      zip.file(path, blob, { base64: true })
    }

    const content = await zip.generateAsync({ type: 'blob' })
    const blobURL = window.URL.createObjectURL(content)
    const link = document.createElement('a')
    link.className = 'button button--primary'
    link.href = blobURL
    link.download = `${rootName.replace('COURSE-', '')}.zip`
    link.click()
    // link.setAttribute('download', name + '.zip')
  }

  useEffect(() => {
    return on('exportZip', exportZip)
  }, [])

  return null
}

export default CourseExporter
