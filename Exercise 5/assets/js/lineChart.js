//CREATE LINE CHART
const drawLineChart = data => {

    const width = 700;
    const height = 450;

    const margin = {
        top: 50,
        right: 30,
        bottom: 80,
        left: 90
    };

    //calculate area available for the lines
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    //creating X-scale for year
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, innerWidth]);

    //creating y-scale for average price
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.averagePrice)])
        .range([innerHeight, 0])
        .nice();

    //X-axis
    const bottomAxis = d3.axisBottom(xScale)
        .ticks(10)
        .tickFormat(d3.format("d"));

    //Y-axis
    const leftAxis = d3.axisLeft(yScale);

    //create the chart
    const svg = d3.select("#line-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("border", "1px solid black")

    const innerChart = svg
        .append("g")
        .attr(
            "transform",
            `translate(${margin.left}, ${margin.top})`
        );

    innerChart
        .append("g")
        .attr(
            "transform",
            `translate(0, ${innerHeight})`
        )
        .call(bottomAxis);

    innerChart
        .append("g")
        .call(leftAxis);

    //adding label to x-axis
    innerChart
        .append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 60)
        .attr("text-anchor", "middle")
        .text("Year");

    //adding label to y-axis
    innerChart
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -60)
        .attr("text-anchor", "middle")
        .text("Average Price ($ per megawatt hour)");

    //create the line generator
    const lineGenerator = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.averagePrice));

    //creating the scatterplot (creates one circle per year)
    innerChart
        .selectAll(".data-point")
        .data(data)
        .join("circle")
        .attr("class", "data-point")
        .attr("r", 4)
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.averagePrice));

    //draw the line
    innerChart
        .append("path")
        .datum(data)
        .attr("class", "price-line")
        .attr("d", lineGenerator);
};

//LOAD DATA
d3.csv("assets/data/ARE_Spot_Prices.csv", d => {
    return {
        //converts both year & average to number
        year: +d.Year,
        averagePrice: +d["Average Price (notTas-Snowy)"]
    };
})
    .then(data => {
        //sort from earliest year to latest year
        data.sort((a, b) => a.year - b.year);
        console.log(data);
        drawLineChart(data);
    });