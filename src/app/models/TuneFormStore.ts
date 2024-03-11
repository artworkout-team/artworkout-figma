import { proxy, subscribe } from 'valtio'
import { formProps } from '../../plugin/tune'
import { pluginApi } from '../../rpc-api'

let mutex = false

export const TuneFormStore = proxy({
  stepProps: {
    shadowSize: 0,
    brushSize: 0,
    suggestedBrushSize: 0,
    stepCount: 1,
    template: '',
    isFade: false,
    clearBefore: false,
    clearLayers: [],
    otherTags: [],
    brushType: '',
    stencilColor: '6685d4ff',
  },
  animationProps: {
    animationTag: undefined,
    delay: 0,
    repeat: 0,
  },
  stepNavigationProps: {
    stepNumber: 1,
    displayMode: 'all',
  },

  async setAnimationTags(animationTag: string, delay: number, repeat: number) {
    mutex = true
    TuneFormStore.animationProps.animationTag = animationTag
    TuneFormStore.animationProps.delay = delay
    TuneFormStore.animationProps.repeat = repeat
    setTimeout(() => {
      mutex = false
    }, 10)
  },

  async updateProps(settings: formProps) {
    mutex = true
    for (const key in settings) {
      TuneFormStore.stepProps[key] = settings[key]
    }
    setTimeout(() => {
      mutex = false
    }, 10)
  },

  async setStepNavigationProps(stepNumber: number, displayMode: string) {
    mutex = true
    TuneFormStore.stepNavigationProps.stepNumber = stepNumber
    TuneFormStore.stepNavigationProps.displayMode = displayMode
    setTimeout(() => {
      mutex = false
    }, 10)
  },
})

subscribe(TuneFormStore.stepProps, async () => {
  if (!mutex) {
    await pluginApi.updateProps({
      ...JSON.parse(JSON.stringify(TuneFormStore.stepProps)),
      ...JSON.parse(JSON.stringify(TuneFormStore.animationProps)),
    })
    await pluginApi.updateDisplay(
      JSON.parse(JSON.stringify(TuneFormStore.stepNavigationProps))
    )
  }
})

subscribe(TuneFormStore.stepNavigationProps, () => {
  if (!mutex) {
    pluginApi.updateDisplay(
      JSON.parse(JSON.stringify(TuneFormStore.stepNavigationProps))
    )
  }
})

subscribe(TuneFormStore.animationProps, () => {
  if (!mutex) {
    pluginApi.updateProps({
      ...JSON.parse(JSON.stringify(TuneFormStore.stepProps)),
      ...JSON.parse(JSON.stringify(TuneFormStore.animationProps)),
    })
  }
})
