import React, { useEffect, useState, ChangeEvent } from 'react'
import { Stack, Button } from 'react-bootstrap'
import { emit, on } from '../../events'
import { pluginApi } from '../../rpc-api'

export function FormatTab() {
  const [textareaValue, setTextareaValue] = useState('')

  useEffect(() => on('print', setTextareaValue))

  function getLineNumber() {
    let tArea = document.querySelector('#output') as HTMLTextAreaElement
    return tArea.value.substr(0, tArea.selectionStart).split('\n').length
  }

  function selectError() {
    emit('selectError', getLineNumber() - 1)
  }

  async function exportTexts() {
    setTextareaValue(
      (await pluginApi.exportTexts()).map((s) => `"${s}" = "${s}";`).join('\n')
    )
  }

  async function importTexts() {
    let errorMessage: string
    const regexp = /^"(.+)"\s*=\s*"(.*)";$/g
    let texts = {}
    textareaValue
      .replace(/\/\*.*?\*\//g, '')
      .split('\n')
      //.map((str) => str.split('//')[0])
      .map((str) => str.trim())
      .filter((str) => str.length > 0)
      .forEach((str) => {
        const match = str.matchAll(regexp).next().value
        if (match) {
          const key = match[1]
          const value = match[2]
          if (!texts[key]) {
            texts[key] = value
          } else {
            errorMessage = `Duplicate key: ${key}`
          }
        } else {
          errorMessage = `Invalid string: ${str}`
        }
      })
    if (errorMessage) {
      await pluginApi.displayNotification(errorMessage)
      return
    }
    await pluginApi.importTexts(texts)
  }

  function handleTextAreaValue(event: ChangeEvent) {
    setTextareaValue((event.target as HTMLTextAreaElement).value)
  }

  return (
    <Stack gap={2}>
      <div>
        <Button className='plugin-btn' onClick={() => emit('lintCourse')}>
          Lint course
        </Button>
        <Button className='plugin-btn' onClick={() => emit('lintPage')}>
          Lint page
        </Button>
        <Button className='plugin-btn' onClick={() => emit('autoFormat')}>
          Auto format
        </Button>
        <Button className='plugin-btn' onClick={() => emit('formatOrder')}>
          Format order
        </Button>
        <Button className='plugin-btn' onClick={exportTexts}>
          Export Texts
        </Button>
        <Button className='plugin-btn' onClick={importTexts}>
          Import Texts
        </Button>
      </div>
      <textarea
        value={textareaValue}
        onChange={handleTextAreaValue}
        onClick={selectError}
        id='output'
        style={{ whiteSpace: 'pre', overflow: 'auto' }}
        cols={83}
        rows={18}
      ></textarea>
    </Stack>
  )
}
