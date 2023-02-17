import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from 'react'
import {
  Form,
  Row,
  Col,
  ButtonGroup,
  Button,
  OverlayTrigger,
  Tooltip,
  ButtonToolbar,
  Dropdown,
} from 'react-bootstrap'
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
  const [suggestedBrushSize, setSuggestedBrushSize] = useState(0)

  const [clearLayers, setClearLayers] = useState([])
  const [clearBefore, setClearBefore] = useState(false)

  const [mutex, setMutex] = useState(true)

  function onStepNumberChange(event: ChangeEvent) {
    setStepNumber(parseInt((event.target as HTMLInputElement).value))
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
    setStepNumber(index + 1)
  }

  function onClearLayerChange(event: FormEvent) {
    const targetSelect = event.target as HTMLSelectElement
    let newClearLayer = clearLayers
    if (newClearLayer.includes(targetSelect.value)) {
      newClearLayer = newClearLayer.filter(
        (item) => item !== targetSelect.value
      )
    } else {
      newClearLayer.push(targetSelect.value)
    }
    setClearLayers([...newClearLayer])
  }

  function onClearBeforeChange() {
    // clear all layers before current step via index and set clearLayers to [] if not empty
    let newClearLayer
    if (clearBefore) {
      newClearLayer = []
      setClearBefore(false)
    } else {
      newClearLayer = steps
        .slice(0, stepNumber - 1)
        .map((step, index) => index + 1)
        setClearBefore(true)
    }
      setClearLayers([...newClearLayer])
  }

  useEffect(() => {
    if (!mutex) {
      emit('updateDisplay', { displayMode, stepNumber })
    }
  }, [stepNumber, displayMode])

  useEffect(() => {
    console.log('clearBefore', clearBefore)
    if (!mutex) {
      emit('updateProps', { shadowSize, brushSize, stepNumber, template, clearBefore, clearLayers })
      emit('updateDisplay', { displayMode, stepNumber })
    }
  }, [shadowSize, brushSize, template, clearLayers, clearBefore])

  useEffect(() => {
    on(
      'updateForm',
      async (settings: {
        shadowSize: number
        brushSize: number
        suggestedBrushSize: number
        stepCount: number
        stepNumber: number
        displayMode: string
        template: string
      }) => {
        setMutex(true)
        setShadowSize(settings.shadowSize)
        setBrushSize(settings.brushSize)
        setSuggestedBrushSize(settings.suggestedBrushSize)
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

  const renderStepOptions = (
    <Form.Group as={Row}>
      <Col xs={5}>
        <Form.Group as={Row}>
          <Form.Label column xs={5}>
            Step (JK)
          </Form.Label>
          <Col>
            <Form.Control
              type="number"
              value={stepNumber}
              min={1}
              max={stepCount}
              onChange={onStepNumberChange}
            />
          </Col>
        </Form.Group>
      </Col>
      <Col xs={5}>
        <ButtonToolbar>
          <ButtonGroup>
            <OverlayTrigger
              placement={'top'}
              overlay={<Tooltip id="button-tooltip-2">(Q) All</Tooltip>}>
              <Button id={'displayModeAll'} value={'all'} onClick={onDisplayModeChange}>Q</Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement={'top'}
              overlay={<Tooltip id="button-tooltip-2">(C)urrent</Tooltip>}>
              <Button id={'displayModeCurrent'} value={'current'} onClick={onDisplayModeChange}>C</Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement={'top'}
              overlay={<Tooltip id="button-tooltip-2">(P)revious</Tooltip>}>
              <Button id={'displayModePrevious'} value={'previous'} onClick={onDisplayModeChange}>P</Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement={'top'}
              overlay={<Tooltip id="button-tooltip-2">(T)emplate</Tooltip>}>
              <Button id={'displayModeTemplate'} value={'template'} onClick={onDisplayModeChange}>T</Button>
            </OverlayTrigger>
          </ButtonGroup>
        </ButtonToolbar>
      </Col>
    </Form.Group>
  )



  const renderDropdownElement = (step, index) => {
    //is this the right way to do this?
    const stepNumber = index + 1
    //is clearLayer include step number? if so, checked is true
    const checked = clearLayers.includes(stepNumber)
    return (
      <Dropdown.Item
        href={`#/action ${stepNumber}`}
        id={index}
        value={stepNumber}
      >
      <Row>
        <Col xs={3}>
          <Form.Check
            inline
            checked={checked}
            label={`step ${stepNumber}`}
            value={stepNumber}
            onChange={onClearLayerChange}
            />
        </Col>
      </Row>
    </Dropdown.Item>
    )
  }

  const renderClearLayerDropdown = (
    <Dropdown as={ButtonGroup} autoClose={false}>
      <Dropdown.Toggle id="dropdown-autoclose-false">
        Clear layer
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href="#/action-0">
          <Row>
            <Col xs={3}>
              <Form.Check
                inline
                label={'Clear before'}
                onChange={onClearBeforeChange}
              />
            </Col>
          </Row>
        </Dropdown.Item>
        <Dropdown.Divider/>
        {steps.map((step, index) => renderDropdownElement(step, index))}
      </Dropdown.Menu>
    </Dropdown>
  )


  return (
    <>
      {renderStepOptions}
      {renderClearLayerDropdown}
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
          selectedStep={steps[stepNumber - 1]}
          onUpdate={onListUpdate}
        />
      </Row>
    </>
  )
}

export default DisplayForm
