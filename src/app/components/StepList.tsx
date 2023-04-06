import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { pluginApi } from '../../rpc-api'
import { Step } from '../../plugin/tune-rpc'
import './StepList.css'
import { getTags } from '../../plugin/util'

export function StepList({
  steps,
  selectedStep,
  onUpdate,
}: {
  steps: Step[]
  selectedStep: Step
  onUpdate: (selected: Step) => void
}) {
  async function onDragEnd(result) {
    if (!result.destination) {
      return
    }
    const newStepsOrder = Array.from(steps)
    const [removed] = newStepsOrder.splice(result.source.index, 1)
    newStepsOrder.splice(result.destination.index, 0, removed)
    await pluginApi.setStepsOrder(newStepsOrder)
    onUpdate(removed)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='step-list'>
        {(provided) => (
          <ListGroup {...provided.droppableProps} ref={provided.innerRef}>
            {steps.map((stepNode, index) => {
              return stepNode && selectedStep ? (
                <Draggable
                  key={stepNode.id}
                  draggableId={stepNode.id}
                  index={index}
                >
                  {(provided) => (
                    <ListGroup.Item
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className='list-group-icon'
                      style={{
                        ...provided.draggableProps.style,
                      }}
                      active={stepNode.id === selectedStep.id}
                      onClick={() => onUpdate(stepNode)}
                    >
                      {stepNode.name.substring(5).replace(/s-multistep-/, '')}
                      <div className='round-icon-container'>
                        {!getTags(stepNode).includes('s-multistep-result') ? (
                          <div
                            className='round-icon'
                            style={{
                              background: stepNode.colors.fillsColor,
                              border: `3px solid ${stepNode.colors.strokesColor}`,
                            }}
                          ></div>
                        ) : (
                          <div
                            className='result-icon'
                            style={{
                              color:
                                stepNode.colors.fillsColor ||
                                stepNode.colors.strokesColor,
                            }}
                          >
                            R
                          </div>
                        )}
                      </div>
                    </ListGroup.Item>
                  )}
                </Draggable>
              ) : null
            })}
            {provided.placeholder}
          </ListGroup>
        )}
      </Droppable>
    </DragDropContext>
  )
}
