import { proxy } from 'valtio'

export const rpcStore = proxy({
  animationTag: undefined,
  delay: 0,
  repeat: 0,
  shadowSize: 0,
  brushSize: 0,
  suggestedBrushSize: 0,
  stepCount: 1,
  stepNumber: 1,
  displayMode: 'all',
  template: '',
  clearBefore: false,
  clearLayers: [],
  otherTags: [],
  brushType: '',
  async setAnimationTags(animationTag: string, delay: number, repeat: number) {
    rpcStore.animationTag = animationTag
    rpcStore.delay = delay
    rpcStore.repeat = repeat
  },
  async updateProps(settings: {
    shadowSize: number
    brushSize: number
    suggestedBrushSize: number
    stepCount: number
    stepNumber: number
    displayMode: string
    template: string
    clearBefore: boolean
    clearLayers: string[]
    otherTags: string[]
    brushType: string
  }) {
    rpcStore.shadowSize = settings.shadowSize
    rpcStore.brushSize = settings.brushSize
    rpcStore.suggestedBrushSize = settings.suggestedBrushSize
    rpcStore.stepCount = settings.stepCount
    rpcStore.stepNumber = settings.stepNumber
    rpcStore.displayMode = settings.displayMode
    rpcStore.template = settings.template
    rpcStore.clearBefore = settings.clearBefore
    rpcStore.clearLayers = settings.clearLayers
    rpcStore.otherTags = settings.otherTags
    rpcStore.brushType = settings.brushType
  },
})
