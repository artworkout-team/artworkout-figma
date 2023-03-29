import { proxy } from 'valtio'
import { formProps } from '../../plugin/tune'

export const TuneFormStore = proxy({
  formProps :{
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
  },
  async setAnimationTags(animationTag: string, delay: number, repeat: number) {
    TuneFormStore.formProps = {
      ...TuneFormStore.formProps,
      animationTag,
      delay,
      repeat }
  },
  async updateProps(settings: formProps) {
    TuneFormStore.formProps = {
      ...TuneFormStore.formProps,
      ...settings,
    }
  },
})
