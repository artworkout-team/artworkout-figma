import { rpcStore } from '../models/rpc'

export async function setAnimationTags(animationTag: string, delay: number, repeat: number) {
  await rpcStore.setAnimationTags(animationTag, delay, repeat)
}

export async function updateProps(settings: {
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
  await rpcStore.updateProps(settings)
}
