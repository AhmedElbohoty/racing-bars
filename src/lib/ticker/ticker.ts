import * as d3 from '../d3';
import {
  actions,
  selectOptLoop,
  selectOptTickDuration,
  selectTickIsLastDate,
  selectTickIsRunning,
  type Store,
} from '../store';
import type { Ticker } from './ticker.models';

export function createTicker(store: Store): Ticker {
  let ticker: d3.Timer;

  function start() {
    let justStarted = true;
    const tickDuration = selectOptTickDuration(store.getState());
    const isLastDate = selectTickIsLastDate(store.getState());
    ticker = d3.interval(showRace, tickDuration);
    store.dispatch(actions.ticker.setRunning(true));

    function showRace(_: number) {
      if (!isLastDate) {
        store.dispatch(actions.ticker.inc());
      } else {
        if (selectOptLoop(store.getState()) || justStarted) {
          loop();
        } else {
          stop();
        }
      }
      justStarted = false;
    }
  }

  function stop() {
    if (ticker) {
      ticker.stop();
    }
    store.dispatch(actions.ticker.setRunning(false));
  }

  function skipBack() {
    stop();
    store.dispatch(actions.ticker.setFirst());
  }

  function loop() {
    store.dispatch(actions.ticker.setFirst());
  }

  function skipForward() {
    stop();
    store.dispatch(actions.ticker.setLast());
    store.dispatch(actions.ticker.setLast()); // workaround to avoid showing lastValue
  }

  function toggle() {
    const isLastDate = selectTickIsLastDate(store.getState());
    const isRunning = selectTickIsRunning(store.getState());

    if (isLastDate) {
      skipBack();
      start();
    } else if (isRunning) {
      stop();
    } else {
      start();
    }
  }

  function goToDate(date: string) {
    store.dispatch(actions.ticker.updateDate(date));
  }

  return {
    start,
    stop,
    skipBack,
    loop,
    skipForward,
    toggle,
    goToDate,
  };
}
