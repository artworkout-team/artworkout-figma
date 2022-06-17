import React, { ChangeEvent, ChangeEventHandler, FormEvent, Fragment, useEffect, useState } from 'react'
import {Form, Row, Col} from "react-bootstrap";
import {emit, on} from '../../events';

function DisplayForm() {
  const [displayMode, setDisplayMode] = useState("all")
  const [stepNumber, setStepNumber] = useState(1)
  const [shadowSize, setShadowSize] = useState(0)
  const [brushSize, setBrushSize] = useState(0)

  function onStepNumberChange(event: ChangeEvent) {
    setStepNumber(parseInt((event.target as HTMLInputElement).value))
  }

  function onDisplayModeChange(event: FormEvent) {
    setDisplayMode((event.target as HTMLInputElement).value)
  }

  useEffect(() => {
    console.log("ui->controller updateDisplay")
    emit("updateDisplay", {displayMode, stepNumber})
  }, [stepNumber, displayMode]);

  const [mutex, setMutex] = useState(true)

  useEffect(() => {
    if (!mutex) {
      console.log("ui->controller updateTags")
      emit("updateTags", {ss: shadowSize, bs: brushSize, stepNumber})
      emit("updateDisplay", {displayMode, stepNumber})
    }
  }, [shadowSize, brushSize])

  useEffect(() => {
    on("updateTags", (settings: {ss: number, bs: number}) => {
      console.log("controller->ui updateTags")
      setMutex(true)
      setShadowSize(settings.ss)
      setBrushSize(settings.bs)
      setMutex(false)
    })
  }, []) // once

  return (
    <Fragment>
      <Row className="mb-2">
        <Col xs={5}>
          <Form.Group as={Row}>
            <Form.Label column xs={4}>Step</Form.Label>
            <Col>
              <Form.Control type="number" value={stepNumber} min={1} onChange={onStepNumberChange}/>
            </Col>
          </Form.Group>
        </Col>
        <Col onChange={onDisplayModeChange}>
          <Form.Check type="radio" name="displayMode" value="all" label="All" defaultChecked/>
          <Form.Check type="radio" name="displayMode" value="current" label="Current"/>
          <Form.Check type="radio" name="displayMode" value="previous" label="Previous"/>
          <Form.Check type="radio" name="displayMode" value="template" label="Template"/>
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
