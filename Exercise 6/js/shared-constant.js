// js/shared-constant.js

// Chart dimensions
const width = 800;
const height = 500;


// Margins
const margin = {
    top: 40,
    right: 30,
    bottom: 70,
    left: 80
};


// Inner chart dimensions
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;


// Colours
const barColor = "steelblue";
const bodyBackgroundColor = "white";


// Scales - Histogram
const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

// Scatterplot innerchart
let innerChartS;

// If reuse the same scales, 
// one chart could overwrite the other's settings.
// Scales - SCatterplot
const xScaleS = d3.scaleLinear();
const yScaleS = d3.scaleLinear();

// Set up tooltip dimensions
const tooltipWidth = 120;
const tooltipHeight = 40;

// Scatterplot colour scale
const colorScale = d3.scaleOrdinal();

// Histogram bin generator
const binGenerator = d3.bin() //d3 count how many TVs fall into each range
    .value(d => d.energyConsumption)
    .thresholds(14);

//filter information
const filters_screen = [
    {
        id: "all",
        label: "All",
        isActive: true
    },
    {
        id: "lcd",
        label: "LCD",
        isActive: false
    },
    {
        id: "led",
        label: "LED",
        isActive: false
    },
    {
        id: "oled",
        label: "OLED",
        isActive: false
    }
];