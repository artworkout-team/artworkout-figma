import React, { useEffect, useState } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import TuneForm from './TuneForm'
import InitParse from './InitParse'
import { userStore } from '../models/user'
import { PublishTab } from './PublishTab'
import { FormatTab } from './FormatTab'
import { CreateTab } from './createLessonForm/CreateTab'
import './App.css'
import { pluginApi } from '../../rpc-api'
import { ResizeIcon } from './assets/bootstrapIcons'
import { LessonMetaForm } from "./createLessonForm/LessonMetaForm"

function App() {
  const [wideMode, setWideMode] = useState(true)

  useEffect(() => {
    InitParse()
    userStore.loadUser()
  }, [])

  function toggleWideMode() {
    pluginApi.resizeUi(wideMode)
    setWideMode(!wideMode)
  }

  return (
    <div className='App'>
      <Tabs defaultActiveKey='tune' className='m-1'>
        <Tab eventKey='create' title='Create' className='m-2 text-center'>
          <CreateTab />
        </Tab>

        <Tab eventKey='tune' title='Tune' className='m-2'>
          <TuneForm />
        </Tab>

        <Tab eventKey='meta' title='Meta' className='m-2'>
          <LessonMetaForm />
        </Tab>

        <Tab eventKey='format' title='Format' className='m-2'>
          <FormatTab />
        </Tab>

        <Tab eventKey='publish' title='Publish' className='m-2'>
          <PublishTab />
        </Tab>
      </Tabs>
      <button onClick={toggleWideMode} className='resize-button'>
        <ResizeIcon />
      </button>
  </div>
  )
}

export default App
