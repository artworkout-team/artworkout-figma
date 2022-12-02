import React, { useEffect, useState } from 'react'
import { emit, on } from '../../events'
import { Tabs, Tab, Button, Stack } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import DisplayForm from './DisplayForm'
import InitParse from './InitParse'
import { userStore } from '../models/user'
import { PublishTab } from './PublishTab'
import { pluginApi } from '../../rpc-api'

function App() {
  const [textareaValue, setTextareaValue] = useState('')
  useEffect(() => {
    return on('print', setTextareaValue)
  })

  useEffect(() => {
    InitParse()
    userStore.loadUser()
  }, [])

  function getLineNumber() {
    let tArea = document.querySelector('#output') as HTMLTextAreaElement
    return tArea.value.substr(0, tArea.selectionStart).split('\n').length
  }

  function selectError() {
    emit('selectError', getLineNumber() - 1)
  }

  async function exportTexts() {
    setTextareaValue(
      (await pluginApi.exportTexts())
        .map((s) => {
          return `"${s}" = "${s}";`
        })
        .join('\n')
    )
  }

  return (
    <Tabs defaultActiveKey='tune' className='m-1'>
      <Tab eventKey='create' title='Create' className='m-2 text-center'>
        <Button onClick={() => emit('createLesson')} className='m-2'>
          Create lesson
        </Button>
        {/* <Button>Set animations (CONFIRM)</Button> */}
        <Button onClick={() => emit('separateStep')}>Separate step</Button>
      </Tab>

      <Tab eventKey='tune' title='Tune' className='m-2'>
        <DisplayForm />
      </Tab>

      <Tab eventKey='format' title='Format' className='m-2'>
        <Stack gap={2}>
          <div>
            <Button className='m-1' onClick={() => emit('lintCourse')}>
              Lint course
            </Button>
            <Button className='m-1' onClick={() => emit('lintPage')}>
              Lint page
            </Button>
            <Button className='m-1' onClick={() => emit('autoFormat')}>
              Auto format
            </Button>
            <Button className='m-1' onClick={() => emit('formatOrder')}>
              Format order
            </Button>
            <Button className='m-1' onClick={exportTexts}>
              Texts
            </Button>
          </div>
          <textarea
            value={textareaValue}
            onChange={() => {}}
            onClick={selectError}
            id='output'
            style={{ whiteSpace: 'pre', overflow: 'auto' }}
            cols={83}
            rows={18}
          ></textarea>
        </Stack>
      </Tab>

      <Tab eventKey='publish' title='Publish' className='m-2'>
        <PublishTab />
      </Tab>
    </Tabs>
  )
}

export default App
