import {select} from 'd3';

function computeScale(rbb, tbb, padding) {
  const rw = rbb.width - 2 * padding;
  const rh = rbb.height - 2 * padding;
  return (tbb.width <= rw & tbb.height <= rh) ? 1
      : Math.min(rw / tbb.width, rh / tbb.height);
}

// The text string will be centered at the origin of the container's
// coordinate system, and scaled and translated to fit inside a
// rectangle specified by rbb (x, y, width, height).
class PanelText {
  constructor(parentG, opts) {
    Object.assign(this, {parentG, opts});
  }
  setValue(value, rbb) {
    const {parentG, opts} = this;
    const g = parentG.append('g');
    const text = g.append('text').attrs({
      x: 0,
      y: 0,
      fill: opts.textColor,
      stroke: 'none',
      'font-size': opts.fontSize + 'px',
      'font-family': opts.font,
    }).text(value);

    // center the text in the rectangle
    const tbb = text.node().getBoundingClientRect();
    const rcx = rbb.x + rbb.width / 2;  // rectangle center x
    const tcx = tbb.x + tbb.width / 2;
    const tx = rcx - tcx;
    const rcy = rbb.y + rbb.height / 2;
    const tcy = tbb.y + tbb.height / 2;
    const ty = rcy - tcy;

    // shrink to fit, if necessary
    const scale = opts.shrinkToFit ? computeScale(rbb, tbb, opts.padding) : 1;
    g.attr('transform', 'scale(' + scale + ') ' +
      'translate(' + tx + ', ' + ty + ')');

    Object.assign(this, {value, g, tx, ty, scale});
  }
  show() {
    this.g.attr('visibility', 'visible');
  }
  clone(parentG) {
    const newPT = new PanelText(parentG, this.opts);
    ['value', 'tx', 'ty', 'scale'].forEach(
      prop => newPT[prop] = this[prop]);
    const gElem = this.g.node().cloneNode(true);
    parentG.node().appendChild(gElem);
    newPT.g = select(gElem);
    return newPT;
  }
}

export default PanelText;
