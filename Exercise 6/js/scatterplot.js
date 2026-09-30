const drawScatterplot = data => {
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("border", "1px solid black");

    innerChartS = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const maxStar = d3.max(data, d => d.star); //find maximum star rating

    xScaleS //Configure Xscale
        .domain([0, maxStar])
        .range([0, innerWidth])
        .nice();

    const maxEnergy = d3.max(data, d => d.energyConsumption);

    yScaleS //Congifure Yscale
        .domain([0, maxEnergy])
        .range([innerHeight, 0]) //Y is reverse becoz SVG begins at top
        .nice();

    //Configure color scale
    const screenTypes = [...new Set(data.map(d => d.screenTech))];

    colorScale
        .domain(screenTypes)
        .range(d3.schemeTableau10);

    //Draw circle
    innerChartS
        .selectAll(".scatter-point")
        .data(data)
        .join("circle")
        .attr("class", "scatter-point")
        .attr("r", 4)
        .attr("cx", d => xScaleS(d.star))
        .attr("cy", d => yScaleS(d.energyConsumption))
        .attr("fill", d => colorScale(d.screenTech))
        .attr("opacity", 0.5);

    //Add x-axis
    const bottomAxis = d3.axisBottom(xScaleS);

    innerChartS
        .append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis);

    //label
    innerChartS
        .append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 55)
        .attr("text-anchor", "middle")
        .text("Star Rating");

    //Add y-axis
    const leftAxis =
        d3.axisLeft(yScaleS);

    innerChartS
        .append("g")
        .call(leftAxis);

    //label
    innerChartS
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -55)
        .attr("text-anchor", "middle")
        .text("Energy Consumption (kWh/year)");

    //Createing legend
    const legend = innerChartS
        .append("g")
        .attr("transform", `translate(${innerWidth - 100},10)`); //move legend to top right corner

    //create group for each screen type
    const legendItems = legend
        .selectAll(".legend-item")
        .data(screenTypes)
        .join("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(0, ${i * 25})`);

    //add coloured rectangle
    legendItems
        .append("rect")
        .attr("width", 14)
        .attr("height", 14)
        .attr("fill", d => colorScale(d));

    //add text
    legendItems
        .append("text")
        .attr("x", 20)
        .attr("y", 11)
        .text(d => d.toUpperCase());
};