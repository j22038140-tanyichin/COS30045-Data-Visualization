// js/histogram.js
const drawHistogram = data => {
    const svg = d3.select("#histogram")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("border", "1px solid black");

    const innerChart = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const bins = binGenerator(data);
    console.log(bins); //check bin data

    const binsMinMax = [
        bins[0].x0, //first bin minimum --> x-axis start
        bins[bins.length - 1].x1 //last bin maximum --> x-axis end
    ];

    //find the largest frequency
    const binsMaxLength = d3.max(bins, d => d.length);

    //configure scale
    xScale //energy consumption
        .domain(binsMinMax)
        .range([0, innerWidth]);

    yScale //frequency
        .domain([0, binsMaxLength])
        .range([innerHeight, 0])
        .nice();

    //draw histogram bars
    innerChart
        .selectAll(".histogram-bar")
        .data(bins)
        .join("rect")
        .attr("class", "histogram-bar")
        .attr("x", d => xScale(d.x0))
        //d.length = number of TVs inside that bin
        .attr("y", d => yScale(d.length))
        .attr("width", d => xScale(d.x1) - xScale(d.x0))
        .attr("height", d => innerHeight - yScale(d.length))
        .attr("fill", barColor)
        .attr("stroke", bodyBackgroundColor)
        .attr("stroke-width", 1);

    const bottomAxis = d3.axisBottom(xScale);
    innerChart
        .append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis);

    //x-axis label
    innerChart
        .append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 55)
        .attr("text-anchor", "middle")
        .text(
            "Energy Consumption (kWh/year)"
        );

    const leftAxis = d3.axisLeft(yScale);
    innerChart
        .append("g")
        .call(leftAxis);

    //y-axis label
    innerChart
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -55)
        .attr("text-anchor", "middle")
        .text("Frequency");
}

