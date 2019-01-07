var sliderRange = d3
    .sliderBottom()
    .min(new Date(1994, 1, 1))
    .max(new Date(2018, 1, 1))
    .width(window.width - 100)
    .tickFormat(d3.timeFormat('%Y'))
    .step(1000 * 60 * 60 * 24 * 365)
    .default([new Date(1994, 1, 1), new Date(2018, 1, 1)])
    .fill('#2196f3')
    .on('onchange', val => {
            start_year = val[0].getFullYear();
            end_year = val[1].getFullYear();
            render()
        }
    );

var gRange = d3
    .select('div#slider-range')
    .append('svg')
    .attr('width', window.width)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

gRange.call(sliderRange);

d3.select('p#value-range').text(
    sliderRange
        .value()
        .map(d3.format('.2%'))
        .join('-')
);