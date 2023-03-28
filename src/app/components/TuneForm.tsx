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
  OverlayTrigger,
  Tooltip,
  ButtonToolbar,
  Dropdown,
  Accordion, 
  ToggleButton,
} from 'react-bootstrap'
import { useHotkeys } from 'react-hotkeys-hook'
import { pluginApi } from '../../rpc-api'
import { StepList } from './StepList'
import {
  Pencil,
  Lightbulb,
  MagicWand,
  FlipIcon,
} from './assets/bootstrapIcons'
import { TuneFormStore } from '../models/TuneFormStore'
import { subscribe, useSnapshot } from 'valtio'


export function TuneForm() {
  const [template, setTemplate] = useState('')
  const [stepNumber, setStepNumber] = useState(1)
  const [stepCount, setStepCount] = useState(1)
  const [brushSize, setBrushSize] = useState(0)
  const [steps, setSteps] = useState([])
  const [suggestedBrushSize, setSuggestedBrushSize] = useState(0)
  const [brushType, setBrushType] = useState('')

  const [clearLayers, setClearLayers] = useState<string[]>([])
  const [clearBefore, setClearBefore] = useState(false)

  const [animationTag, setAnimationTag] = useState<string>('')
  const [delay, setDelay] = useState<number>(0)
  const [repeat, setRepeat] = useState<number>(0)

  const [otherTags, setOtherTags] = useState<string[]>([])

  const [mutex, setMutex] = useState(true)

  const state = useSnapshot(TuneFormStore)

  function onStepNumberChange(event: ChangeEvent) {
    setStepNumber(parseInt((event.target as HTMLInputElement).value))
  }

  function onDisplayModeChange(event: FormEvent) {
    TuneFormStore.formProps.displayMode = (event.target as HTMLInputElement).value

  }

  function onTemplateChange(event: FormEvent) {
    const targetSelect = event.target as HTMLSelectElement
    if (targetSelect.value === 'multistep-bg') {
      TuneFormStore.formProps.shadowSize = 0
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

  function onOtherTagsChange(tag: string) {
    if(otherTags.includes(tag)) {
      setOtherTags(otherTags.filter(item => item !== tag))
    } else {
      setOtherTags([...otherTags, tag])
    }
  }

  function onAnimationTagChange(tag: string) {
    if(tag === animationTag)  {
      setAnimationTag('')
    } else {
      setAnimationTag(tag)
    }
  }

  async function getSteps() {
    const steps = await pluginApi.getSteps()
    setSteps(steps)
  }

  useEffect(() => {
    if (!mutex) {
      pluginApi.updateDisplay({displayMode: state.formProps.displayMode, stepNumber})
    }
  }, [stepNumber, state.formProps.displayMode])

  useEffect(() => {
    if (!mutex) {
    pluginApi.updateProps({
      shadowSize: TuneFormStore.formProps.shadowSize,
      brushSize,
      stepNumber,
      template,
      clearLayers: JSON.parse(JSON.stringify(clearLayers)),
      clearBefore,
      otherTags: JSON.parse(JSON.stringify(otherTags)),
      brushType,
      animationTag,
      delay,
      repeat})
    }
  }, [animationTag, delay, repeat])

  useEffect(() => {
    if (!mutex) {
      setAnimationTag(undefined)
      setDelay(0)
      setRepeat(0)
    }
  }, [stepNumber])

  useEffect(() => {
    if (!mutex) {
      console.log('update props via tune')
      pluginApi.updateProps({
        shadowSize: state.formProps.shadowSize,
        brushSize,
        stepNumber,
        template,
        clearLayers: JSON.parse(JSON.stringify(clearLayers)),
        clearBefore,
        otherTags: JSON.parse(JSON.stringify(otherTags)), brushType})
      pluginApi.updateDisplay({displayMode: state.formProps.displayMode, stepNumber})
    }
  }, [state.formProps.shadowSize, brushSize, template, clearLayers, otherTags, brushType])


  useEffect(() => {
    const unsubscribe = subscribe(TuneFormStore, () => {
      if(!mutex) {
        setMutex(true)
        getSteps()
        setAnimationTag(TuneFormStore.formProps.animationTag)
        setDelay(TuneFormStore.formProps.delay)
        setRepeat(TuneFormStore.formProps.repeat)
        setBrushSize(TuneFormStore.formProps.brushSize)
        setSuggestedBrushSize(TuneFormStore.formProps.suggestedBrushSize)
        setStepCount(TuneFormStore.formProps.stepCount)
        setStepNumber(TuneFormStore.formProps.stepNumber)
        setTemplate(TuneFormStore.formProps.template)
        setClearBefore(TuneFormStore.formProps.clearBefore)
        setClearLayers(TuneFormStore.formProps.clearLayers)
        setOtherTags(TuneFormStore.formProps.otherTags)
        setBrushType(TuneFormStore.formProps.brushType)
        setMutex(false)
      }
      }
    )
    return () => {
      unsubscribe()
    }
  }, []) // once

  const enableOnTags: any = ['INPUT', 'TEXTAREA', 'SELECT']
  const otherTagsList: any = [
    {tag: 'share-button', name: 'Share button'},
    {tag:'allow-undo', name: 'Allow undo'},
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
  useHotkeys('q', () => { TuneFormStore.formProps.displayMode = 'all' }, { enableOnTags })
  useHotkeys('c', () =>  { TuneFormStore.formProps.displayMode = 'current' }, { enableOnTags })
  useHotkeys('p', () =>  { TuneFormStore.formProps.displayMode = 'previous' },{ enableOnTags })
  useHotkeys('t', () => { TuneFormStore.formProps.displayMode = 'template' }, { enableOnTags })
  useHotkeys('d', () => setBrushSize((prev) => (prev += 5)), { enableOnTags })
  useHotkeys('a', () => setBrushSize((prev) => (prev - 5 > 0 ? prev - 5 : 0)), {
    enableOnTags,
  })
  useHotkeys('w', () => {TuneFormStore.formProps.shadowSize += 5}, { enableOnTags })
  useHotkeys(
    's',
    () => {TuneFormStore.formProps.shadowSize =TuneFormStore.formProps.shadowSize - 5 > 0 ? TuneFormStore.formProps.shadowSize - 5 : 0 },
    { enableOnTags }
  )

  const renderStepOptions = (
    <Form.Group as={Row}>
      <Col>
        <Form.Group as={Row} className={'justify-content-center'}>
          <OverlayTrigger
            placement={'bottom'}
            overlay={<Tooltip id="button-tooltip-current">JK</Tooltip>}>
            <Form.Label column xs={5}>
              Step
            </Form.Label>
          </OverlayTrigger>
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
          <ButtonGroup>
            <OverlayTrigger
              placement={'bottom'}
              overlay={<Tooltip className={'tooltip'} style={{position: 'fixed'}} id="button-tooltip-all">(Q) All</Tooltip>}>
              <ToggleButton  variant="outline-primary"  type='radio' checked={ state.formProps.displayMode ==='all'} id={'displayModeAll'} value={'all'} onChange={onDisplayModeChange}>Q</ToggleButton>
            </OverlayTrigger>
            <OverlayTrigger
              placement={'bottom'}
              overlay={<Tooltip id="button-tooltip-current">(C)urrent</Tooltip>}>
              <ToggleButton variant="outline-primary" type='radio' checked={state.formProps.displayMode ==='current'} id={'displayModeCurrent'} value={'current'} onChange={onDisplayModeChange}>C</ToggleButton>
            </OverlayTrigger>
            <OverlayTrigger
              placement={'bottom'}
              overlay={<Tooltip id="button-tooltip-previous">(P)revious</Tooltip>}>
              <ToggleButton variant="outline-primary" type='radio' checked={state.formProps.displayMode ==='previous'} id={'displayModePrevious'} value={'previous'} onChange={onDisplayModeChange}>P</ToggleButton>
            </OverlayTrigger>
            <OverlayTrigger
              placement={'bottom'}
              overlay={<Tooltip id="button-tooltip-template">(T)emplate</Tooltip>}>
              <ToggleButton variant="outline-primary" type='radio' checked={state.formProps.displayMode ==='template'} id={'displayModeTemplate'} value={'template'} onChange={onDisplayModeChange}>T</ToggleButton>
            </OverlayTrigger>
          </ButtonGroup>
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

  const renderOtherTagsElement = (tag, index) => {
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
              checked={otherTags.includes(tag.tag)}
              label={tag.name}
              onChange={() => onOtherTagsChange(tag.tag)}
              />
          </Col>
        </Row>
      </Dropdown.Item>
    )
  }

  const renderClearLayerDropdown = (
    <Dropdown className={'mb-2'} autoClose={'outside'}>
      <Dropdown.Toggle id="dropdown-autoclose-outside">
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

  const renderOtherTagsDropdown = (
    <Dropdown className={'mb-2'}  autoClose={'outside'}>
      <Dropdown.Toggle id="dropdown-autoclose-outside">
        Other tags
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {otherTagsList.map((step, index) => renderOtherTagsElement(step, index))}
      </Dropdown.Menu>
    </Dropdown>
  )

  const renderAnimationsButtons = (
    <Col style={{width: '100%'}}>
    <ButtonToolbar className={'mb-2'}>
      <ButtonGroup size={'sm'} >
        <OverlayTrigger
          placement={'bottom'}
          overlay={<Tooltip id="button-tooltip-blink">Blink</Tooltip>}>
          <ToggleButton variant="outline-primary" type='radio' checked={animationTag ==='blink'} value={'blink'} id={'blink'} onChange={()=> onAnimationTagChange('blink')}>
            <Lightbulb/>
          </ToggleButton>
        </OverlayTrigger>
        <OverlayTrigger
          placement={'bottom'}
          overlay={<Tooltip id="button-tooltip-appear">Appear</Tooltip>}>
          <ToggleButton variant="outline-primary" type='radio' checked={animationTag ==='appear'}  value={'appear'} id={'appear'} onChange={()=> onAnimationTagChange('appear')}>
            <MagicWand/>
          </ToggleButton>
        </OverlayTrigger>
        <OverlayTrigger
          placement={'bottom'}
          overlay={<Tooltip id="button-tooltip-draw-line">Draw line</Tooltip>}>
          <ToggleButton variant="outline-primary" type='radio' checked={animationTag ==='draw-line'} value={'draw-line'} id={'draw-line'} onChange={() => onAnimationTagChange('draw-line')}>
            <Pencil/>
          </ToggleButton>
        </OverlayTrigger>
        <OverlayTrigger
          placement={'bottom'}
          overlay={<Tooltip id="button-tooltip-draw-line">Draw line flip</Tooltip>}>
          <ToggleButton variant="outline-primary" type='radio' checked={animationTag ==='draw-line-flip'} value={'draw-line-flip'} id={'draw-line-flip'} onChange={() => onAnimationTagChange('draw-line-flip')}>
            <FlipIcon/>
          </ToggleButton>
        </OverlayTrigger>
      </ButtonGroup>
    </ButtonToolbar>
      <Row>
        <Col>
          <Form.Group as={Row} className={'mb-2'}>
            <OverlayTrigger
              placement={'bottom'}
              overlay={<Tooltip id="button-tooltip-wiggle-4">Delay</Tooltip>}>
              <Form.Label column className={'col-2'}>
                D
              </Form.Label>
            </OverlayTrigger>
            <Col className={'col-4'}>
              <Form.Control
                disabled={animationTag === undefined}
                type='number'
                min={0}
                max={10}
                value={delay}
                onChange={(e) => setDelay(parseInt(e.target.value))}
                step={1}
              />
            </Col>
            <OverlayTrigger
              placement={'bottom'}
              overlay={<Tooltip id="button-tooltip-wiggle-4">Repeat</Tooltip>}>
              <Form.Label column className={'col-2'}>
                R
              </Form.Label>
            </OverlayTrigger>
            <Col className={'col-4'}>
              <Form.Control
                disabled={animationTag === undefined}
                type='number'
                min={0}
                max={10}
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
                value={state.formProps.shadowSize}
                onChange={(e) => TuneFormStore.formProps.shadowSize = parseInt(e.target.value)}
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
      <Accordion flush className='mb-2'>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <Form.Label className={'m-0 p-0'}>
              Advanced
            </Form.Label>
          </Accordion.Header>
          <Accordion.Body>
          <Form.Group as={Row} className='mb-2'>
            <Col style={{width: '45%'}}>
              {renderClearLayerDropdown}
            </Col>
            <Col style={{width: '45%'}}>
              {renderOtherTagsDropdown}
            </Col>
          </Form.Group>
          <Row>
          {renderAnimationsButtons}
          </Row>
         </Accordion.Body>
        </Accordion.Item>
      </Accordion>
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

export default TuneForm
