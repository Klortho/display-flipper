import Panel from './panel';
import PanelText from './panel-text';

class Digit {
  // x and y define the top-left corner of this digit's display
  constructor(parentG, x, y, opts) {
    Object.assign(this, {
      x, y, opts,
      value: null,
    });
    // Coordinate origin is at the center of the rectangle
    const tx = x + opts.width / 2;
    const ty = y + opts.height / 2;
    const g = parentG.append('g').attrs({
      transform: 'translate(' + tx + ', ' + ty + ')',
    });
    const panels = [];
    ['top', 'bottom'].forEach(side => {
      this[side] = {};
      ['under', 'over'].forEach(depth => {
        const panel = new Panel(g, side, opts);
        this[side][depth] = panel;
        panels.push(panel);
      });
    });
    g.append('path').attrs({
      stroke: 'white',
      'stroke-width': 1,
      fill: 'none',
      d: 'M ' + (-opts.width / 2) + ' 0 h ' + opts.width,
    });
    Object.assign(this, {opts, g, panels});
  }
  setValue(newValue) {
    return new Promise((resolve, reject) => {
      if (newValue === this.value) return;
      const panel = this.top.under;
      const panelText = new PanelText(panel.g, this.opts);
      const rbb = panel.rect.node().getBoundingClientRect();
      panelText.setValue(newValue, rbb);
      panel.setText(panelText);
      const setPanelText = p => {
        p.setText(panelText.clone(p.g));
      }
      this.bottom.over.setTo(0);
      setPanelText(this.bottom.over);
      this.top.over.animateTo(0, () => {
        setPanelText(this.top.over);
        this.top.over.setTo(1);
        this.bottom.over.animateTo(1, () => {
          setPanelText(this.bottom.under);
          return resolve(this);
        });
      });
    });
  }
}

export default Digit;
