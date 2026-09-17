//DRAW DONUT CHART
const drawDonutChart = data => {
    const width = 700;
    const height = 500;

    const radius = Math.min(width, height) / 2 - 50;

    //large, medium, small is discrete categories so use "scaleOrdinal"
    const colourScale = d3.scaleOrdinal()
        .domain(data.map(d => d.category))
        .range(d3.schemeTableau10); //d3 auto assign diff color to each category

    //calculate ANGLE
    const pie = d3.pie()
        .sort(null) //keep the same order as CSV (no sorting)
        .value(d => d.count); //tell d3 the side of each slice depends on "count"

    //create ARC GENERATOR
    const arcGenerator = d3.arc()
        .innerRadius(radius * 0.6) //creates the hole
        //.innerRadiu(0) = normal pie chart
        .outerRadius(radius);

    //create SVG
    const svg = d3.select("#donut-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("border", "1px solid black");

    //create a GROUP for DONUT
    const innerChart = svg
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`); //move to the centre of SVG

    //draw the ARCS (pie data)
    const pieData = pie(data); //turns data into arc-angle info

    //draw donut slices
    innerChart
        .selectAll(".slice")
        .data(pieData)
        .join("path")
        .attr("class", "slice")
        .attr("d", arcGenerator) //turns angles into actual SVG paths
        .attr("fill", d => colourScale(d.data.category));

    //add labels
    innerChart
        .selectAll(".donut-label")
        .data(pieData)
        .join("text")
        .attr("class", "donut-label")
        .attr("transform", d => `translate(${arcGenerator.centroid(d)})`) //finds the centre of each slice
        .attr("text-anchor", "middle")
        .text(d => d.data.category)
    //.text(d => `${d.data.category}: ${d.data.count}`); = exp "large: 1352"

}

//LOAD DATA
d3.csv("assets/data/Data_exercise5.3.csv", d => {
    return {
        //converts both year & average to number
        category: d.Screensize_Category,
        count: +d.Count
    };
}).then(data => {
    console.log(data);
    drawDonutChart(data);
});