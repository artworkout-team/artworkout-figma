import { findChildrenByTag, getCurrentLesson, getTags } from './util'
import { MetaStoreProps } from '../app/models/MetaStore'
import { uiApi } from '../rpc-api'

export const availableTypes = [
  'tracing',
  'challenge',
  'handwriting',
  'educational',
  'painting',
  'oneLine',
]

export const getSettingsNode = (lesson?: FrameNode) => {
  let objectToSearch = lesson
  if (!objectToSearch) {
    objectToSearch = getCurrentLesson()
  }
  return findChildrenByTag(objectToSearch, 'settings')[0]
}

export const setMetaTags = (metaProps: MetaStoreProps) => {
  console.log('metaProps', metaProps)
  const settings = getSettingsNode()
  let tags = getTags(settings).filter(tag => !tag.startsWith('meta-'))
  if (availableTypes.find(el => el === metaProps.type))
    tags.push(`meta-type-${metaProps.type}`)
  if (metaProps.duration && metaProps.duration !== '0')
    tags.push(`meta-duration-${metaProps.duration}`)
  settings.name = tags.join(' ')
}

interface PropsFromTags {
  type: string,
  duration: number
}

export const getMetaTags = (lesson?: FrameNode): Partial<PropsFromTags> => {
  const settings = getSettingsNode(lesson)
  let metaTags = getTags(settings).filter(tag => tag.startsWith('meta-'))
  let metaObject = {}
  metaTags.forEach(el => {
    if (el.startsWith('meta-duration-')) {
      const duration = el.replace('meta-duration-', '')
      metaObject = {...metaObject, duration: parseInt(duration)}
    }
    if (el.startsWith('meta-type-')) {
      metaObject = {...metaObject, type: el.replace('meta-type-', '')}
    }
  })

  return metaObject
}

export const setMetaTagsFromNodesToStore = () => {
  const lesson = getCurrentLesson()
  const metaTags = getMetaTags(lesson)
  const props = {
    type:  metaTags.type || '',
    duration: metaTags.duration?.toString() || '',
  }
  uiApi.setMetaProps(props)
}
