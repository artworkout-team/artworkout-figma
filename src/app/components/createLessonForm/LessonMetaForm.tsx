import { Col, Form, Row } from 'react-bootstrap'
import React, { FC } from 'react'
import { MetaFormStore } from '../../models/MetaStore'
import { useSnapshot } from 'valtio'
import { availableTypes } from '../../../plugin/meta'

interface ILessonMetaProps {
  onFormSubmit?: (type: string, duration: number) => void;
  onClose?: () => void;
}

export const LessonMetaForm: FC<ILessonMetaProps> = () => {
  const state = useSnapshot(MetaFormStore)

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    MetaFormStore.metaProps.type = e.target.value
  }

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    MetaFormStore.metaProps.duration = e.target.value
  }

  return (
    <div className='mt-2' style={{ borderRadius: '8px', padding: '4px' }}>
      <Form>
        <fieldset>
          <Form.Group as={Row} className='mb-2'>
            <Form.Label column xs={3}>
              Type
            </Form.Label>
            <Col>
              <Form.Select
                aria-label="Select type"
                placeholder={'Choose type...'}
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
        </fieldset>
      </Form>
    </div>
  )
}
