import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import './StepList.css'

export function CourseList({
  courses,
  onUpdate,
}: {
  courses: any[]
  onUpdate?: (selected: any) => void
}) {
  async function onDragEnd(result) {
    if (!result.destination) {
      return
    }

    const newCourseOrder = Array.from(courses)
    const [removed] = newCourseOrder.splice(result.source.index, 1)
    newCourseOrder.splice(result.destination.index, 0, removed)
    const startIndex = Math.min(result.source.index, result.destination.index)
    const endIndex = Math.max(result.source.index, result.destination.index)

    newCourseOrder.slice(startIndex, endIndex + 1).forEach((item, index) => {
      item.order = startIndex + index + 1
    })
    onUpdate(newCourseOrder)
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
            {courses?.map((course, index) => {
              return course ? (
                <Draggable
                  key={generateUniqueKey(course.id)}
                  draggableId={course.id}
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
                    >
                      {course?.name?.en}
                      <div className='round-icon-container'>
                        <div className='layer-number'>{course.order}</div>
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
