import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { pluginApi } from '../../rpc-api'
import { Step } from '../../plugin/tune-rpc'

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
    const newStepOrder = Array.from(steps)
    const [removed] = newStepOrder.splice(result.source.index, 1)
    newStepOrder.splice(result.destination.index, 0, removed)
    await pluginApi.setStepOrder(newStepOrder as any)
    onUpdate(removed)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='step-list'>
        {(provided) => (
          <ListGroup {...provided.droppableProps} ref={provided.innerRef}>
            {steps.map((stepNode, index) => {
              return (
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
                      style={{
                        padding: '0.2rem 1rem',
                        fontSize: '0.7rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        ...provided.draggableProps.style,
                      }}
                      active={stepNode.id === selectedStep.id}
                      onClick={() => onUpdate(stepNode)}
                    >
                      {stepNode.name.substring(5).replace(/s-multistep-/, '')}
                      <div
                        style={{
                          background: stepNode.colors.fillsColor,
                          border: `3px solid ${stepNode.colors.strokesColor}`,
                          borderRadius: '50%',
                          width: '1.3em',
                          height: '1.3em',
                          textAlign: 'center'
                        }}
                      >
                      </div>
                    </ListGroup.Item>
                  )}
                </Draggable>
              )
            })}
            {provided.placeholder}
          </ListGroup>
        )}
      </Droppable>
    </DragDropContext>
  )
}
