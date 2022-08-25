import React from 'react'
import {Button} from 'react-bootstrap'
import {emit} from '../../events'
import {pluginApi} from '../../rpc-api'
import CourseExporter from './CourseExporter'
import LoginForm from './LoginForm'
import Parse from 'parse'

const ParseLesson = Parse.Object.extend('Lesson')

export function PublishTab() {

  async function publishLesson(path: string) {
    const lesson = await pluginApi.exportLesson()
    const lessonFile = await new Parse.File(`${lesson.coursePath}.${lesson.lessonPath}.svg`, Array.from(lesson.lessonFile), 'image/svg+xml').save()
    const thumbnailFile = await new Parse.File(`${lesson.coursePath}.${lesson.lessonPath}.thumbnail.png`, Array.from(lesson.thumbnailFile), 'image/png').save()
    const query = new Parse.Query(ParseLesson)
    query.equalTo('coursePath', 'DEBUG')
    query.equalTo('path', path)
    const lessonObject = await query.first()
    lessonObject.set('file', lessonFile)
    lessonObject.set('thumbnail', thumbnailFile)
    lessonObject.save()
  }

  return (
    <>
      <LoginForm/>
      <Button className='m-1' onClick={() => publishLesson('ulitiy')}>Publish ulitiy</Button>
      <Button className='m-1' onClick={() => publishLesson('arina')}>Publish arina</Button>
      <Button className='m-1' onClick={() => publishLesson('anna')}>Publish anna</Button>
      {/* <Button onClick={() => emit('publishCourse')}>Publish course</Button> */}
      <Button className='m-1' onClick={() => emit('exportCourse')}>Export course</Button>
      <CourseExporter/>
      <Button onClick={() => emit('generateCode')} className='m-1'>Generate code</Button>
    </>
  )
}
