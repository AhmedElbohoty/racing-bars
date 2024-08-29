import type { State } from './models';

export const selectTriggerRender = (state: State) => state.triggerRender;

// Container selectors
// All container selectors are prefixed with `selectCont`
export const selectContainer = (state: State) => state.container;
export const selectContElement = (state: State) => state.container.element;

// Data selectors
// All data selectors are prefixed with `selectData`
export const selectData = (state: State) => state.data;
export const selectDataNames = (state: State) => state.data.names;
export const selectDataGroups = (state: State) => state.data.groups;
export const selectDataDateSlices = (state: State) => state.data.dateSlices;
export const selectDataDateCache = (state: State) => state.data.datesCache;
export const selectDataGroupFilter = (state: State) => state.data.groupFilter;
export const selectDataSelected = (state: State) => state.data.selected;

// Options selectors
// All options selectors are prefixed with `selectOpt`
export const selectOptions = (state: State) => state.options;
export const selectOptFixedOrder = (state: State) => state.options.fixedOrder;
export const selectOptMouseControls = (state: State) => state.options.mouseControls;
export const selectOptKeyboardControls = (state: State) => state.options.keyboardControls;
export const selectOptHighlightBars = (state: State) => state.options.highlightBars;
export const selectOptSelectBars = (state: State) => state.options.selectBars;
export const selectOptShowGroups = (state: State) => state.options.showGroups;
export const selectOptShowIcons = (state: State) => state.options.showIcons;
export const selectOptTickDuration = (state: State) => state.options.tickDuration;
export const selectOptLoop = (state: State) => state.options.loop;

// Ticker selectors
// All ticker selectors are prefixed with `selectTick`
export const selectTicker = (state: State) => state.ticker;
export const selectTickDates = (state: State) => state.ticker.dates;
export const selectTickCurrentDate = (state: State) => state.ticker.currentDate;
export const selectTickIsRunning = (state: State) => state.ticker.isRunning;
export const selectTickIsFirstDate = (state: State) => state.ticker.isFirstDate;
export const selectTickIsLastDate = (state: State) => state.ticker.isLastDate;
