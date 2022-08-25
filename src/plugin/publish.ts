import {emit, on} from '../events'
import {capitalize, print} from './util'

function generateTranslationsCode() {
  const courseName = figma.root.name.replace(/COURSE-/, '')

  let tasks = ''
  for (let page of figma.root.children) {
    if (page.name.toUpperCase() == 'INDEX') {
      continue
    }
    tasks += `"task-name ${courseName}/${page.name}" = "${capitalize(page.name.split('-').join(' '))}";\n`
  }
  return `
"course-name ${courseName}" = "${capitalize(courseName.split('-').join(' '))}";
"course-description ${courseName}" = "In this course:
    • 
    • 
    • ";
${tasks}
`
}

async function exportCourse() {
  let lessons = []
  let thumbnails = []
  for (let page of figma.root.children) {
    if (page.name.toUpperCase() == 'THUMBNAILS') {
      continue
    }
    const lesson = page.children.find((f) => f.name == 'lesson')
    const thumbnail = page.children.find((f) => f.name == 'thumbnail')
    if (lesson) {
      const bytes = await lesson.exportAsync({
        format: 'SVG',
        // svgOutlineText: false,
        svgIdAttribute: true,
      })
      const path = `${page.name}.svg`
      lessons.push({path, bytes})
    }
    if (thumbnail) {
      const bytes = await thumbnail.exportAsync({
        format: 'PNG',
        constraint: {
          type: 'WIDTH',
          value: 600,
        },
      })
      const path = `thumbnails/${page.name.toLowerCase()}.png`
      thumbnails.push({path, bytes})
    }
  }
  emit('exportZip', {rootName: figma.root.name, lessons, thumbnails})
}

export async function exportLesson() {
  const page = figma.currentPage
  const lesson = page.children.find((f) => f.name == 'lesson')
  const thumbnail = page.children.find((f) => f.name == 'thumbnail')
  if (!lesson) {
    return
  }
  const lessonFile = await lesson.exportAsync({
    format: 'SVG',
    // svgOutlineText: false,
    svgIdAttribute: true,
  })
  const thumbnailFile = await thumbnail.exportAsync({
    format: 'PNG',
    constraint: {
      type: 'WIDTH',
      value: 600,
    },
  })
  return {
    coursePath: figma.root.name.replace('COURSE-', ''),
    lessonPath: page.name,
    lessonFile,
    thumbnailFile,
  }
}

function generateSwiftCode() {
  const courseName = figma.root.name.replace(/COURSE-/, '')
  let swiftCourseName = courseName.split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('')
  swiftCourseName = swiftCourseName.charAt(0).toLowerCase() + swiftCourseName.slice(1)
  let tasks = ''
  for (let page of figma.root.children) {
    if (page.name.toUpperCase() == 'INDEX') {
      continue
    }
    tasks += `Task(path: "${courseName}/${page.name}", pro: true),\n`
  }
  return `
    let ${swiftCourseName} = Course(
    path: "${courseName}",
    author: REPLACE,
    tasks: [
${tasks}    ])
`
}

function generateCode() {
  const code = generateSwiftCode() + generateTranslationsCode()
  print(code)
}

on('exportCourse', exportCourse)
on('generateCode', generateCode)
