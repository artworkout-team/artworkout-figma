import { on } from '../events'
import { capitalize, findAll, print } from './util'

function generateTranslationsCode() {
  const courseName = figma.root.name.replace(/COURSE-/, '')

  let tasks = ''
  for (let page of figma.root.children) {
    if (page.name.toUpperCase() == 'INDEX') {
      continue
    }
    tasks += `"task-name ${courseName}/${page.name}" = "${capitalize(
      page.name.split('-').join(' ')
    )}";\n`
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

interface ILesson {
  path: string
  coursePath: string
  file: Uint8Array
  thumbnail: Uint8Array
  index: number
}

function prepareCourseForPublishing() {
  findAll(figma.root, (node) => node.name.startsWith('tmp-')).forEach(
    (node) => {
      node.remove()
    }
  )
  findAll(figma.root, (node) => !!node).forEach((node) => {
    if ('visible' in node) {
      node.visible = true
    }
  })
}

export async function exportLesson(
  page?: PageNode,
  outlineText?: boolean
): Promise<ILesson> {
  if (!page) {
    page = figma.currentPage
  }
  const index = figma.root.children.indexOf(page)
  const lessonNode = page.children.find((f) => f.name == 'lesson')
  const thumbnailNode = page.children.find((f) => f.name == 'thumbnail')
  if (!lessonNode) {
    return
  }
  const file = await lessonNode.exportAsync({
    format: 'SVG',
    svgOutlineText: outlineText,
    svgIdAttribute: true,
  })
  const thumbnail = await thumbnailNode.exportAsync({
    format: 'PNG',
    constraint: {
      type: 'WIDTH',
      value: 600,
    },
  })
  return {
    coursePath: figma.root.name.replace('COURSE-', ''),
    path: page.name,
    file,
    thumbnail,
    index,
  }
}

export async function exportCourse(outlineText: boolean) {
  prepareCourseForPublishing()
  const [lessons, thumbnail] = await Promise.all([
    Promise.all(
      figma.root.children
        .filter((page) => page.name != 'INDEX')
        .map((page) => exportLesson(page, outlineText))
    ),
    figma.root.children
      .find((page) => page.name == 'INDEX')
      .exportAsync({
        format: 'PNG',
        constraint: {
          type: 'WIDTH',
          value: 600,
        },
      }),
  ])
  return {
    path: figma.root.name.replace('COURSE-', ''),
    lessons,
    thumbnail,
  }
}

function generateSwiftCode() {
  const courseName = figma.root.name.replace(/COURSE-/, '')
  let swiftCourseName = courseName
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
  swiftCourseName =
    swiftCourseName.charAt(0).toLowerCase() + swiftCourseName.slice(1)
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

on('generateCode', generateCode)
