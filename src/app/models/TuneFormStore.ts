import { proxy, subscribe } from 'valtio'
import { formProps, updateProps } from '../../plugin/tune'
import { pluginApi } from "../../rpc-api"

export const TuneFormStore = proxy({
  stepProps :{
    animationTag: undefined,
    delay: 0,
    repeat: 0,
    shadowSize: 0,
    brushSize: 0,
    suggestedBrushSize: 0,
    stepCount: 1,
    template: '',
    clearBefore: false,
    clearLayers: [],
    otherTags: [],
    brushType: '',
  },
  stepNumber: 1,
  displayMode: 'all',
  mutex: false,

  async setAnimationTags(animationTag: string, delay: number, repeat: number) {
    TuneFormStore.mutex = true
    TuneFormStore.stepProps = {
      ...TuneFormStore.stepProps,
      animationTag,
      delay,
      repeat }
    TuneFormStore.mutex = false
  },
  async updateProps(settings: formProps) {
    TuneFormStore.mutex = true
    TuneFormStore.stepProps = {
      ...TuneFormStore.stepProps,
      ...settings,
    }
    TuneFormStore.mutex = false
  },
})


subscribe(TuneFormStore.stepProps, () => {
  console.log('stepProps changed', TuneFormStore.stepProps)
  if (!TuneFormStore.mutex) {
    pluginApi.updateProps(JSON.parse(JSON.stringify(TuneFormStore.stepProps)))
    pluginApi.updateDisplay({ stepNumber: TuneFormStore.stepNumber, displayMode: TuneFormStore.displayMode })
  }
})


