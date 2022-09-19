import React from 'react'
import {Button} from 'react-bootstrap'
import {emit} from '../../events'
import {pluginApi} from '../../rpc-api'
import CourseExporter from './CourseExporter'
import LoginForm from './LoginForm'
import Parse from 'parse'

const ParseLesson = Parse.Object.extend('Lesson')
const ParseCourse = Parse.Object.extend('Course')

export function PublishTab() {

  async function makeLesson(lesson, course) {
    const [lessonFile, thumbnailFile] = await Promise.all([
      new Parse.File(`${lesson.coursePath}.${lesson.path}.svg`, Array.from(lesson.file), 'image/svg+xml').save(),
      new Parse.File(`${lesson.coursePath}.${lesson.path}.thumbnail.png`, Array.from(lesson.thumbnail), 'image/png').save(),
    ])
    const query = new Parse.Query(ParseLesson)
    query.equalTo('coursePath', lesson.coursePath)
    query.equalTo('path', lesson.path)
    let lessonObject: Parse.Object = new ParseLesson() // (await query.first()) || new ParseLesson()
    if (lessonObject.isNew()) {
      lessonObject.set('coursePath', lesson.coursePath)
      lessonObject.set('path', lesson.path)
      lessonObject.set('name', {en: lesson.path+'.name'})
    }
    lessonObject.set('course', course)
    lessonObject.set('file', lessonFile)
    lessonObject.set('thumbnail', thumbnailFile)
    lessonObject.set('order', lesson.index)
    return lessonObject
  }

  async function deleteCourseLessons(coursePath) {
    const query = new Parse.Query(ParseLesson)
    query.equalTo('coursePath', coursePath)
    const lessons = await query.find()
    return Parse.Object.destroyAll(lessons)
  }

  async function publishCourse() {
    const course = await pluginApi.exportCourse()
    let [courseObject, thumbnailFile] = await Promise.all([
      new Parse.Query(ParseCourse).equalTo('path', course.path).first(),
      new Parse.File(`${course.path}.INDEX.thumbnail.png`, Array.from(course.thumbnail), 'image/png').save(),
      await deleteCourseLessons(course.path), // TODO: delete only lessons that are not in the course
    ])
    courseObject = courseObject || new ParseCourse()
    courseObject.set('path', course.path)
    courseObject.set('name', {en: course.path+'.name'})
    courseObject.set('description', {en: course.path+'.description'})
    courseObject.set('thumbnail', thumbnailFile)
    if (courseObject.isNew()) {
      await courseObject.save()
    }
    const lessons = await Promise.all(course.lessons.map(lesson => makeLesson(lesson, courseObject)))
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
