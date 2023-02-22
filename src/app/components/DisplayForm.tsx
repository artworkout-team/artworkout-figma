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
import './DisplayForm.css'
import { ArrowLeft, ArrowRight, ArrowsMove, ArrowUp, Lightbulb, Magic, Pencil } from 'react-bootstrap-icons'

function DisplayForm() {
  const [displayMode, setDisplayMode] = useState('all')
  const [template, setTemplate] = useState('')
  const [stepNumber, setStepNumber] = useState(1)
  const [stepCount, setStepCount] = useState(1)
  const [shadowSize, setShadowSize] = useState(0)
  const [brushSize, setBrushSize] = useState(0)
  const [steps, setSteps] = useState([])
  const [suggestedBrushSize, setSuggestedBrushSize] = useState(0)
  const [brushType, setBrushType] = useState('pencil')

  const [clearLayers, setClearLayers] = useState<string[]>([])
  const [clearBefore, setClearBefore] = useState(false)

  const [animationTag, setAnimationTag] = useState<string>('')
  const [delay, setDelay] = useState<number>(0)
  const [repeat, setRepeat] = useState<number>(0)

  const [anotherTags, setAnotherTags] = useState<string[]>([])

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

  function onBrushTypeChange(event: FormEvent) {
    setBrushType((event.target as HTMLInputElement).value)
  }

  async function onListUpdate(selectedNode) {
    let sns = await pluginApi.getSteps()
    setSteps(sns)
    let index = sns.findIndex((node) => node.id === selectedNode.id)
    setStepNumber(index + 1)
  }

  function onClearLayerChange(stepNumber: string) {
    let newClearLayer = clearLayers
    if (newClearLayer.includes(stepNumber.toString())) {
      newClearLayer = newClearLayer.filter(
        (item) => item !== stepNumber.toString()
      )
    } else {
      newClearLayer.push(stepNumber.toString())
    }
    setClearLayers([...newClearLayer])
    setClearBefore(false)
  }

  function onClearBeforeChanged() {
    let newClearLayer = []
    if (clearBefore) {
      setClearLayers([...newClearLayer])
      setClearBefore(false)
    } else {
      if(clearLayers.length > 0) {
        newClearLayer = steps.reduce((acc, cur, index) => {
            if (index + 1 < stepNumber && !acc.includes((index + 1).toString())) {
              acc.push((index + 1).toString())
            }
            return acc
          }
          , [])
        setClearLayers([...newClearLayer])
        setClearBefore(true)
      }
      else{
        //add all steps before current step to clearLayers
        newClearLayer = steps.reduce((acc, cur, index) => {
            if (index + 1 < stepNumber) {
              acc.push((index + 1).toString())
            }
            return acc
          }, [])
        }
      setClearLayers([...newClearLayer])
      setClearBefore(true)
      }
    }

  function onAnotherTagChange(tag: string) {
    if(anotherTags.includes(tag)) {
      setAnotherTags(anotherTags.filter(item => item !== tag))
    } else {
      setAnotherTags([...anotherTags, tag])
    }
  }

  function onAnimationTagChange(tag: string) {
    if(tag === animationTag)  {
      setAnimationTag('')
    } else {
      setAnimationTag(tag)
    }
  }

  useEffect(() => {
    if (!mutex) {
      emit('updateDisplay', { displayMode, stepNumber })
    }
  }, [stepNumber, displayMode])

  useEffect(() => {
    if (!mutex) {
      emit('updateProps', {
        shadowSize,
        brushSize,
        stepNumber,
        template,
        clearLayers,
        clearBefore,
        anotherTags,
        brushType,
        animationTag,
        delay,
        repeat })
    }
  }, [animationTag, delay, repeat])

  useEffect(() => {
    if (!mutex) {
      setAnimationTag('')
      setDelay(0)
      setRepeat(0)
    }
  }, [stepNumber])

  useEffect(() => {
    if (!mutex) {
      emit('updateProps', { shadowSize, brushSize, stepNumber, template, clearLayers, clearBefore, anotherTags, brushType })
      emit('updateDisplay', { displayMode, stepNumber })
    }
  }, [shadowSize, brushSize, template, clearLayers, anotherTags, brushType])

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
        clearBefore: boolean
        clearLayers: string[]
        anotherTags: string[]
        brushType: string
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
        setClearBefore(settings.clearBefore)
        setClearLayers(settings.clearLayers)
        setAnotherTags(settings.anotherTags)
        setBrushType(settings.brushType)
        setMutex(false)
      }
    )
  }, []) // once

  const enableOnTags: any = ['INPUT', 'TEXTAREA', 'SELECT']
  const anotherTagsList: any = [
    {tag: 'fixed-size', name: 'Fixed size'},
    {tag: 'share-button', name: 'Share button'},
    {tag:'allow-undo', name: 'Allow undo'},
    {tag: 'layer', name: 'Layer'},
    {tag: 'resize-brush', name: 'Resize brush'},

  ]

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
      <Col>
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
      <Col>
        <ButtonToolbar>
          <ButtonGroup>
            <OverlayTrigger
              placement={'bottom'}
              overlay={<Tooltip className={'tooltip'} style={{position: 'fixed'}} id="button-tooltip-all">(Q) All</Tooltip>}>
              <Button id={'displayModeAll'} value={'all'} onClick={onDisplayModeChange}>Q</Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement={'bottom'}
              overlay={<Tooltip id="button-tooltip-current">(C)urrent</Tooltip>}>
              <Button id={'displayModeCurrent'} value={'current'} onClick={onDisplayModeChange}>C</Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement={'bottom'}
              overlay={<Tooltip id="button-tooltip-previous">(P)revious</Tooltip>}>
              <Button id={'displayModePrevious'} value={'previous'} onClick={onDisplayModeChange}>P</Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement={'bottom'}
              overlay={<Tooltip id="button-tooltip-template">(T)emplate</Tooltip>}>
              <Button id={'displayModeTemplate'} value={'template'} onClick={onDisplayModeChange}>T</Button>
            </OverlayTrigger>
          </ButtonGroup>
        </ButtonToolbar>
      </Col>
    </Form.Group>
  )

  const renderDropdownElement = (step, index) => {
    const stepNumber = index + 1 as string
    return (
      <Dropdown.Item
        href={`#/action ${stepNumber}`}
        id={index}
        value={stepNumber}
        key={index+1}
      >
      <Row>
        <Col xs={3}>
          <Form.Check
            inline
            checked={clearLayers.includes(stepNumber.toString())}
            label={`step ${stepNumber}`}
            onChange={() => onClearLayerChange(stepNumber)}
            />
        </Col>
      </Row>
    </Dropdown.Item>
    )
  }

  const renderAnotherTagsElement = (tag, index) => {
return (
      <Dropdown.Item
        href={`#/action ${tag.tag}`}
        id={index}
        value={tag.tag}
        key={index+1}
      >
      <Row>
        <Col xs={3}>
          <Form.Check
            inline
            checked={anotherTags.includes(tag.tag)}
            label={tag.name}
            onChange={() => onAnotherTagChange(tag.tag)}
            />
        </Col>
      </Row>
    </Dropdown.Item>
    )
  }

  const renderClearLayerDropdown = (
    <Dropdown className={'mb-2'}  autoClose={false}>
      <Dropdown.Toggle id="dropdown-autoclose-false" style={{flex: 1 , width: '100%'}}>
        Clear layer
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href="#/action-0">
          <Row>
            <Col>
              <Form.Check
                inline
                label={'Clear before'}
                checked={clearBefore}
                onChange={onClearBeforeChanged}
              />
            </Col>
          </Row>
        </Dropdown.Item>
        <Dropdown.Divider/>
        {steps.map((step, index) => renderDropdownElement(step, index))}
      </Dropdown.Menu>
    </Dropdown>
  )

  const renderAnotherTagsDropdown = (
    <Dropdown className={'mb-2'}  autoClose={false}>
      <Dropdown.Toggle id="dropdown-autoclose-false" style={{flex: 1 , width: '100%'}}>
        Another tags
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {anotherTagsList.map((step, index) => renderAnotherTagsElement(step, index))}
      </Dropdown.Menu>
    </Dropdown>
  )

  const renderAnimationsButtons = (
    <Col>
    <ButtonToolbar className={'mb-2'}>
      <ButtonGroup size={'sm'} className={'me-2'}>
        <OverlayTrigger
          placement={'bottom'}
          overlay={<Tooltip id="button-tooltip-blink">Blink</Tooltip>}>
          <Button value={'blink'} id={'blink'} onClick={()=> onAnimationTagChange('blink')}>
            <Lightbulb size={'10'}/>
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          placement={'bottom'}
          overlay={<Tooltip id="button-tooltip-appear">Appear</Tooltip>}>
          <Button value={'appear'} id={'appear'} onClick={()=> onAnimationTagChange('appear')}>
            <Magic size={'10'}/>
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          placement={'bottom'}
          overlay={<Tooltip id="button-tooltip-draw-line">Draw line</Tooltip>}>
          <Button value={'draw-line'} id={'draw-line'} onClick={() => onAnimationTagChange('draw-line')}>
            <Pencil size={'10'}/>
          </Button>
        </OverlayTrigger>
      </ButtonGroup>
      <ButtonGroup size={'sm'} className={'me-2'}>
        <OverlayTrigger
          placement={'bottom'}
          overlay={<Tooltip id="button-tooltip-fly-bottom">Fly from bottom</Tooltip>}>
          <Button value={'fly-bottom'} id={'fly-bottom'} onClick={() => onAnimationTagChange('fly-from-bottom')}>
            <ArrowUp size={'10'}/>
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          placement={'bottom'}
          overlay={<Tooltip id="button-tooltip-fly-left">Fly from left</Tooltip>}>
          <Button value={'fly-left'} id={'fly-left'} onClick={() => onAnimationTagChange('fly-from-left')}>
            <ArrowRight size={'10'}/>
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          placement={'bottom'}
          overlay={<Tooltip id="button-tooltip-fly-right">Fly from right</Tooltip>}>
          <Button value={'fly-right' } id={'fly-right'} onClick={() => onAnimationTagChange('fly-from-right')}>
            <ArrowLeft size={'10'}/>
          </Button>
        </OverlayTrigger>
      </ButtonGroup>
      <ButtonGroup size={'sm'}>
        <OverlayTrigger
          placement={'bottom'}
          overlay={<Tooltip id="button-tooltip-wiggle-1">Wiggle-1</Tooltip>}>
          <Button value={'wiggle-1'} id={'wiggle-1'} onClick={() => onAnimationTagChange('wiggle-1')}>
            <ArrowsMove size={'10'}/>
            <Form.Label style={{fontSize: 8, padding: 0, margin: 0}}>
              1
            </Form.Label>
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          placement={'bottom'}
          overlay={<Tooltip id="button-tooltip-wiggle-2">Wiggle-2</Tooltip>}>
          <Button value={'wiggle-2'} id={'wiggle-2'} onClick={() => onAnimationTagChange('wiggle-2')}>
            <ArrowsMove size={'10'}/>
            <Form.Label style={{fontSize: 8, padding: 0, margin: 0}}>
              2
            </Form.Label>
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          placement={'bottom'}
          overlay={<Tooltip id="button-tooltip-wiggle-3">Wiggle-3</Tooltip>}>
          <Button value={'wiggle-3'} id={'wiggle-3'} onClick={() => onAnimationTagChange('wiggle-3')}>
            <ArrowsMove size={'10'}/>
            <Form.Label style={{fontSize: 8, padding: 0, margin: 0}}>
              3
            </Form.Label>
          </Button>
        </OverlayTrigger>
        <OverlayTrigger
          placement={'bottom'}
          overlay={<Tooltip id="button-tooltip-wiggle-4">Wiggle-4</Tooltip>}>
          <Button value={'wiggle-4'} id={'wiggle-4'} onClick={() => onAnimationTagChange('wiggle-4')}>
            <ArrowsMove size={'10'}/>
            <Form.Label style={{fontSize: 8, padding: 0, margin: 0}}>
              4
            </Form.Label>
          </Button>
        </OverlayTrigger>
      </ButtonGroup>
    </ButtonToolbar>
      <Row>
        <Col>
          <Form.Group as={Row} className={'mb-1'}>
            <Form.Label column xs={5}>
              Delay
            </Form.Label>
            <Col>
              <Form.Control
                disabled={animationTag === ''}
                type='number'
                min={0}
                max={1000}
                value={delay}
                onChange={(e) => setDelay(parseInt(e.target.value))}
                step={1}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className={'mb-3'}>
            <Form.Label column xs={5}>
              Repeat
            </Form.Label>
            <Col>
              <Form.Control
                disabled={animationTag === ''}
                type='number'
                min={0}
                max={1000}
                value={repeat}
                onChange={(e) => setRepeat(parseInt(e.target.value))}
                step={1}
              />
            </Col>
          </Form.Group>
        </Col>
      </Row>
      </Col>
  )

  return (
    <>
      <Row>
        <Col>
          <Form.Group as={Row} className='mb-2'>
            <Col>
            {renderStepOptions}
            </Col>
          </Form.Group>
          <Form.Group as={Row} className='mb-2'>
            <Col>
              {renderClearLayerDropdown}
            </Col>
            <Col>
              {renderAnotherTagsDropdown}
            </Col>
          </Form.Group>
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
                Brush type
              </Form.Label>
              <Col>
                <Form.Select value={brushType} onChange={onBrushTypeChange}>
                  <option value=''></option>
                  <option value='pen'>pen</option>
                  <option value='pencil'>pencil</option>
                  <option value='marker'>marker</option>
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
      {renderAnimationsButtons}
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
