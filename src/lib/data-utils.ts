import * as d3 from './d3';

import { getDateString, getDates } from './dates';
import { Data, WideData } from './data';
import { actions, Store } from './store';
import { Options } from './options';

export function prepareData(rawData: Data[], store: Store) {
  const options = store.getState().options;

  let data = rawData
    .map((d) => ({ ...d, date: getDateString(d.date) }))
    .filter((d) => (options.startDate ? d.date >= options.startDate : true))
    .filter((d) => (options.endDate ? d.date <= options.endDate : true));

  if (options.dataShape === 'wide') {
    data = wideDataToLong(data);
  }

  data = data
    .map((d) => {
      const name = d.name ? d.name : '';
      const value = isNaN(+d.value) ? 0 : +d.value;
      return { ...d, name, value };
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));

  if (options.fillDateGaps) {
    data = fillGaps(data, options.fillDateGaps, options.fillDateGapsValue);
  }

  data = calculateLastValues(data);

  storeDataCollections(data, store);

  return data;
}

function storeDataCollections(data: Data[], store: Store) {
  const names = Array.from(new Set(data.map((d) => d.name))).sort() as string[];
  const groups = Array.from(new Set(data.map((d) => d.group)))
    .filter(Boolean)
    .sort() as string[];
  const dates = getDates(data);

  store.dispatch(actions.data.dataLoaded({ names, groups }));
  store.dispatch(actions.ticker.initialize(dates));
}

function calculateLastValues(data: Data[]) {
  return data
    .sort((a, b) => a.name.localeCompare(b.name) || a.date.localeCompare(b.date))
    .reduce((acc: Data[], curr) => {
      if (acc.length === 0) {
        curr.lastValue = curr.value;
      } else {
        const last = acc[acc.length - 1];
        if (curr.name === last.name) {
          curr.lastValue = last.value;
        } else {
          curr.lastValue = curr.value;
        }
      }
      return [...acc, curr];
    }, []);
}

function wideDataToLong(wide: WideData[]) {
  const long = [] as Data[];
  wide.forEach((item) => {
    for (const [key, value] of Object.entries(item)) {
      long.push({
        date: item.date,
        name: key,
        value: Math.round(Number(value)),
      });
    }
  });
  return long;
}

function longDataToWide(long: Data[]) {
  const wide = [] as any[];
  long.forEach((item) => {
    const dateRow = wide.filter((r) => r.date === item.date);
    const row = dateRow.length > 0 ? dateRow[0] : {};
    row[item.name] = item.value;
    if (dateRow.length === 0) {
      row.date = item.date;
      wide.push(row);
    }
  });
  return wide;
}

function fillGaps(
  data: Data[],
  period: Options['fillDateGaps'],
  fillValue: Options['fillDateGapsValue'],
) {
  const intervalRange =
    period === 'years'
      ? d3.timeYear.every(1)?.range
      : period === 'months'
      ? d3.timeMonth.every(1)?.range
      : period === 'days'
      ? d3.timeDay.every(1)?.range
      : null;

  if (!intervalRange) {
    return data;
  }

  const wideData = longDataToWide(data).map((d) => ({ ...d, date: new Date(d.date) }));

  const missingData = wideData.reduce(
    (acc: any[], row, i) => {
      const lastDate = acc[acc.length - 1].date;
      const range = intervalRange(lastDate, row.date);
      const rangeStep = 1 / range.length;
      if (i < wideData.length) {
        const iData = d3.interpolate(wideData[i - 1], wideData[i]);
        const newData: any[] = [];
        range.forEach((_, j) => {
          const values = fillValue === 'last' ? iData(0) : iData((j + 1) * rangeStep);
          const newRow = { ...values, date: range[j] };
          newData.push(getDateString(row.date) === getDateString(newRow.date) ? row : newRow);
        });
        return [...acc, ...newData];
      } else {
        return [...acc];
      }
    },
    [wideData[0]],
  );

  const allData = missingData.map((d) => ({ ...d, date: getDateString(d.date) }));

  // eslint-disable-next-line no-console
  console.log(wideData);
  // eslint-disable-next-line no-console
  console.log(allData);
  return wideDataToLong(allData);
}

export function getDateSlice(data: Data[], date: string, groupFilter: string[]) {
  const slice = data
    .filter((d) => d.date === date && !isNaN(d.value))
    .filter((d) => (!!d.group ? !groupFilter.includes(d.group) : true))
    .sort((a, b) => b.value - a.value)
    .map((d, i) => ({ ...d, rank: i }));

  const emptyData = [{ name: '', value: 0, lastValue: 0, date, rank: 1 }];

  return slice.length > 0 ? slice : emptyData;
}
