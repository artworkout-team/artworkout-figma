import React from 'react'
import {Button} from 'react-bootstrap'
import {emit} from '../../events'
import {pluginApi} from '../../rpc-api'
import CourseExporter from './CourseExporter'
import LoginForm from './LoginForm'
import Parse from 'parse'

const ParseLesson = Parse.Object.extend('Lesson')
const ParseCourse = Parse.Object.extend('Course')

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function PublishTab() {

  async function makeLesson(lesson, course, serverLesson) {
    const [lessonFile, thumbnailFile] = await Promise.all([
      new Parse.File(`${lesson.coursePath}.${lesson.path}.svg`, Array.from(lesson.file), 'image/svg+xml').save(),
      new Parse.File(`${lesson.coursePath}.${lesson.path}.thumbnail.png`, Array.from(lesson.thumbnail), 'image/png').save(),
    ])
    if (serverLesson.isNew()) {
      serverLesson.set('coursePath', lesson.coursePath)
      serverLesson.set('path', lesson.path)
      serverLesson.set('name', {en: capitalize(lesson.path.split('-').join(' '))})
    }
    serverLesson.set('course', course)
    serverLesson.set('file', lessonFile)
    serverLesson.set('thumbnail', thumbnailFile)
    serverLesson.set('order', lesson.index)
    return serverLesson
  }

  async function publishCourse() {
    const course = await pluginApi.exportCourse()    
    let [courseObject, thumbnailFile, serverLessons] = await Promise.all([
      new Parse.Query(ParseCourse).equalTo('path', course.path).first(),
      new Parse.File(`${course.path}.INDEX.thumbnail.png`, Array.from(course.thumbnail), 'image/png').save(),
      new Parse.Query(ParseLesson).equalTo('coursePath', course.path).find(),
    ])
    // delete lessons that are not in the course anymore
    const lessonPaths = course.lessons.map(l => l.path)
    const deletedLessons = serverLessons.filter(l => !lessonPaths.includes(l.get('path')))
    Parse.Object.destroyAll(deletedLessons) // no need to await
    courseObject = courseObject || new ParseCourse()
    courseObject.set('path', course.path)
    courseObject.set('thumbnail', thumbnailFile)
    if (courseObject.isNew()) {
      courseObject.set('name', {en: capitalize(course.path.split('-').join(' '))}) // make all languages the same for now, just copy EN
      courseObject.set('description', {en: ''})
      await courseObject.save()
    }
    const lessons = await Promise.all(course.lessons.map(lesson => makeLesson(lesson, courseObject,
      serverLessons.find(l => l.get('path') === lesson.path) || new ParseLesson())))
    await Parse.Object.saveAll(lessons.concat([courseObject]))
  }

  return (
    <>
      <LoginForm/>
      <Button onClick={publishCourse}>Publish course</Button>
      <Button className='m-1' onClick={() => emit('exportCourse')}>Export course</Button>
      <CourseExporter/>
      <Button onClick={() => emit('generateCode')} className='m-1'>Generate code</Button>
    </>
  )
}
