import * as d3 from './d3';

import { formatDate } from './dates';
import { icons } from './icons';
import { elements } from './elements';
import { Data, Renderer } from './models';
import { store } from './store';
import { getHeight, getWidth, hideElement, showElement, removeElement } from './utils';
import { getDateSlice } from './data-utils';

export function createRenderer(data: Data[]): Renderer {
  let margin: { top: number; right: number; bottom: number; left: number };
  let svg: any;
  let x: d3.ScaleLinear<number, number>;
  let y: d3.ScaleLinear<number, number>;
  let xAxis: d3.Axis<number | { valueOf(): number }>;
  let barPadding: number;
  let dateCounterText: any;
  let labelX: number | ((d: Data) => number);
  let height: number;
  let width: number;

  function renderInitalView() {
    const {
      selector,
      title,
      subTitle,
      caption,
      dateCounterFormat,
      labelsOnBars,
      labelsWidth,
      inputHeight,
      inputWidth,
      minHeight,
      minWidth,
      topN,
    } = store.getState().options;

    const dateSlice = getDateSlice(data, store.getState().ticker.currentDate);
    const element = document.querySelector(selector) as HTMLElement;
    element.innerHTML = '';

    height = getHeight(element, minHeight, inputHeight);
    width = getWidth(element, minWidth, inputWidth);

    renderInitialFrame();
    renderControls();
    renderOverlays();
    updateControls();

    function renderInitialFrame() {
      const labelsArea = labelsOnBars ? 0 : labelsWidth;

      margin = {
        top: 80,
        right: 0,
        bottom: 5,
        left: 0 + labelsArea,
      };

      barPadding = (height - (margin.bottom + margin.top)) / (topN * 5);

      svg = d3 //
        .select(selector)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      svg //
        .append('text')
        .attr('class', 'title')
        .attr('y', 24)
        .html(title);

      svg //
        .append('text')
        .attr('class', 'subTitle')
        .attr('y', 55)
        .html(subTitle);

      x = d3
        .scaleLinear()
        .domain([0, d3.max(dateSlice, (d: Data) => d.value) as number])
        .range([margin.left, width - margin.right - 65]);

      y = d3
        .scaleLinear()
        .domain([topN, 0])
        .range([height - margin.bottom, margin.top]);

      xAxis = d3
        .axisTop(x)
        .ticks(width > 500 ? 5 : 2)
        .tickSize(-(height - margin.top - margin.bottom))
        .tickFormat((n: number | { valueOf(): number }) => d3.format(',')(n));

      svg
        .append('g')
        .attr('class', 'axis xAxis')
        .attr('transform', `translate(0, ${margin.top})`)
        .call(xAxis)
        .selectAll('.tick line')
        .classed('origin', (d: number) => d === 0);

      svg
        .selectAll('rect.bar')
        .data(dateSlice, (d: Data) => d.name)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', x(0) + 1)
        .attr('width', (d: Data) => Math.abs(x(d.value) - x(0) - 1))
        .attr('y', (d: Data) => y(d.rank as number) + 5)
        .attr('height', y(1) - y(0) - barPadding)
        .style('fill', (d: Data) => d.color);

      labelX = labelsOnBars ? (d: Data) => x(d.value) - 8 : margin.left - 8;

      svg
        .selectAll('text.label')
        .data(dateSlice, (d: Data) => d.name)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', labelX)
        .attr('y', (d: Data) => y(d.rank as number) + 5 + (y(1) - y(0)) / 2 + 1)
        .style('text-anchor', 'end')
        .html((d: Data) => d.name);
      svg
        .selectAll('text.valueLabel')
        .data(dateSlice, (d: Data) => d.name)
        .enter()
        .append('text')
        .attr('class', 'valueLabel')
        .attr('x', (d: Data) => x(d.value) + 5)
        .attr('y', (d: Data) => y(d.rank as number) + 5 + (y(1) - y(0)) / 2 + 1)
        .text((d: Data) => d3.format(',.0f')(d.lastValue as number));

      const strokeWidth = 10;

      dateCounterText = svg
        .append('text')
        .attr('class', 'dateCounterText')
        .attr('x', width - margin.right - barPadding)
        .attr('y', height - 40)
        .style('text-anchor', 'end')
        .html(formatDate(store.getState().ticker.currentDate, dateCounterFormat))
        .call(halo, strokeWidth);

      svg
        .append('text')
        .attr('class', 'caption')
        .attr('x', width - margin.right - barPadding - strokeWidth)
        .attr('y', height - margin.bottom - barPadding)
        .style('text-anchor', 'end')
        .html(caption);

      // TODO: animate halo
      function halo(text: any, strokeWidth: number) {
        text
          .select(function () {
            return this.parentNode.insertBefore(this.cloneNode(true), this);
          })
          .style('fill', '#ffffff')
          .style('stroke', '#ffffff')
          .style('stroke-width', strokeWidth)
          .style('stroke-linejoin', 'round')
          .style('opacity', 1);
      }
    }

    function renderControls() {
      const controlIcons = [
        { skipBack: icons.skipBack },
        { play: icons.play },
        { pause: icons.pause },
        { skipForward: icons.skipForward },
      ];

      const elementWidth = element.getBoundingClientRect().width;

      d3.select(selector)
        .append('div')
        .classed('controls', true)
        .style('width', width)
        .style('right', elementWidth - width + margin.right + barPadding + 'px')
        .selectAll('div')
        .data(controlIcons)
        .enter()
        .append('div')
        .html((d) => Object.values(d)[0] as string)
        .attr('class', (d) => Object.keys(d)[0]);
    }

    function renderOverlays() {
      const overlayIcons = [
        { overlayPlay: icons.overlayPlay },
        { overlayRepeat: icons.overlayRepeat },
      ];

      d3.select(selector)
        .append('div')
        .classed('overlay', true)
        .style('minHeight', minHeight + 'px')
        .style('minWidth', minWidth + 'px')
        .selectAll('div')
        .data(overlayIcons)
        .enter()
        .append('div')
        .html((d) => Object.values(d)[0] as string)
        .attr('class', (d) => Object.keys(d)[0]);
    }
  }

  function renderFrame() {
    if (!x) {
      return;
    }

    const { tickDuration, topN, dateCounterFormat } = store.getState().options;
    const dateSlice = getDateSlice(data, store.getState().ticker.currentDate);

    x.domain([0, d3.max(dateSlice, (d: Data) => d.value) as number]);

    svg //
      .select('.xAxis')
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .call(xAxis);

    const bars = svg //
      .selectAll('.bar')
      .data(dateSlice, (d: Data) => d.name);

    bars
      .enter()
      .append('rect')
      .attr('class', (d: Data) => `bar ${d.name.replace(/\s/g, '_')}`)
      .attr('x', x(0) + 1)
      .attr('width', (d: Data) => Math.abs(x(d.value) - x(0) - 1))
      .attr('y', () => y(topN + 1) + 5)
      .attr('height', y(1) - y(0) - barPadding)
      .style('fill', (d: Data) => d.color)
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .attr('y', (d: Data) => y(d.rank as number) + 5);

    bars
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .attr('width', (d: Data) => Math.abs(x(d.value) - x(0) - 1))
      .attr('y', (d: Data) => y(d.rank as number) + 5);

    bars
      .exit()
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .attr('width', (d: Data) => Math.abs(x(d.value) - x(0) - 1))
      .attr('y', () => y(topN + 1) + 5)
      .remove();

    const labels = svg //
      .selectAll('.label')
      .data(dateSlice, (d: Data) => d.name);

    labels
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', labelX)
      .attr('y', () => y(topN + 1) + 5 + (y(1) - y(0)) / 2)
      .style('text-anchor', 'end')
      .html((d: Data) => d.name)
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .attr('y', (d: Data) => y(d.rank as number) + 5 + (y(1) - y(0)) / 2 + 1);

    labels
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .attr('x', labelX)
      .attr('y', (d: Data) => y(d.rank as number) + 5 + (y(1) - y(0)) / 2 + 1);

    labels
      .exit()
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .attr('x', labelX)
      .attr('y', () => y(topN + 1) + 5)
      .remove();

    const valueLabels = svg //
      .selectAll('.valueLabel')
      .data(dateSlice, (d: Data) => d.name);

    valueLabels
      .enter()
      .append('text')
      .attr('class', 'valueLabel')
      .attr('x', (d: Data) => x(d.value) + 5)
      .attr('y', () => y(topN + 1) + 5)
      .text((d: Data) => d3.format(',.0f')(d.lastValue as number))
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .attr('y', (d: Data) => y(d.rank as number) + 5 + (y(1) - y(0)) / 2 + 1);

    valueLabels
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .attr('x', (d: Data) => x(d.value) + 5)
      .attr('y', (d: Data) => y(d.rank as number) + 5 + (y(1) - y(0)) / 2 + 1)
      .tween('text', function (d: Data) {
        const i = d3.interpolateRound(d.lastValue as number, d.value);
        return function (t: number) {
          this.textContent = d3.format(',')(i(t));
        };
      });

    valueLabels
      .exit()
      .transition()
      .duration(tickDuration)
      .ease(d3.easeLinear)
      .attr('x', (d: Data) => x(d.value) + 5)
      .attr('y', () => y(topN + 1) + 5)
      .remove();

    dateCounterText.html(formatDate(store.getState().ticker.currentDate, dateCounterFormat));

    updateControls();
  }

  function resize() {
    if (
      (!store.getState().options.inputHeight && !store.getState().options.inputWidth) ||
      String(store.getState().options.inputHeight).startsWith('window') ||
      String(store.getState().options.inputWidth).startsWith('window')
    ) {
      const element = document.querySelector(store.getState().options.selector) as HTMLElement;

      height = getHeight(
        element,
        store.getState().options.minHeight,
        store.getState().options.inputHeight,
      );
      width = getWidth(
        element,
        store.getState().options.minWidth,
        store.getState().options.inputWidth,
      );

      const currentPosition = element.style.position; // "fixed" if scrolling
      renderInitalView();
      renderFrame();
      updateControls();
      element.style.position = currentPosition;
    }
  }

  function updateControls() {
    const showControls = store.getState().options.showControls;
    const showOverlays = store.getState().options.showOverlays;

    if (showControls === 'none' && showOverlays === 'none') {
      removeElement(elements.controls);
      removeElement(elements.overlay);
      return;
    }

    if (showControls === 'none') {
      removeElement(elements.controls);
    } else if (showControls === 'play') {
      removeElement(elements.skipBack);
      removeElement(elements.skipForward);
    }

    showElement(elements.controls);

    if (store.getState().ticker.isRunning) {
      showElement(elements.pause);
      hideElement(elements.play);
    } else {
      showElement(elements.play);
      hideElement(elements.pause);
    }

    if (showOverlays === 'none') {
      removeElement(elements.overlay);
      return;
    } else if (showOverlays === 'play') {
      removeElement(elements.overlayRepeat);
    } else if (showOverlays === 'repeat') {
      removeElement(elements.overlayPlay);
    }

    if (!store.getState().ticker.isFirstDate && !store.getState().ticker.isLastDate) {
      hideElement(elements.overlay);
      showElement(elements.controls);
    }

    if (store.getState().ticker.isFirstDate) {
      hideElement(elements.overlayRepeat);
    }

    if (store.getState().ticker.isLastDate) {
      hideElement(elements.overlayPlay);
    }

    if (
      store.getState().ticker.isFirstDate &&
      !store.getState().ticker.isRunning &&
      ['all', 'play'].includes(showOverlays)
    ) {
      showElement(elements.overlay);
      showElement(elements.overlayPlay);
      hideElement(elements.controls);
    }

    if (
      store.getState().ticker.isLastDate &&
      !store.getState().ticker.isRunning &&
      ['all', 'repeat'].includes(showOverlays)
    ) {
      setTimeout(() => {
        showElement(elements.overlay);
        showElement(elements.overlayRepeat);
        hideElement(elements.controls);
      }, store.getState().options.tickDuration);
    }
  }

  return {
    renderInitalView,
    renderFrame,
    resize,
  };
}
