import defaults from './defaults';
import Digit from './digit';
import {select} from 'd3';
import 'd3-selection-multi';

const fam = dName => dName.substr(0, 1);

class Flipper {
  constructor(selector, digitNames, options=null, x=0, y=0) {
    const svg = select(selector);
    const opts = Object.assign({}, defaults, options);
    const g = svg.append('g');
    const digits = [];
    const byName = {};
    var lastX = null;
    var lastName = null;
    digitNames.forEach(curName => {
      const curX = lastX === null ? x
        : lastX + opts.width + opts.gap(lastName, curName);
      const digit = new Digit(g, curX, y, opts);
      digits.push(digit);
      byName[curName] = digit;
      lastX = curX;
      lastName = curName;
    });
    Object.assign(this, {opts, g, digits, byName});
  }
}
Flipper.nextId = 0;


export default Flipper;
