import React, { ChangeEvent, FormEvent, Fragment, useEffect, useState } from 'react'
import {Form, Row, Col} from "react-bootstrap";
import {emit, on} from '../../events';
import { useHotkeys } from 'react-hotkeys-hook'

function DisplayForm() {
  const [displayMode, setDisplayMode] = useState("all")
  const [template, setTemplate] = useState("")
  const [stepNumber, setStepNumber] = useState(1)
  const [stepCount, setStepCount] = useState(1)
  const [shadowSize, setShadowSize] = useState(0)
  const [brushSize, setBrushSize] = useState(0)

  function onStepNumberChange(event: ChangeEvent) {
    setStepNumber(parseInt((event.target as HTMLInputElement).value))
  }

  function onDisplayModeChange(event: FormEvent) {
    setDisplayMode((event.target as HTMLInputElement).value)
  }

  useEffect(() => {
    if (!mutex) {
      emit("updateDisplay", {displayMode, stepNumber})
    }
  }, [stepNumber, displayMode]);

  const [mutex, setMutex] = useState(true)

  useEffect(() => {
    if (!mutex) {
      emit("updateProps", {ss: shadowSize, bs: brushSize, stepNumber})
      emit("updateDisplay", {displayMode, stepNumber})
    }
  }, [shadowSize, brushSize])

  useEffect(() => {
    on("updateForm", (settings: {ss: number, bs: number, stepCount: number, stepNumber: number, displayMode: string, template: string}) => {
      setMutex(true)
      setShadowSize(settings.ss)
      setBrushSize(settings.bs)
      setStepCount(settings.stepCount)
      setStepNumber(settings.stepNumber)
      setDisplayMode(settings.displayMode)
      setTemplate(settings.template)
      setMutex(false)
    })
  }, []) // once

  const enableOnTags: any = ["INPUT", "TEXTAREA", "SELECT"]

  useHotkeys('j', () => setStepNumber((prev) => prev + 1 < stepCount ? prev + 1 : stepCount), {enableOnTags})
  useHotkeys('k', () => setStepNumber((prev) => prev > 1 ? prev - 1 : 1), {enableOnTags})
  useHotkeys('g', () => setStepNumber(1), {enableOnTags})
  useHotkeys('a', () => setDisplayMode("all"), {enableOnTags})
  useHotkeys('c', () => setDisplayMode("current"), {enableOnTags})
  useHotkeys('p', () => setDisplayMode("previous"), {enableOnTags})
  useHotkeys('t', () => setDisplayMode("template"), {enableOnTags})

  return (
    <Fragment>
      <Row className="mb-2">
        <Col xs={5}>
          <Form.Group as={Row}>
            <Form.Label column xs={4}>Step</Form.Label>
            <Col>
              <Form.Control type="number" value={stepNumber} min={1} max={stepCount} onChange={onStepNumberChange}/>
            </Col>
          </Form.Group>
        </Col>
        <Col onChange={onDisplayModeChange}>
          <Form.Check type="radio" name="displayMode" value="all" label="All" defaultChecked checked={displayMode == "all"} />
          <Form.Check type="radio" name="displayMode" value="current" label="Current" checked={displayMode == "current"} />
          <Form.Check type="radio" name="displayMode" value="previous" label="Previous" checked={displayMode == "previous"} />
          <Form.Check type="radio" name="displayMode" value="template" label="Template" checked={displayMode == "template"} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group as={Row} className="mb-2">
            <Form.Label column xs={5}>Brush size (bs)</Form.Label>
            <Col>
              <Form.Control type="number" min={0} value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} step={5}/>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-2">
            <Form.Label column xs={5}>Tolerance (ss)</Form.Label>
            <Col>
              <Form.Control type="number" min={0} value={shadowSize} onChange={(e) => setShadowSize(parseInt(e.target.value))} step={5}/>
            </Col>
          </Form.Group>
        </Col>
      </Row>
    </Fragment> 
  )
}

export default DisplayForm
