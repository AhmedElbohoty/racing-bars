import type { Data, WideData } from '../data';
import type { Options } from '../options';
import {
  actions,
  selectDataDateSlices,
  selectDataGroupFilter,
  selectOptFixedOrder,
  selectOptions,
  selectTicker,
  type Store,
} from '../store';
import { loadData } from '../load-data';
// @ts-ignore
// eslint-disable-next-line import/no-internal-modules
import workerSrc from '../../../tmp/racing-bars.worker.js';
import { getDates, getNextDate } from './dates';
import { createWorkerFromContent } from './utils';

const worker = createWorkerFromContent(workerSrc);

export async function prepareData(
  data: Data[] | WideData[] | Promise<Data[]> | Promise<WideData[]> | string,
  store: Store,
  changingOptions = false,
): Promise<Data[]> {
  const options = selectOptions(store.getState());
  const { dataTransform, dataType } = options;
  if (typeof dataTransform === 'function') {
    if (typeof data === 'string') {
      data = await loadData(data, dataType);
    }
    data = dataTransform(await data);
  }
  worker.postMessage({
    type: 'prepare-data',
    data,
    options: removeFnOptions(options),
  });
  const preparedData = await new Promise<Data[]>((resolve) => {
    worker.addEventListener(
      'message',
      (event) => {
        if (event.data.type === 'data-prepared') {
          resolve(event.data.data);
        }
      },
      { once: true },
    );
  });
  storeDataCollections(preparedData, store, changingOptions);
  return preparedData;
}

function removeFnOptions(options: Options) {
  // functions cannot be cloned to web workers
  return Object.keys(options).reduce((acc, key) => {
    if (typeof (options as any)[key] !== 'function') {
      (acc as any)[key] = (options as any)[key];
    }
    return acc;
  }, {} as Options);
}

function storeDataCollections(data: Data[], store: Store, changingOptions: boolean) {
  const names = Array.from(new Set(data.map((d) => String(d.name)))).sort();
  const groups = Array.from(new Set(data.map((d) => String(d.group))))
    .filter(Boolean)
    .sort();
  const dates = getDates(data);

  store.dispatch(actions.data.dataLoaded({ names, groups, datesCache: dates }));
  if (!changingOptions) {
    store.dispatch(actions.ticker.initialize(dates));
  } else {
    store.dispatch(actions.ticker.changeDates(dates));
  }
}

export function getDateSlice(date: string, data: Data[], store: Store) {
  let dateSlice: Data[];

  const dateSlices = selectDataDateSlices(store.getState());
  if (dateSlices[date]) {
    // use cache
    dateSlice = dateSlices[date];
  } else {
    const slice = data
      .filter((d) => d.date === date && !isNaN(d.value))
      .sort((a, b) => b.value - a.value)
      .map((d, i) => ({ ...d, rank: getRank(d, i, store) }));

    const emptyData = [{ name: '', value: 0, lastValue: 0, date, rank: 1 }];
    dateSlice = slice.length > 0 ? slice : emptyData;
    // save to cache
    store.dispatch(actions.data.addDateSlice(date, dateSlice));
  }
  const groupFilter = selectDataGroupFilter(store.getState());
  return groupFilter.length > 0 ? filterGroups(dateSlice, store) : dateSlice;
}

function filterGroups(data: Data[], store: Store) {
  const groupFilter = selectDataGroupFilter(store.getState());
  return data
    .filter((d) => (!!d.group ? !groupFilter.includes(d.group) : true))
    .map((d, i) => ({ ...d, rank: getRank(d, i, store) }));
}

export function computeNextDateSubscriber(data: Data[], store: Store) {
  const { isRunning, dates, currentDate } = selectTicker(store.getState());
  return function () {
    if (isRunning) {
      const nextDate = getNextDate(dates, currentDate);
      getDateSlice(nextDate, data, store);
    }
  };
}

function getRank(d: Data, i: number, store: Store) {
  const fixedOrder = selectOptFixedOrder(store.getState());
  return fixedOrder.length > 0 ? d.rank : i;
}
