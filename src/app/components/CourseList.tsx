import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { pluginApi } from '../../rpc-api'
import { Step } from '../../plugin/tune-rpc'
import './StepList.css'
import { getTags } from '../../plugin/util'

export function CourseList({
  courses,
  selectedStep,
  onUpdate,
}: {
  courses: any[]
  onUpdate?: (selected: any) => void
}) {
  /*  async function onDragEnd(result) {
    if (!result.destination) {
      return
    }
    const newStepsOrder = Array.from(courses)
    const [removed] = newStepsOrder.splice(result.source.index, 1)
    newStepsOrder.splice(result.destination.index, 0, removed)
    //await pluginApi.setStepsOrder(newStepsOrder)
    onUpdate(removed)
  }*/

  async function onDragEnd(result) {
    if (!result.destination) {
      return
    }

    const newStepsOrder = Array.from(courses)
    const [removed] = newStepsOrder.splice(result.source.index, 1)
    newStepsOrder.splice(result.destination.index, 0, removed)

    // Determine the range of indices where the order needs to be updated
    const startIndex = Math.min(result.source.index, result.destination.index)
    const endIndex = Math.max(result.source.index, result.destination.index)

    // Update the order property of the elements in the range
    newStepsOrder.slice(startIndex, endIndex + 1).forEach((item, index) => {
      item.order = startIndex + index + 1 // Set the order of each element to its index + startIndex + 1
    })
    console.log('newStepsOrder', newStepsOrder)
    //await pluginApi.setStepsOrder(newStepsOrder)
    onUpdate(newStepsOrder)
  }

  function generateUniqueKey(id) {
    return id.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0)
    }, '')
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='step-list'>
        {(provided) => (
          <ListGroup {...provided.droppableProps} ref={provided.innerRef}>
            {courses?.map((Course, index) => {
              return Course ? (
                <Draggable
                  key={generateUniqueKey(Course.id)}
                  draggableId={Course.id}
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
                      onClick={() => null}
                    >
                      {Course.name.en}
                      <div className='round-icon-container'>
                        <div className='layer-number'>{Course.order}</div>
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
