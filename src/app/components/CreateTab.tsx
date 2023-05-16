import React from 'react'
import { Button } from 'react-bootstrap'
import { pluginApi } from '../../rpc-api'

export function CreateTab() {
  async function handleSplitByColor() {
    await pluginApi.splitByColor()
    await pluginApi.updateDisplay({ displayMode: 'all', stepNumber: 1 })
  }

  return (
    <>
      <Button
        onClick={async () => pluginApi.createLesson()}
        className='plugin-btn'
      >
        Create lesson
      </Button>
      {/* <Button>Set animations (CONFIRM)</Button> */}
      <Button
        onClick={async () => pluginApi.separateStep()}
        className='plugin-btn'
      >
        Separate step
      </Button>
      <Button onClick={handleSplitByColor} className='plugin-btn'>
        Split by color
      </Button>
      <Button
        onClick={async () => pluginApi.joinSteps()}
        className='plugin-btn'
      >
        Join steps
      </Button>
    </>
  )
}
