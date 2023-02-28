import React, { useEffect, useState } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import DisplayForm from './DisplayForm'
import InitParse from './InitParse'
import { userStore } from '../models/user'
import { PublishTab } from './PublishTab'
import { FormatTab } from './FormatTab'
import { CreateTab } from './CreateTab'
import './App.css'
import { AspectRatio } from 'react-bootstrap-icons'
import { pluginApi } from '../../rpc-api'

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
          <DisplayForm />
        </Tab>

        <Tab eventKey='format' title='Format' className='m-2'>
          <FormatTab />
        </Tab>

        <Tab eventKey='publish' title='Publish' className='m-2'>
          <PublishTab />
        </Tab>
      </Tabs>
        <AspectRatio className='resize-button' size={12} style={{color: '#000', opacity: 0.5}} onClick={()=> toggleWideMode()}/>
  </div>
  )
}

export default App
