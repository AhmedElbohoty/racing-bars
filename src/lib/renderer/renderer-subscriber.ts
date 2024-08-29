import { selectTriggerRender, type Store } from '../store';
import type { Renderer } from './renderer.models';

export function rendererSubscriber(store: Store, renderer: Renderer) {
  return function () {
    if (selectTriggerRender(store.getState())) {
      renderer.renderFrame();
    }
  };
}
