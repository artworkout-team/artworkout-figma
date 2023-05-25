import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
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
  Button,
} from 'react-bootstrap'
import { useHotkeys } from 'react-hotkeys-hook'
import { pluginApi } from '../../rpc-api'
import { StepList } from './StepList'
import { Pencil, Lightbulb, MagicWand, FlipIcon } from './assets/bootstrapIcons'
import { TuneFormStore } from '../models/TuneFormStore'
import { useSnapshot } from 'valtio'

export function TuneForm() {
  const [steps, setSteps] = useState([])
  const [freeLesson, setFreeLesson] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)

  const state = useSnapshot(TuneFormStore)

  function onStepNumberChange(event: ChangeEvent) {
    TuneFormStore.stepNavigationProps.stepNumber = parseInt(
      (event.target as HTMLInputElement).value
    )
  }

  function onDisplayModeChange(event: FormEvent) {
    TuneFormStore.stepNavigationProps.displayMode = (
      event.target as HTMLInputElement
    ).value
  }

  function onTemplateChange(event: FormEvent) {
    const targetSelect = event.target as HTMLSelectElement
    if (targetSelect.value === 'multistep-bg') {
      TuneFormStore.stepProps.shadowSize = 0
    }
    TuneFormStore.stepProps.template = targetSelect.value
  }

  function onBrushTypeChange(event: FormEvent) {
    TuneFormStore.stepProps.brushType = (event.target as HTMLInputElement).value
  }

  async function onListUpdate(selectedNode) {
    let sns = await pluginApi.getSteps()
    setSteps(sns)
    let index = sns.findIndex((node) => node.id === selectedNode.id)
    TuneFormStore.stepNavigationProps.stepNumber = index + 1
  }

  function onClearLayerChange(stepNumber: string) {
    let newClearLayer = TuneFormStore.stepProps.clearLayers
    if (newClearLayer.includes(stepNumber.toString())) {
      newClearLayer = newClearLayer.filter(
        (item) => item !== stepNumber.toString()
      )
    } else {
      newClearLayer.push(stepNumber.toString())
    }
    TuneFormStore.stepProps.clearLayers = [...newClearLayer]
    TuneFormStore.stepProps.clearBefore = false
  }

  function onClearBeforeChanged() {
    let newClearLayer = []
    if (state.stepProps.clearBefore) {
      TuneFormStore.stepProps.clearLayers = [...newClearLayer]
      TuneFormStore.stepProps.clearBefore = false
    } else {
      if (state.stepProps.clearLayers.length > 0) {
        newClearLayer = steps.reduce((acc, cur, index) => {
          if (
            index + 1 < state.stepNavigationProps.stepNumber &&
            !acc.includes((index + 1).toString())
          ) {
            acc.push((index + 1).toString())
          }
          return acc
        }, [])
        TuneFormStore.stepProps.clearLayers = [...newClearLayer]
        TuneFormStore.stepProps.clearBefore = true
      } else {
        newClearLayer = steps.reduce((acc, cur, index) => {
          if (index + 1 < state.stepNavigationProps.stepNumber) {
            acc.push((index + 1).toString())
          }
          return acc
        }, [])
      }
      TuneFormStore.stepProps.clearLayers = [...newClearLayer]
      TuneFormStore.stepProps.clearBefore = true
    }
  }

  function onOtherTagsChange(tag: string) {
    if (state.stepProps.otherTags.includes(tag)) {
      TuneFormStore.stepProps.otherTags = state.stepProps.otherTags.filter(
        (item) => item !== tag
      )
    } else {
      TuneFormStore.stepProps.otherTags = [...state.stepProps.otherTags, tag]
    }
  }

  function onAnimationTagChange(tag: string) {
    if (tag === state.animationProps.animationTag) {
      TuneFormStore.animationProps.animationTag = undefined
    } else {
      TuneFormStore.animationProps.animationTag = tag
    }
  }

  function onFreeLessonChange(value: boolean) {
    setFreeLesson(value)
    pluginApi.setCurrentLessonAsyncStorage('free', value.toString())
  }

  function onAnalyticsEnabledChange(value: boolean) {
    setAnalyticsEnabled(value)
    pluginApi.setCurrentLessonAsyncStorage('analyticsEnabled', value.toString())
  }

  async function onNextBrushStep() {
    await pluginApi.selectNextBrushStep(state.stepNavigationProps.stepNumber)
  }

  async function getSteps() {
    const steps = await pluginApi.getSteps()
    setSteps(steps)
  }

  async function getLessonAsyncStorage() {
    const storage = await pluginApi.getLessonAsyncStorage()
    setFreeLesson(storage.free === 'true')
    setAnalyticsEnabled(storage.analyticsEnabled === 'true')
  }

  useEffect(() => {
    getSteps()
    getLessonAsyncStorage()
  }, [state])

  const enableOnTags: any = ['INPUT', 'TEXTAREA', 'SELECT']
  const otherTagsList: any = [
    { tag: 'share-button', name: 'Share button' },
    { tag: 'allow-undo', name: 'Allow undo' },
  ]

  useHotkeys(
    'j',
    () => {
      TuneFormStore.stepNavigationProps.stepNumber =
        TuneFormStore.stepNavigationProps.stepNumber + 1 <
        state.stepProps.stepCount
          ? TuneFormStore.stepNavigationProps.stepNumber + 1
          : state.stepProps.stepCount
    },
    { enableOnTags }
  )
  useHotkeys(
    'k',
    () => {
      TuneFormStore.stepNavigationProps.stepNumber =
        state.stepNavigationProps.stepNumber - 1 > 0
          ? state.stepNavigationProps.stepNumber - 1
          : 1
    },
    { enableOnTags }
  )
  useHotkeys(
    'g',
    () => {
      TuneFormStore.stepNavigationProps.stepNumber = 1
    },
    { enableOnTags }
  )
  useHotkeys(
    'n',
    () => {
      onNextBrushStep()
    },
    { enableOnTags }
  )
  useHotkeys(
    'q',
    () => {
      TuneFormStore.stepNavigationProps.displayMode = 'all'
    },
    { enableOnTags }
  )
  useHotkeys(
    'c',
    () => {
      TuneFormStore.stepNavigationProps.displayMode = 'current'
    },
    { enableOnTags }
  )
  useHotkeys(
    'p',
    () => {
      TuneFormStore.stepNavigationProps.displayMode = 'previous'
    },
    { enableOnTags }
  )
  useHotkeys(
    't',
    () => {
      TuneFormStore.stepNavigationProps.displayMode = 'template'
    },
    { enableOnTags }
  )
  useHotkeys(
    'd',
    () => {
      TuneFormStore.stepProps.brushSize = state.stepProps.brushSize + 5
    },
    { enableOnTags }
  )
  useHotkeys(
    'a',
    () => {
      TuneFormStore.stepProps.brushSize =
        state.stepProps.brushSize - 5 > 0 ? state.stepProps.brushSize - 5 : 0
    },
    { enableOnTags }
  )
  useHotkeys(
    'w',
    () => {
      TuneFormStore.stepProps.shadowSize += 5
    },
    { enableOnTags }
  )
  useHotkeys(
    's',
    () => {
      TuneFormStore.stepProps.shadowSize =
        TuneFormStore.stepProps.shadowSize - 5 > 0
          ? TuneFormStore.stepProps.shadowSize - 5
          : 0
    },
    { enableOnTags }
  )

  const renderStepOptions = (
    <Form.Group as={Row}>
      <Col style={{ maxWidth: '40%' }}>
        <Form.Group as={Row} className={'justify-content-center'}>
          <OverlayTrigger
            placement={'bottom'}
            overlay={<Tooltip id='button-tooltip-current'>JK</Tooltip>}
          >
            <Form.Label column xs={5}>
              Step
            </Form.Label>
          </OverlayTrigger>
          <Col>
            <Form.Control
              type='number'
              value={state.stepNavigationProps.stepNumber}
              min={1}
              max={state.stepProps.stepCount}
              onChange={onStepNumberChange}
            />
          </Col>
        </Form.Group>
      </Col>
      <Col>
        <Form.Group as={Row}>
          <Col>
            <ButtonGroup className={'mr-2'} size={'sm'}>
              <OverlayTrigger
                placement={'bottom'}
                overlay={
                  <Tooltip id='button-tooltip-template'>
                    (N)ext brush step
                  </Tooltip>
                }
              >
                <Button
                  variant='outline-primary'
                  id={'displayModeNextBrushStep'}
                  value={'next'}
                  onClick={() => onNextBrushStep()}
                >
                  N
                </Button>
              </OverlayTrigger>
            </ButtonGroup>
            <ButtonGroup>
              <OverlayTrigger
                placement={'bottom'}
                overlay={
                  <Tooltip
                    className={'tooltip'}
                    style={{ position: 'fixed' }}
                    id='button-tooltip-all'
                  >
                    (Q) All
                  </Tooltip>
                }
              >
                <ToggleButton
                  key={1}
                  variant='outline-primary'
                  type='radio'
                  checked={state.stepNavigationProps.displayMode === 'all'}
                  id={'displayModeAll'}
                  value={'all'}
                  onChange={onDisplayModeChange}
                >
                  Q
                </ToggleButton>
              </OverlayTrigger>
              <OverlayTrigger
                placement={'bottom'}
                overlay={
                  <Tooltip id='button-tooltip-current'>(C)urrent</Tooltip>
                }
              >
                <ToggleButton
                  key={2}
                  variant='outline-primary'
                  type='radio'
                  checked={state.stepNavigationProps.displayMode === 'current'}
                  id={'displayModeCurrent'}
                  value={'current'}
                  onChange={onDisplayModeChange}
                >
                  C
                </ToggleButton>
              </OverlayTrigger>
              <OverlayTrigger
                placement={'bottom'}
                overlay={
                  <Tooltip id='button-tooltip-previous'>(P)revious</Tooltip>
                }
              >
                <ToggleButton
                  variant='outline-primary'
                  type='radio'
                  checked={state.stepNavigationProps.displayMode === 'previous'}
                  id={'displayModePrevious'}
                  value={'previous'}
                  onChange={onDisplayModeChange}
                >
                  P
                </ToggleButton>
              </OverlayTrigger>
              <OverlayTrigger
                placement={'bottom'}
                overlay={
                  <Tooltip id='button-tooltip-template'>(T)emplate</Tooltip>
                }
              >
                <ToggleButton
                  variant='outline-primary'
                  type='radio'
                  checked={state.stepNavigationProps.displayMode === 'template'}
                  id={'displayModeTemplate'}
                  value={'template'}
                  onChange={onDisplayModeChange}
                >
                  T
                </ToggleButton>
              </OverlayTrigger>
            </ButtonGroup>
          </Col>
        </Form.Group>
      </Col>
    </Form.Group>
  )

  const renderDropdownElement = (step, index) => {
    const stepNumber = (index + 1) as string
    return (
      <Dropdown.Item
        href={`#/action ${stepNumber}`}
        id={index}
        value={stepNumber}
        key={index + 1}
      >
        <Row>
          <Col xs={3}>
            <Form.Check
              inline
              checked={state.stepProps.clearLayers.includes(
                stepNumber.toString()
              )}
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
        key={index + 1}
      >
        <Row>
          <Col xs={3}>
            <Form.Check
              inline
              checked={state.stepProps.otherTags.includes(tag.tag)}
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
      <Dropdown.Toggle id='dropdown-autoclose-outside'>
        Clear layer
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href='#/action-0'>
          <Row>
            <Col>
              <Form.Check
                inline
                label={'Clear before'}
                checked={state.stepProps.clearBefore}
                onChange={onClearBeforeChanged}
              />
            </Col>
          </Row>
        </Dropdown.Item>
        <Dropdown.Divider />
        {steps.map((step, index) => renderDropdownElement(step, index))}
      </Dropdown.Menu>
    </Dropdown>
  )

  const renderOtherTagsDropdown = (
    <Dropdown className={'mb-2'} autoClose={'outside'}>
      <Dropdown.Toggle id='dropdown-autoclose-outside'>
        Other tags
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {otherTagsList.map((step, index) =>
          renderOtherTagsElement(step, index)
        )}
      </Dropdown.Menu>
    </Dropdown>
  )

  const renderAnimationsButtons = (
    <Col style={{ width: '100%' }}>
      <ButtonToolbar className={'mb-2'}>
        <ButtonGroup size={'sm'}>
          <OverlayTrigger
            placement={'bottom'}
            overlay={<Tooltip id='button-tooltip-blink'>Blink</Tooltip>}
          >
            <ToggleButton
              variant='outline-primary'
              type='radio'
              checked={state.animationProps.animationTag === 'blink'}
              value={'blink'}
              id={'blink'}
              onChange={() => onAnimationTagChange('blink')}
            >
              <Lightbulb />
            </ToggleButton>
          </OverlayTrigger>
          <OverlayTrigger
            placement={'bottom'}
            overlay={<Tooltip id='button-tooltip-appear'>Appear</Tooltip>}
          >
            <ToggleButton
              variant='outline-primary'
              type='radio'
              checked={state.animationProps.animationTag === 'appear'}
              value={'appear'}
              id={'appear'}
              onChange={() => onAnimationTagChange('appear')}
            >
              <MagicWand />
            </ToggleButton>
          </OverlayTrigger>
          <OverlayTrigger
            placement={'bottom'}
            overlay={<Tooltip id='button-tooltip-draw-line'>Draw line</Tooltip>}
          >
            <ToggleButton
              variant='outline-primary'
              type='radio'
              checked={state.animationProps.animationTag === 'draw-line'}
              value={'draw-line'}
              id={'draw-line'}
              onChange={() => onAnimationTagChange('draw-line')}
            >
              <Pencil />
            </ToggleButton>
          </OverlayTrigger>
          <OverlayTrigger
            placement={'bottom'}
            overlay={
              <Tooltip id='button-tooltip-draw-line'>Draw line flip</Tooltip>
            }
          >
            <ToggleButton
              variant='outline-primary'
              type='radio'
              checked={state.animationProps.animationTag === 'draw-line-flip'}
              value={'draw-line-flip'}
              id={'draw-line-flip'}
              onChange={() => onAnimationTagChange('draw-line-flip')}
            >
              <FlipIcon />
            </ToggleButton>
          </OverlayTrigger>
        </ButtonGroup>
      </ButtonToolbar>
    </Col>
  )

  const renderLessonSettings = (
    <Form.Group as={Row} className='mb-2 justify-content-between'>
      <Col className='col-4 d-flex align-items-center justify-content-end'>
        <Form.Label column>Free</Form.Label>
      </Col>
      <Col className='col-1 d-flex align-items-center mr-3'>
        <Form.Check
          checked={freeLesson}
          onChange={(e) => onFreeLessonChange(e.target.checked)}
        />
      </Col>
      <Col className='col-4 '>
        <Form.Label column>Analytics</Form.Label>
      </Col>
      <Col className='col-1 d-flex align-items-center'>
        <Form.Check
          checked={analyticsEnabled}
          onChange={(e) => onAnalyticsEnabledChange(e.target.checked)}
        />
      </Col>
    </Form.Group>
  )

  return (
    <>
      <Row>
        <Col>
          <Form.Group as={Row} className='mb-2'>
            <Col>{renderStepOptions}</Col>
          </Form.Group>
          <Form.Group as={Row} className='mb-2'>
            <Form.Label column xs={5}>
              Template
            </Form.Label>
            <Col>
              <Form.Select
                value={state.stepProps.template}
                onChange={onTemplateChange}
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
              Brush type
            </Form.Label>
            <Col>
              <Form.Select
                value={state.stepProps.brushType}
                onChange={onBrushTypeChange}
              >
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
                value={state.stepProps.shadowSize}
                onChange={(e) =>
                  (TuneFormStore.stepProps.shadowSize = parseInt(
                    e.target.value
                  ))
                }
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
                value={state.stepProps.brushSize}
                onChange={(e) =>
                  (TuneFormStore.stepProps.brushSize = parseInt(e.target.value))
                }
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
                onClick={() =>
                  (TuneFormStore.stepProps.brushSize =
                    state.stepProps.suggestedBrushSize)
                }
              >
                {state.stepProps.suggestedBrushSize}
              </button>
            </Col>
          </Form.Group>
        </Col>
      </Row>
      <Accordion flush className='mb-2'>
        <Accordion.Item eventKey='0'>
          <Accordion.Header>
            <Form.Label className={'m-0 p-0'}>Advanced</Form.Label>
          </Accordion.Header>
          <Accordion.Body>
            <Form.Group as={Row} className='mb-2'>
              <Col style={{ width: '45%' }}>{renderClearLayerDropdown}</Col>
              <Col style={{ width: '45%' }}>{renderOtherTagsDropdown}</Col>
            </Form.Group>
            <Row>{renderAnimationsButtons}</Row>
            <Row>{renderLessonSettings}</Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <Row>
        <StepList
          steps={steps}
          selectedStep={steps[state.stepNavigationProps.stepNumber - 1]}
          onUpdate={onListUpdate}
        />
      </Row>
    </>
  )
}

export default TuneForm
