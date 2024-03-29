import React, { useEffect, useState } from 'react'
import { Button, Row } from 'react-bootstrap'
import { pluginApi } from '../../rpc-api'
import LoginForm from './LoginForm'
import Parse from 'parse'
import { userStore } from '../models/user'
import { useSnapshot } from 'valtio'
import { CourseList } from './CourseList'
import { gzipSync } from 'fflate'

const ParseLesson = Parse.Object.extend('Lesson')
const ParseCourse = Parse.Object.extend('Course')

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const allowedEmails = ['ulitiy@gmail.com', 'indie.djan@gmail.com', 'artem@artworkout.app']
export const adminEmails = ['ulitiy@gmail.com']

export function PublishTab() {
  const userSnapshot = useSnapshot(userStore)
  const [isDisabled, setIsDisabled] = React.useState(false)
  const [courseLink, setCourseLink] = React.useState('')
  const [linkCopied, setLinkCopied] = React.useState(false)
  const [outlineText, setOutlineText] = React.useState(false)

  const [courses, setCourses] = useState([])
  const [parseCourseList, setParseCourseList] = useState([])

  const onCourseOrderUpdate = async (selected) => {
    setCourses(selected)
  }

  async function getAllCoursesFromParse() {
    try {
      const courseQuery = new Parse.Query(ParseCourse)
      const courseList = await courseQuery.find()
      setParseCourseList(courseList)
      const courses = courseList.map((courseObject) => {
        return {
          id: courseObject.id,
          path: courseObject.get('path'),
          order: courseObject.get('order'),
          name: courseObject.get('name'),
        }
      })
      courses.sort((a, b) => a.order - b.order)
      return courses
    } catch (error) {
      console.error('Error fetching courses:', error)
      return []
    }
  }

  useEffect(() => {
    const fetchCourses = async () => {
      const fetchedCourses = await getAllCoursesFromParse()
      setCourses(fetchedCourses)
    }
    setTimeout(() => {
      fetchCourses()
    }, 500)
  }, [])

  function copyToClipboard(value: string) {
    try {
      // @ts-ignore
      if (window.copy) {
        // @ts-ignore
        window.copy(value)
      } else {
        const area = document.createElement('textarea')
        document.body.appendChild(area)
        area.value = value
        area.focus()
        area.select()
        const result = document.execCommand('copy')
        document.body.removeChild(area)
        if (!result) {
          throw new Error()
        }
      }
    } catch (e) {
      console.error(`Unable to copy the value: ${value}`)
      return false
    }
    return true
  }

  async function makeLesson(lesson, course, serverLesson, free, debug) {
    const cp = debug ? `${lesson.coursePath}-debug` : lesson.coursePath

    const svg = new Parse.File(
      `${cp}.${lesson.path}.svg`,
      Array.from(gzipSync(lesson.file, { level: 9 })),
      'image/svg+xml'
    )

    svg.addMetadata('contentEncoding', 'gzip')

    const [lessonFile, thumbnailFile] = await Promise.all([
      svg.save(),
      new Parse.File(
        `${cp}.${lesson.path}.thumbnail.ch.png`,
        Array.from(lesson.thumbnail),
        'image/png'
      ).save(),
    ])
    if (serverLesson.isNew()) {
      serverLesson.set('coursePath', cp)
      serverLesson.set('path', lesson.path)
      serverLesson.set('free', free)
      serverLesson.set('name', {
        en: capitalize(lesson.path.split('-').join(' ')),
      })
    }
    serverLesson.set('course', course)
    serverLesson.set('file', lessonFile)
    serverLesson.set('thumbnail', thumbnailFile)
    serverLesson.set('order', lesson.index)

    if (lesson.duration) {
      serverLesson.set('duration', lesson.duration)
    }
    if (lesson.type) {
      serverLesson.set('type', lesson.type)
    }
    return serverLesson
  }

  async function publishCourse(
    { debug }: { debug: boolean } = { debug: false }
  ) {
    if (!debug && !confirm('Publish to production?')) {
      return
    }
    setIsDisabled(true)
    const course = await pluginApi.exportCourse(outlineText)
    const cp = debug ? `${course.path}-debug` : course.path
    let [courseObject, thumbnailFile, serverLessons] = await Promise.all([
      new Parse.Query(ParseCourse).equalTo('path', cp).first(),
      new Parse.File(
        `${cp}.INDEX.thumbnail.ch.png`,
        Array.from(course.thumbnail),
        'image/png'
      ).save(),
      new Parse.Query(ParseLesson).equalTo('coursePath', cp).find(),
    ])
    // delete lessons that are not in the course anymore
    const lessonPaths = course.lessons.map((l) => l.path)
    const deletedLessons = serverLessons.filter(
      (l) => !lessonPaths.includes(l.get('path'))
    )
    Parse.Object.destroyAll(deletedLessons) // no need to await
    courseObject = courseObject || new ParseCourse()
    courseObject.set('path', cp)
    courseObject.set('thumbnail', thumbnailFile)
    courseObject.set('author', userSnapshot.user)
    if (courseObject.isNew()) {
      if (!debug) {
        courseObject.set('approved', true)
      }
      courseObject.set('order', debug ? -1 : 10)
      courseObject.set('name', {
        en: capitalize(cp.split('-').join(' ')),
      }) // make all languages the same for now, just copy EN
      courseObject.set('description', { en: '' })
      await courseObject.save()
    }
    const lessons = await Promise.all(
      course.lessons.map((lesson, index) =>
        makeLesson(
          lesson,
          courseObject,
          serverLessons.find((l) => l.get('path') === lesson.path) ||
            new ParseLesson(),
          index == 0,
          debug
        )
      )
    )
    await Parse.Object.saveAll(lessons.concat([courseObject]))
    setCourseLink(`https://artworkout.app.link/courses/${courseObject.id}`)
    const fetchedCourses = await getAllCoursesFromParse()
    setCourses(fetchedCourses)
    setIsDisabled(false)
  }

  async function deleteCourse(courseId: string) {
    if (confirm('Delete course?')) {
      setIsDisabled(true)
      const deletedCourse = parseCourseList.find(el => el.id === courseId)
      console.log('deletedCourse', deletedCourse)
      await Parse.Object.destroyAll(deletedCourse)
      const fetchedCourses = await getAllCoursesFromParse()
      setCourses(fetchedCourses)
      setIsDisabled(false)
    }
  }
  const publishNewCourseOrder = async () => {
    const updatedCourses = parseCourseList.map((parseCourse) => {
      const course = courses.find(
        (course) => course.path === parseCourse.get('path')
      )
      if (course) {
        parseCourse.set('order', course.order)
      }
      return parseCourse
    })

    await Parse.Object.saveAll(updatedCourses)
  }

  return (
    <>
      <LoginForm />
      {userSnapshot.user && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type='checkbox'
              checked={outlineText}
              onChange={(e) => setOutlineText(e.target.checked)}
            />
            <label style={{ marginLeft: '0.5em' }}>Outline text</label>
          </div>
          <Button
            disabled={isDisabled}
            onClick={() => publishCourse({ debug: true })}
            style={{ minWidth: '165px' }}
          >
            Publish debug
          </Button>{' '}
          {allowedEmails.includes(userSnapshot.user.get('email')) && (
            <Button
              disabled={isDisabled}
              variant='danger'
              onClick={() => publishCourse({ debug: false })}
              style={{ marginTop: '0.5em', minWidth: '165px' }}
            >
              Publish production
            </Button>
          )}
          <p className='mt-3'>
            {courseLink && (
              <a
                href='#'
                id='courseLink'
                onClick={async () => {
                  copyToClipboard(courseLink)
                  setLinkCopied(true)
                  setTimeout(() => setLinkCopied(false), 2000)
                }}
              >
                {linkCopied ? 'Link copied ✓' : 'Share course'}
              </a>
            )}
            &nbsp;
          </p>
          <p>Scan with iPad to sync your courses:</p>
          <img
            id='qr'
            src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=https://artworkout.app.link/figma_user/${userSnapshot.user.id}`}
            onClick={() =>
              copyToClipboard(
                `https://artworkout.app.link/figma_user/${userSnapshot.user.id}`
              )
            }
          />
          <Row className={'mt-3'}>
            <CourseList courses={courses} onUpdate={onCourseOrderUpdate} onCourseDelete={deleteCourse} />
          </Row>
          <Button
            className={'mt-3'}
            disabled={isDisabled}
            onClick={() => publishNewCourseOrder()}
            style={{ minWidth: '165px' }}
          >
            Publish course order
          </Button>{' '}
        </div>
      )}
    </>
  )
}
