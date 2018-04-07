const Display = (function() {
  const duration = 200;
  const dScale = 0.5;
  const dWidth = dScale * 75;
  const dHeight = dScale * 150;
  var dColor = '#333';

  const svg = d3.select('svg');
  const drawing = svg.append('g')
    .attr('transform', 'translate(0, 100)');

  class Digit {
    constructor(x=100, y=100) {
      this.value = 0;
      const g = this.g = drawing.append('g')
        .attr('transform', 'translate(' + x + ', ' + y + ')');
      this.topUnder = drawDigit(g, 'top', 1);
      this.topOver = drawDigit(g, 'top', 1);
      this.bottomUnder = drawDigit(g, 'bottom', 1);
      this.bottomOver = drawDigit(g, 'bottom', 0);
      g.append('path').attrs({
        stroke: 'white',
        'stroke-width': 2,
        fill: 'none',
        d: 'M 0 0 L ' + dWidth + ' 0',
      });
    }

    setValue(newValue) {
      //const newValue = (this.value++) % 10;
      this.topUnder.text.text(newValue);
      this.bottomOver.text.text(newValue);
      this.topOver.g.transition().duration(duration)
        .ease(d3.easeSinIn)
        .attr('transform', 'scale(1, 0)')
        .on('end', () => {
          this.topOver.text.text(newValue);
          this.topOver.g.attr('transform', 'scale(1, 1)');
          this.bottomOver.g.transition().duration(duration)
            .ease(d3.easeSinOut)
            .attr('transform', 'scale(1, 1)')
            .on('end', () => {
              this.bottomUnder.text.text(newValue);
              this.bottomOver.g.attr('transform', 'scale(1, 0)');
            });
        });
    }
  }

  function drawDigit(parent, topBottom, yScale) {
    const g = parent.append('g')
      .attr('transform', 'scale(1, ' + yScale + ')');
    g.append('rect').attrs({
      x: 0, y: -dHeight / 2,
      width: dWidth, height: dHeight,
      fill: dColor,
      stroke: 'none',
    });
    const text = g.append('text').attrs({
      x: dWidth / 2, y: dHeight / 4,
      fill: 'white',
      stroke: 'none',
      'font-size': (dHeight * 0.75) + 'px',
      'text-anchor': 'middle',
      'font-family': 'helvetica',
    }).text('0');
    g.attr('clip-path', 'url(#show-' + topBottom + ')');
    return {g, text};
  }

  //const sec1 = new Digit(10, 10);
  //setInterval(() => sec1.incr(), 1000);
  //sec1.incr();

  class Display {
    constructor(color='#222', millis=false) {
      dColor = color;
      if (millis) {
        this.milli0 = new Digit(dScale * 816, 0);
        this.milli1 = new Digit(dScale * 738, 0);
        this.milli2 = new Digit(dScale * 660, 0);
      }
      this.sec0 = new Digit(dScale * 573, 0);
      this.sec1 = new Digit(dScale * 495, 0);
      this.min0 = new Digit(dScale * 408, 0);
      this.min1 = new Digit(dScale * 330, 0);
      this.hour0 = new Digit(dScale * 243, 0);
      this.hour1 = new Digit(dScale * 165, 0);
      this.day0 = new Digit(dScale * 78, 0);
      this.day1 = new Digit(dScale * 0, 0);
    }
  }
  return Display;
})();
