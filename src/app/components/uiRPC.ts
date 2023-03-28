import { TuneFormStore } from '../models/TuneFormStore'
import { formProps } from '../../plugin/tune'

export async function setAnimationTags(animationTag: string, delay: number, repeat: number) {
  await TuneFormStore.setAnimationTags(animationTag, delay, repeat)
}

export async function updateUiProps(settings: formProps) {
  await TuneFormStore.updateProps(settings)
}
