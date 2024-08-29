import * as d3 from '../d3';

import {
  selectOptions,
  selectTickIsFirstDate,
  selectTickIsLastDate,
  selectTickIsRunning,
  type Store,
} from '../store';
import { hideElement, showElement } from '../utils';
import { elements } from './elements';
import { buttons } from './buttons';
import type { RenderOptions } from './render-options';

export function renderControls(store: Store, renderOptions: RenderOptions) {
  const { marginTop, controlButtons } = selectOptions(store.getState());
  const { root, width, margin, barPadding } = renderOptions;

  const elementWidth = root.getBoundingClientRect().width;
  const controlButtonIcons = [
    { skipBack: buttons.skipBack },
    { play: buttons.play },
    { pause: buttons.pause },
    { skipForward: buttons.skipForward },
  ];

  d3.select(root)
    .append('div')
    .classed('controls', true)
    .style('position', 'absolute')
    .style('top', marginTop + 'px')
    .style('right', elementWidth - width + margin.right + barPadding + 'px')
    .selectAll('div')
    .data(controlButtonIcons)
    .enter()
    .append('div')
    .html((d) => Object.values(d)[0] as string)
    .attr('class', (d) => Object.keys(d)[0]);

  if (controlButtons === 'play') {
    hideElement(root, elements.skipBack);
    hideElement(root, elements.skipForward);
  }
  if (controlButtons === 'none') {
    hideElement(root, elements.controls);
  }
}

export function updateControls(store: Store, renderOptions: RenderOptions) {
  const storeState = store.getState();
  const isRunning = selectTickIsRunning(storeState);
  const isFirstDate = selectTickIsFirstDate(storeState);
  const isLastDate = selectTickIsLastDate(storeState);

  const { overlays, loop } = selectOptions(storeState);
  const { root } = renderOptions;

  if (isRunning) {
    showElement(root, elements.pause);
    hideElement(root, elements.play);
  } else {
    showElement(root, elements.play);
    hideElement(root, elements.pause);
  }

  if (isFirstDate && (overlays === 'all' || overlays === 'play') && !isRunning) {
    hideElement(root, elements.controls, true);
    showElement(root, elements.overlay);
    showElement(root, elements.overlayPlay);
    hideElement(root, elements.overlayRepeat);
  } else if (isLastDate && (overlays === 'all' || overlays === 'repeat') && !(loop && isRunning)) {
    hideElement(root, elements.controls, true);
    showElement(root, elements.overlay);
    showElement(root, elements.overlayRepeat);
    hideElement(root, elements.overlayPlay);
  } else {
    showElement(root, elements.controls, true);
    hideElement(root, elements.overlay);
  }
}

export function renderOverlays(store: Store, renderOptions: RenderOptions) {
  const { minHeight, minWidth } = selectOptions(store.getState());
  const { root } = renderOptions;

  const overlayButtonIcons = [
    { overlayPlay: buttons.overlayPlay },
    { overlayRepeat: buttons.overlayRepeat },
  ];

  d3.select(root)
    .append('div')
    .classed('overlay', true)
    .style('minHeight', minHeight + 'px')
    .style('minWidth', minWidth + 'px')
    .selectAll('div')
    .data(overlayButtonIcons)
    .enter()
    .append('div')
    .html((d) => Object.values(d)[0] as string)
    .attr('class', (d) => Object.keys(d)[0]);
}
