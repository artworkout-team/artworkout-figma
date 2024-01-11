import { Col, Form, Row } from "react-bootstrap"
import React, { FC } from "react"
import { MetaFormStore } from "../../models/MetaStore"
import { useSnapshot } from "valtio"

interface ILessonMetaProps {
  onFormSubmit?: (type: string, duration: number) => void;
  onClose?: () => void;
}

export const availableTypes = [
  "meta-type-tracing",
  "meta-type-challenge",
  "meta-type-handwriting",
  "meta-type-educational",
  "meta-type-painting",
  "meta-type-oneline"
]

export const LessonMetaForm: FC<ILessonMetaProps> = () => {
  const state = useSnapshot(MetaFormStore);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    MetaFormStore.metaProps.type = e.target.value;
  }

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    MetaFormStore.metaProps.duration = e.target.value;
  }

  return (
    <div className='mt-2' style={{ borderRadius: "8px", padding: "4px" }}>
      <Form>
        <fieldset>
          <Form.Group as={Row} className='mb-2'>
            <Form.Label column xs={3}>
              Type
            </Form.Label>
            <Col>
              <Form.Select
                aria-label="Select type"
                placeholder={"Choose type..."}
                value={state.metaProps.type}
                onChange={handleTypeChange}
              >
                <option>Choose type...</option>
                {availableTypes.map(type => (
                  <option key={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className='mb-2'>
            <Form.Label column xs={3}>
              Duration
            </Form.Label>
            <Col>
              <Form.Control
                type="number"
                value={state.metaProps.duration}
                onChange={handleDurationChange}
              />
            </Col>
          </Form.Group>
          {/*<Form.Group as={Row} className='mb-2'>*/}
          {/*  <Button className='plugin-btn' style={{ width: "130px" }} onClick={handleClear}>*/}
          {/*    Clear*/}
          {/*  </Button>*/}
          {/*</Form.Group>*/}
        </fieldset>
      </Form>
    </div>
  );
}
