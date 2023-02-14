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
  const [stepOrder, setStepOrder] = useState(1)
  const [stepCount, setStepCount] = useState(1)
  const [shadowSize, setShadowSize] = useState(0)
  const [brushSize, setBrushSize] = useState(0)
  const [steps, setSteps] = useState([])
  const [suggestedBrushSize, setSuggestedBrushSize] = useState(0)

  const [mutex, setMutex] = useState(true)

  function onStepOrderChange(event: ChangeEvent) {
    setStepOrder(parseInt((event.target as HTMLInputElement).value))
  }

  function onDisplayModeChange(event: FormEvent) {
    setDisplayMode((event.target as HTMLInputElement).value)
  }

  function onTemplateChange(event: FormEvent) {
    const targetSelect = event.target as HTMLSelectElement
    if (targetSelect.value === 'multistep-bg') {
      setShadowSize(0)
    }
    setTemplate(targetSelect.value)
  }

  async function onListUpdate(selectedNode) {
    let sns = await pluginApi.getSteps()
    setSteps(sns)
    let index = sns.findIndex((node) => node.id === selectedNode.id)
    setStepOrder(index + 1)
  }

  useEffect(() => {
    if (!mutex) {
      emit('updateDisplay', { displayMode, stepOrder })
    }
  }, [stepOrder, displayMode])

  useEffect(() => {
    if (!mutex) {
      emit('updateProps', {
        shadowSize,
        brushSize,
        stepOrder,
        template,
      })
      emit('updateDisplay', { displayMode, stepOrder })
    }
  }, [shadowSize, brushSize, template])

  useEffect(() => {
    on(
      'updateForm',
      async (settings: {
        shadowSize: number
        brushSize: number
        suggestedBrushSize: number
        stepCount: number
        stepOrder: number
        displayMode: string
        template: string
      }) => {
        setMutex(true)
        setShadowSize(settings.shadowSize)
        setBrushSize(settings.brushSize)
        setSuggestedBrushSize(settings.suggestedBrushSize)
        setStepCount(settings.stepCount)
        setStepOrder(settings.stepOrder)
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
    () => setStepOrder((prev) => (prev + 1 < stepCount ? prev + 1 : stepCount)),
    { enableOnTags }
  )
  useHotkeys('k', () => setStepOrder((prev) => (prev > 1 ? prev - 1 : 1)), {
    enableOnTags,
  })
  useHotkeys('g', () => setStepOrder(1), { enableOnTags })
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
                value={stepOrder}
                min={1}
                max={stepCount}
                onChange={onStepOrderChange}
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
              <Form.Select value={template} onChange={onTemplateChange}>
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
            <Col xs={3}>
              <button
                type='button'
                className='btn btn-outline-light'
                style={{
                  width: '100%',
                  border: '1px solid lightgray',
                  color: 'darkgray',
                }}
                onClick={() => setBrushSize(suggestedBrushSize)}
              >
                {suggestedBrushSize}
              </button>
            </Col>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <StepList
          steps={steps}
          selectedStep={steps[stepOrder - 1]}
          onUpdate={onListUpdate}
        />
      </Row>
    </>
  )
}

export default DisplayForm
