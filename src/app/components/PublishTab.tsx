import React from 'react'
import { Button } from 'react-bootstrap'
import { pluginApi } from '../../rpc-api'
import LoginForm from './LoginForm'
import Parse from 'parse'
import { userStore } from '../models/user'
import { useSnapshot } from 'valtio'

const ParseLesson = Parse.Object.extend('Lesson')
const ParseCourse = Parse.Object.extend('Course')

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export function PublishTab() {
  const userSnapshot = useSnapshot(userStore)
  const [isDisabled, setIsDisabled] = React.useState(false)
  const [isPublished, setIsPublished] = React.useState(false)
  const [link, setLink] = React.useState('')
  const [isCopiedLink, setIsCopiedLink] = React.useState(false)

  async function copyLinkToClipboard(link: string) {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(link)
      setIsCopiedLink(true)
    }
    return false
  }

  async function makeLesson(lesson, course, serverLesson, free, debug) {
    const cp = debug ? `${lesson.coursePath}-debug` : lesson.coursePath
    const [lessonFile, thumbnailFile] = await Promise.all([
      new Parse.File(
        `${cp}.${lesson.path}.svg`,
        Array.from(lesson.file),
        'image/svg+xml'
      ).save(),
      new Parse.File(
        `${cp}.${lesson.path}.thumbnail.png`,
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
    return serverLesson
  }

  async function publishCourse(
    { debug }: { debug: boolean } = { debug: false }
  ) {
    setIsDisabled(true)
    const course = await pluginApi.exportCourse()
    const cp = debug ? `${course.path}-debug` : course.path
    let [courseObject, thumbnailFile, serverLessons] = await Promise.all([
      new Parse.Query(ParseCourse).equalTo('path', cp).first(),
      new Parse.File(
        `${cp}.INDEX.thumbnail.png`,
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
    if (courseObject.isNew()) {
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

    setLink(`https://artworkout.app.link/courses/${courseObject._getId()}`)
    setIsPublished(true)
    setIsDisabled(false)
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
          <Button
            disabled={isDisabled}
            onClick={() => publishCourse({ debug: true })}
          >
            Publish debug
          </Button>{' '}
          {userSnapshot.user.get('email') === 'ulitiy@gmail.com' && (
            <Button
              disabled={isDisabled}
              variant='danger'
              onClick={() => publishCourse({ debug: false })}
            >
              Publish production
            </Button>
          )}
          {isPublished && (
            <>
              <a
                href='#'
                className='pt-3'
                onClick={async () => copyLinkToClipboard(link)}
              >
                {link}
              </a>
              {isCopiedLink && <p>Copied to clipboard</p>}
              <img
                className='pt-3'
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://artworkout.app.link/figma_user/${userSnapshot.user._getId()}`}
              />
            </>
          )}
        </div>
      )}
    </>
  )
}
