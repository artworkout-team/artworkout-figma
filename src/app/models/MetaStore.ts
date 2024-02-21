import { proxy, subscribe } from 'valtio';
import { availableTypes } from "../components/createLessonForm/LessonMetaForm"
import { pluginApi } from "../../rpc-api"

let mutex = false

type ArrayElement<T> = T extends ReadonlyArray<infer U> ? U : never;
export type AvailableMetaTypes = ArrayElement<typeof availableTypes>;

export interface MetaStoreProps {
  duration: string,
  type: AvailableMetaTypes
}

const defaultMetaProps = {
  duration: "0",
  type: "",
};

export const MetaFormStore = proxy({
  metaProps: defaultMetaProps,

  async setMetaProps(props: MetaStoreProps) {
    mutex = true
    for (const key in props) {
      MetaFormStore.metaProps[key] = props[key]
    }
    setTimeout(() => {
      mutex = false
    }, 10)
  },

  async setDefaultProps() {
    MetaFormStore.setMetaProps(defaultMetaProps);
  }
});

subscribe(MetaFormStore.metaProps, async () => {
  if (!mutex) {
    await pluginApi.setMetaTags(
      JSON.parse(JSON.stringify(MetaFormStore.metaProps))
    );
  }
})
