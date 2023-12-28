import { Action } from '../store';
import { Data, WideData } from '../data';

export interface OptionsAction extends Action {
  payload: Partial<Options>;
}

export interface Options {
  dataShape: 'long' | 'wide';
  dataType: 'json' | 'csv' | 'tsv' | 'xml';
  dataTransform: null | TransformFn;
  fillDateGapsInterval: null | 'year' | 'month' | 'day';
  fillDateGapsValue: 'last' | 'interpolate';
  title: string;
  subTitle: string;
  dateCounter: string | ParamFunction;
  startDate: string;
  endDate: string;
  loop: boolean;
  caption: string;
  labelsPosition: 'inside' | 'outside';
  labelsWidth: number;
  showIcons: boolean;
  colorSeed: string | number;
  showGroups: boolean;
  tickDuration: number;
  topN: number;
  inputHeight: string;
  inputWidth: string;
  minHeight: number;
  minWidth: number;
  height: string;
  width: string;
  marginTop: number;
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  mouseControls: boolean;
  keyboardControls: boolean;
  controlButtons: 'all' | 'play' | 'none';
  overlays: 'all' | 'play' | 'repeat' | 'none';
  autorun: boolean;
  injectStyles: boolean;
  theme: string;
  colorMap: { [key: string]: string } | string[];
  fixedScale: boolean;
  fixedOrder: string[];
  highlightBars: boolean;
  selectBars: boolean;
}

export type TransformFn = (data: Data[] | WideData[]) => Data[] | WideData[];

export type ParamFunction = (currentDate: string, dateSlice: Data[], allDates: string[]) => string;
