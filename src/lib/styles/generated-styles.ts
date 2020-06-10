// This file is auto-generated and will be over-written!
// Please do NOT edit this file directly
// You may edit files in this folder instead: src\lib\css

export const styles = `
__selector__ text {
  font-size: 16px;
  font-family: Open Sans, sans-serif;
}

__selector__ text.title {
  font-size: 24px;
  font-weight: 500;
}

__selector__ text.subTitle {
  font-weight: 500;
}

__selector__ text.caption {
  font-weight: 400;
  font-size: 24px;
}

__selector__ text.label {
  font-weight: 600;
}

__selector__ text.valueLabel {
  font-weight: 300;
}

__selector__ text.dateCounterText {
  font-size: 64px;
  font-weight: 700;
}

__selector__ .xAxis .tick:nth-child(2) text {
  text-anchor: start;
}

__selector__ .tick line {
  shape-rendering: CrispEdges;
}

__selector__ path.domain {
  display: none;
}

__selector__ {
  position: relative;
}

__selector__ .controls {
  /*  width and right are set dynamically in renderer.ts */
  position: absolute;
  top: 0;
  display: flex;
}

__selector__ .controls div,
__selector__ .overlay div {
  cursor: pointer;
  font-size: 24px;
  font-weight: 700;
  width: 38px;
  height: 38px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  margin: 5px;
  text-align: center;
}

__selector__ .controls svg {
  margin: 5px auto;
  width: 28px;
  height: 28px;
}

__selector__ .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
__selector__ .overlay div {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  -moz-border-radius: 100px;
  -webkit-border-radius: 100px;
  border-radius: 100px;
}
__selector__ .overlay svg {
  height: 50%;
  width: 50%;
}
`;

export const themes = {
"dark": `
__selector__ {
  background-color: #313639;
}

__selector__ text.title {
  fill: #fafafa;
}

__selector__ text.subTitle {
  fill: #cccccc;
}

__selector__ text.dateCounterText {
  fill: #cccccc;
  opacity: 1;
}

__selector__ text.caption {
  fill: #cccccc;
}

__selector__ .halo {
  fill: #313639;
  stroke: #313639;
  stroke-width: 10;
  stroke-linejoin: round;
  opacity: 1;
}

__selector__ text.label {
  fill: #313639;
}

__selector__ text.valueLabel {
  fill: #fafafa;
}

__selector__ .tick text {
  fill: #cccccc;
}

__selector__ .tick line {
  shape-rendering: CrispEdges;
  stroke: #dddddd;
}

__selector__ .tick line.origin {
  stroke: #aaaaaa;
}

__selector__ .controls div,
__selector__ .overlay div {
  color: #ffffff;
  background: #777777;
  border: 1px solid black;
  opacity: 0.5;
}

__selector__ .controls div:hover,
__selector__ .overlay div:hover {
  background: #aaaaaa;
  color: black;
}

__selector__ .overlay {
  background-color: black;
  opacity: 0.7;
}
`,
"light": `
/* __selector__ {
  background-color: #ffffff;
}

__selector__ text.title {
  fill: #fafafa;
} */

__selector__ text.subTitle {
  fill: #777777;
}

__selector__ text.dateCounterText {
  fill: #bbbbbb;
  opacity: 1;
}

__selector__ text.caption {
  fill: #777777;
}

__selector__ .halo {
  fill: #ffffff;
  stroke: #ffffff;
  stroke-width: 10;
  stroke-linejoin: round;
  opacity: 1;
}

__selector__ text.label {
  fill: #000000;
}

__selector__ text.valueLabel {
  fill: #000000;
}

__selector__ .tick text {
  fill: #777777;
}

__selector__ .tick line {
  shape-rendering: CrispEdges;
  stroke: #dddddd;
}

__selector__ .tick line.origin {
  stroke: #aaaaaa;
}

__selector__ .controls div,
__selector__ .overlay div {
  color: #ffffff;
  background: #777777;
  border: 1px solid black;
  opacity: 0.5;
}

__selector__ .controls div:hover,
__selector__ .overlay div:hover {
  background: #aaaaaa;
  color: black;
}

__selector__ .overlay {
  background-color: black;
  opacity: 0.7;
}
`,
};
