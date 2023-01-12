import React, { useEffect } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import DisplayForm from './DisplayForm'
import InitParse from './InitParse'
import { userStore } from '../models/user'
import { PublishTab } from './PublishTab'
import { FormatTab } from './FormatTab'
import { CreateTab } from './CreateTab'

function App() {
  useEffect(() => {
    InitParse()
    userStore.loadUser()
  }, [])

  return (
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
  )
}

export default App
