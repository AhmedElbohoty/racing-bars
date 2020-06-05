import * as d3 from './d3';

import { Data } from './models';
import { store } from './store';

export function getColor(d: Data, disableGroupColors: boolean, colorSeed: string) {
  const nameseed = d.group && !disableGroupColors ? d.group : d.name;
  const seed = nameseed + colorSeed;
  return d3.hsl(random(seed) * 360, 0.75, 0.75);
}

export function zeroPad(n: string, w: number) {
  while (n.toString().length < w) {
    n = '0' + n;
  }
  return n;
}

export function random(seedStr: string) {
  function toNumbers(s: string) {
    let nums = '';
    for (let i = 0; i < s.length; i++) {
      nums += zeroPad(String(s.charCodeAt(i)), 3);
    }
    return nums;
  }

  const seed = toNumbers(seedStr);
  const x = Math.sin(+seed) * 10000;
  return x - Math.floor(x);
}

export function randomString(prefix: string, n: number) {
  const rnd = Array(3)
    .fill(null)
    .map(() => Math.random().toString(36).substr(2))
    .join('');
  return prefix + rnd.slice(-n);
}

export function generateId(prefix = 'racingbars', n = 8) {
  return randomString(prefix, n);
}

export function getHeight(element: HTMLElement, minHeight: number, height?: string) {
  let newHeight;
  if (!height) {
    newHeight = element.getBoundingClientRect().height;
  } else if (String(height).startsWith('window')) {
    const scale = +height.split('*')[1] || 1;
    newHeight = window.innerHeight * scale;
  } else {
    newHeight = +height;
  }
  return newHeight > minHeight ? newHeight : minHeight;
}

export function getWidth(element: HTMLElement, minWidth: number, width?: string) {
  let newWidth;
  if (!width) {
    newWidth = element.getBoundingClientRect().width;
  } else if (String(width).startsWith('window')) {
    const scale = +width.split('*')[1] || 1;
    newWidth = window.innerWidth * scale;
  } else {
    newWidth = +width;
  }
  return newWidth > minWidth ? newWidth : minWidth;
}

export function getElement(className: string) {
  const element = document.querySelector(store.getState().options.selector) as HTMLElement;
  return element.querySelector('.' + className) as HTMLElement;
}

export function showElement(className: string) {
  const selector = store.getState().options.selector;
  const element = document.querySelector(selector + ' .' + className) as HTMLElement;
  if (element) {
    element.style.display = 'flex';
  }
}

export function hideElement(className: string) {
  const selector = store.getState().options.selector;
  const element = document.querySelector(selector + ' .' + className) as HTMLElement;
  if (element) {
    element.style.display = 'none';
  }
}
export function removeElement(className: string) {
  const selector = store.getState().options.selector;
  const element = document.querySelector(selector + ' .' + className) as HTMLElement;
  if (element) {
    element.remove();
  }
}

export function addEventHandler(className: string, event: string, handler: () => void) {
  const element = getElement(className);
  if (element) {
    element.addEventListener(event, handler);
  }
}

export function debounce(func: any, wait: number, immediate = false) {
  let timeout: any;
  return function () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;
    const args: any = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}
