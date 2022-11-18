import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { pluginApi } from '../../rpc-api'

export function StepList({
  stepNodes,
  selectedNode,
  onUpdate,
}: {
  stepNodes: SceneNode[]
  selectedNode: SceneNode
  onUpdate: (selected: SceneNode) => void
}) {
  async function onDragEnd(result) {
    if (!result.destination) {
      return
    }
    const newStepOrder = Array.from(stepNodes)
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
            {stepNodes.map((stepNode, index) => {
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
                        ...provided.draggableProps.style,
                      }}
                      active={stepNode.id === selectedNode.id}
                      onClick={() => onUpdate(stepNode)}
                    >
                      {stepNode.name.substring(5).replace(/s-multistep-/, '')}
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
