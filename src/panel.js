import {easeSinIn, easeSinOut} from 'd3';

var count = 0;
class Panel {
  constructor(parentG, side, opts) {
    const left = -opts.width / 2;
    const top = -opts.height / 2;
    const clipId = 'clip-' + count++;
    const clipper = parentG.append('clipPath').attr('id', clipId);
    clipper.append('rect').attrs({
      x: left,
      y: side === 'top' ? top : 0,
      width: opts.width,
      height: opts.height / 2,
      fill: 'none',
      stroke: 'none',
    });
    const g = parentG.append('g').attrs({
      'clip-path': 'url(#' + clipId + ')',
    });
    const rect = g.append('rect').attrs({
      x: left,
      y: top,
      width: opts.width,
      height: opts.height,
      fill: opts.color,
      stroke: '#888',
      'stroke-width': 1,
    });
    Object.assign(this, {
      opts, g, clipId, clipper, rect,
      text: null,
      easing: side === 'top' ? easeSinIn : easeSinOut,
    });
  }
  setText(panelText) {
    if (this.text) this.text.g.remove();
    this.text = panelText;
  }
  setTo(yScale) {
    this.g.attr('transform', 'scale(1, ' + yScale + ')');
  }
  animateTo(yScale, onEnd) {
    this.g.transition().duration(this.opts.duration/2)
      .ease(this.easing)
      .attr('transform', 'scale(1, ' + yScale + ')')
      .on('end', onEnd);
    return this;
  }
}

export default Panel;
