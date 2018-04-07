const Display = (function() {

  class Digit {
    constructor(opts, x, y) {
      this.opts = opts;
      this.value = 0;
      const g = this.g = drawing.append('g')
        .attr('transform', 'translate(' + x + ', ' + (y + this.opts.height / 2) + ')');
      this.panels = [
        ['top', 1], ['top', 1], ['bottom', 1], ['bottom', 0],
      ].map(specs => this.initialize(g, ...specs));
      g.append('path').attrs({
        stroke: 'white',
        'stroke-width': 1,
        fill: 'none',
        d: 'M 0 0 L ' + this.opts.width + ' 0',
      });
    }

    setValue(newValue) {
      if (newValue === this.value) return;
      this.value = newValue;
      this.panels[0].text.text(newValue);
      this.panels[3].text.text(newValue);
      this.panels[1].g.transition().duration(this.opts.duration)
        .ease(d3.easeSinIn)
        .attr('transform', 'scale(1, 0)')
        .on('end', () => {
          this.panels[1].text.text(newValue);
          this.panels[1].g.attr('transform', 'scale(1, 1)');
          this.panels[3].g.transition().duration(this.opts.duration)
            .ease(d3.easeSinOut)
            .attr('transform', 'scale(1, 1)')
            .on('end', () => {
              this.panels[2].text.text(newValue);
              this.panels[3].g.attr('transform', 'scale(1, 0)');
            });
        });
    }

    initialize(parent, side, yScale) {
      const g = parent.append('g')
        .attr('transform', 'scale(1, ' + yScale + ')');
      g.append('rect').attrs({
        x: 0,
        y: -this.opts.height / 2,
        width: this.opts.width,
        height: this.opts.height,
        fill: this.opts.color,
        stroke: 'none',
      });
      const text = g.append('text').attrs({
        x: this.opts.width / 2,
        y: this.opts.height / 4,
        fill: 'white',
        stroke: 'none',
        'font-size': (this.opts.height * 0.75) + 'px',
        'text-anchor': 'middle',
        'font-family': 'helvetica',
      }).text('0');
      g.attr('clip-path', 'url(#show-' + side + ')');
      return {g, text};
    }
  }

  const svg = d3.select('svg');
  const drawing = svg.append('g')
    .attr('transform', 'translate(0, 0)');

  //const sec1 = new Digit(10, 10);
  //setInterval(() => sec1.incr(), 1000);
  //sec1.incr();

  const defScale = 0.5;
  const defaults = {
    duration: 150,
    scale: defScale,
    width: defScale * 75,
    height: defScale * 150,
    color: '#222',
    millis: false,
    gaps: [3, 9],
  };
  class Display {
    constructor(options, x=0, y=0) {
      const opts = Object.assign({}, defaults, options);
      const dNames = [
        'day1', 'day0', 'hour1', 'hour0', 'min1', 'min0', 'sec1', 'sec0',
        ...(opts.millis ? ['milli2', 'milli1', 'milli0'] : []),
      ];
      dNames.reduce((acc, name) => {
        const [lastName, lastX] = acc;
        const _x = lastX === null ? x : lastX + opts.width + opts.gaps[
          lastName.substr(0, 3) === name.substr(0, 3) ? 0 : 1
        ];
        this[name] = new Digit(opts, _x, y);
        return [name, _x];
      }, ['', null]);
    }
  }
  return Display;
})();
