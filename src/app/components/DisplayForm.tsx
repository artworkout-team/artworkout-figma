import React, {
  ChangeEvent,
  FormEvent,
  Fragment,
  useEffect,
  useState,
} from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import { emit, on } from '../../events'
import { useHotkeys } from 'react-hotkeys-hook'
import { pluginApi } from '../../rpc-api'
import { StepList } from './StepList'

function DisplayForm() {
  const [displayMode, setDisplayMode] = useState('all')
  const [template, setTemplate] = useState('')
  const [stepNumber, setStepNumber] = useState(1)
  const [stepCount, setStepCount] = useState(1)
  const [shadowSize, setShadowSize] = useState(0)
  const [brushSize, setBrushSize] = useState(0)
  const [steps, setSteps] = useState([])

  const [mutex, setMutex] = useState(true)

  function onStepNumberChange(event: ChangeEvent) {
    setStepNumber(parseInt((event.target as HTMLInputElement).value))
  }

  function onDisplayModeChange(event: FormEvent) {
    setDisplayMode((event.target as HTMLInputElement).value)
  }

  async function onListUpdate(selectedNode) {
    let sns = await pluginApi.getSteps()
    setSteps(sns)
    let index = sns.findIndex((node) => node.id === selectedNode.id)
    setStepNumber(index + 1)
  }

  useEffect(() => {
    if (!mutex) {
      emit('updateDisplay', { displayMode, stepNumber })
    }
  }, [stepNumber, displayMode])

  useEffect(() => {
    if (!mutex) {
      emit('updateProps', { shadowSize, brushSize, stepNumber, template })
      emit('updateDisplay', { displayMode, stepNumber })
    }
  }, [shadowSize, brushSize, template])

  useEffect(() => {
    on(
      'updateForm',
      async (settings: {
        shadowSize: number
        brushSize: number
        stepCount: number
        stepNumber: number
        displayMode: string
        template: string
      }) => {
        setMutex(true)
        setShadowSize(settings.shadowSize)
        setBrushSize(settings.brushSize)
        setStepCount(settings.stepCount)
        setStepNumber(settings.stepNumber)
        setDisplayMode(settings.displayMode)
        setTemplate(settings.template)
        setSteps(await pluginApi.getSteps())
        setMutex(false)
      }
    )
  }, []) // once

  const enableOnTags: any = ['INPUT', 'TEXTAREA', 'SELECT']

  useHotkeys(
    'j',
    () =>
      setStepNumber((prev) => (prev + 1 < stepCount ? prev + 1 : stepCount)),
    { enableOnTags }
  )
  useHotkeys('k', () => setStepNumber((prev) => (prev > 1 ? prev - 1 : 1)), {
    enableOnTags,
  })
  useHotkeys('g', () => setStepNumber(1), { enableOnTags })
  useHotkeys('q', () => setDisplayMode('all'), { enableOnTags })
  useHotkeys('c', () => setDisplayMode('current'), { enableOnTags })
  useHotkeys('p', () => setDisplayMode('previous'), { enableOnTags })
  useHotkeys('t', () => setDisplayMode('template'), { enableOnTags })
  useHotkeys('d', () => setBrushSize((prev) => (prev += 5)), { enableOnTags })
  useHotkeys('a', () => setBrushSize((prev) => (prev - 5 > 0 ? prev - 5 : 0)), {
    enableOnTags,
  })
  useHotkeys('w', () => setShadowSize((prev) => (prev += 5)), { enableOnTags })
  useHotkeys(
    's',
    () => setShadowSize((prev) => (prev - 5 > 0 ? prev - 5 : 0)),
    { enableOnTags }
  )

  return (
    <>
      <Row className='mb-2'>
        <Col xs={5}>
          <Form.Group as={Row}>
            <Form.Label column xs={5}>
              Step (JK)
            </Form.Label>
            <Col>
              <Form.Control
                type='number'
                value={stepNumber}
                min={1}
                max={stepCount}
                onChange={onStepNumberChange}
              />
            </Col>
          </Form.Group>
        </Col>
        <Col>
          <Form.Check
            id='displayModeAll'
            type='radio'
            name='displayMode'
            value='all'
            label='(Q) All'
            onChange={onDisplayModeChange}
            checked={displayMode == 'all'}
          />
          <Form.Check
            id='displayModeCurrent'
            type='radio'
            name='displayMode'
            value='current'
            label='(C)urrent'
            onChange={onDisplayModeChange}
            checked={displayMode == 'current'}
          />
          <Form.Check
            id='displayModePrevious'
            type='radio'
            name='displayMode'
            value='previous'
            label='(P)revious'
            onChange={onDisplayModeChange}
            checked={displayMode == 'previous'}
          />
          <Form.Check
            id='displayModeTemplate'
            type='radio'
            name='displayMode'
            value='template'
            label='(T)emplate'
            onChange={onDisplayModeChange}
            checked={displayMode == 'template'}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group as={Row} className='mb-2'>
            <Form.Label column xs={5}>
              Template
            </Form.Label>
            <Col>
              <Form.Select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
              >
                <option value=''></option>
                <option value='multistep-brush'>brush</option>
                <option value='multistep-bg'>bg</option>
                <option value='multistep-result'>result</option>
              </Form.Select>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className='mb-2'>
            <Form.Label column xs={5}>
              Tolerance (SW)
            </Form.Label>
            <Col>
              <Form.Control
                type='number'
                min={0}
                value={shadowSize}
                onChange={(e) => setShadowSize(parseInt(e.target.value))}
                step={5}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className='mb-2'>
            <Form.Label column xs={5}>
              Brush size (AD)
            </Form.Label>
            <Col>
              <Form.Control
                type='number'
                min={0}
                value={brushSize}
                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                step={5}
              />
            </Col>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <StepList
          steps={steps}
          selectedStep={steps[stepNumber - 1]}
          onUpdate={onListUpdate}
        />
      </Row>
    </>
  )
}

export default DisplayForm
