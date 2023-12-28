import type { Data, WideData } from '../data';
import { actions, type Store } from '../store';
import { getDates, getNextDate } from './dates';
import { getBaseUrl, getWorkerDataURL } from './utils';

const worker = new Worker(getWorkerDataURL(getBaseUrl() + '/racing-bars.worker.js'));

export async function prepareData(
  data: Data[] | WideData[] | Promise<Data[]> | Promise<WideData[]> | string,
  store: Store,
  changingOptions = false,
): Promise<Data[]> {
  worker.postMessage({ type: 'prepare-data', data, options: store.getState().options });
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
  if (store.getState().data.dateSlices[date]) {
    // use cache
    dateSlice = store.getState().data.dateSlices[date];
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
  const groupFilter = store.getState().data.groupFilter;
  return groupFilter.length > 0 ? filterGroups(dateSlice, store) : dateSlice;
}

function filterGroups(data: Data[], store: Store) {
  const groupFilter = store.getState().data.groupFilter;
  return data
    .filter((d) => (!!d.group ? !groupFilter.includes(d.group) : true))
    .map((d, i) => ({ ...d, rank: getRank(d, i, store) }));
}

export function computeNextDateSubscriber(data: Data[], store: Store) {
  return function () {
    if (store.getState().ticker.isRunning) {
      const nextDate = getNextDate(
        store.getState().ticker.dates,
        store.getState().ticker.currentDate,
      );
      getDateSlice(nextDate, data, store);
    }
  };
}

function getRank(d: Data, i: number, store: Store) {
  const fixedOrder = store.getState().options.fixedOrder;
  return fixedOrder.length > 0 ? d.rank : i;
}
