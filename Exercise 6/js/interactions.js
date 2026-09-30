// js/interactions.js
const updateHistogram = (filterId, data) => {
    // use all data if "all" is selected
    // otherwise filter according to screen technology
    const updatedData = filterId === "all"
        ? data
        : data.filter(tv => tv.screenTech === filterId);

    console.log("Filter:", filterId);
    console.log("Filtered records:", updatedData.length);

    // create new bins
    const updatedBins = binGenerator(updatedData);

    // update histogram bars
    d3.selectAll("#histogram .histogram-bar")
        .data(updatedBins)
        .transition()
        .duration(500)
        .ease(d3.easeCubicInOut)
        .attr("y", d => yScale(d.length))
        .attr("height", d => innerHeight - yScale(d.length));
};

//create historgram tooltip
const createHistogramTooltip = () => {

    // select the innerChart of histogram
    const histogramInnerChart = d3.select("#histogram svg > g");

    const tooltip = histogramInnerChart
        .append("g")
        .attr("class", "histogram-tooltip")
        .style("opacity", 0);

    // tooltip rectangle
    tooltip
        .append("rect")
        .attr("width", histogramTooltipWidth)
        .attr("height", histogramTooltipHeight)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("fill", "purple")
        .attr("opacity", 0.9);

    // tooltip text
    tooltip
        .append("text")
        .attr("class", "histogram-tooltip-text")
        .attr("x", histogramTooltipWidth / 2)
        .attr("y", histogramTooltipHeight / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("fill", "white")
        .style("font-size", "12px");
};

//handle histogram tooltip mouse event
const handleHistogramMouseEvent = () => {
    d3.selectAll("#histogram .histogram-bar")
        .on("mouseenter", (e, d) => {
            const tooltipText =
                d3.select(".histogram-tooltip-text");

            tooltipText.text("");

            // Energy range
            tooltipText
                .append("tspan")
                .attr("x", histogramTooltipWidth / 2)
                .attr("dy", "-0.6em")
                .text(`Energy: ${d.x0} - ${d.x1}`);

            // Frequency
            tooltipText
                .append("tspan")
                .attr("x", histogramTooltipWidth / 2)
                .attr("dy", "1.4em")
                .text(`Number of TVs: ${d.length}`);


            // Get bar position
            const barX = +e.currentTarget.getAttribute("x");
            const barY = +e.currentTarget.getAttribute("y");
            const barWidth = +e.currentTarget.getAttribute("width");

            // Position tooltip above centre of bar
            let tooltipX = barX + barWidth / 2 - histogramTooltipWidth / 2;
            let tooltipY = barY - histogramTooltipHeight - 10;

            // Prevent going outside left side
            if (tooltipX < 0) {
                tooltipX = 0;
            }

            // Prevent going outside right side
            if (
                tooltipX + histogramTooltipWidth > innerWidth
            ) {
                tooltipX = innerWidth - histogramTooltipWidth;
            }

            // Prevent going outside top
            if (tooltipY < 0) {
                tooltipY =
                    barY + 10;
            }

            // Show tooltip
            d3.select(".histogram-tooltip")
                .attr("transform", `translate(${tooltipX}, ${tooltipY})`)
                .transition()
                .duration(200)
                .style("opacity", 1);
        })

        .on("mouseleave", () => {
            d3.select(".histogram-tooltip")
                .transition()
                .duration(200)
                .style("opacity", 0);
        });
};

// ======= SCATTERPLOT ============ // 

// Scatterplot filter
const updateScatterplot = (filterId, data) => {

    // all data if "all"
    // otherwise filter by screen technology
    const updatedData = filterId === "all"
        ? data
        : data.filter(
            tv => tv.screenTech === filterId
        );

    // update scatterplot circles
    innerChartS
        .selectAll(".scatter-point")
        .data(updatedData)
        .join("circle")
        .attr("class", "scatter-point")
        .attr("r", 4)
        .attr("cx", d => xScaleS(d.star))
        .attr("cy", d => yScaleS(d.energyConsumption))
        .attr("fill", d => colorScale(d.screenTech))
        .attr("opacity", 0.5);

    // New circles need mouse events
    handleMouseEvent();

    // Keep tooltip above the circles
    d3.select(".scatter-tooltip")
        .raise();
};

//create scatterplot tooltip
const createTooltip = () => {
    const tooltip = innerChartS
        .append("g")
        .attr("class", "scatter-tooltip")
        .style("opacity", 0);

    //add tooltip rectangle
    tooltip
        .append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("rx", 3) //makes rectanlge corner rounded
        .attr("ry", 3)
        .attr("fill", barColor)
        .attr("opacity", 0.9);

    //add tooltip text
    tooltip
        .append("text")
        .attr("class", "scatter-tooltip-text")
        .attr("x", tooltipWidth / 2)
        .attr("y", tooltipHeight / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("fill", "white")
        .style("font-size", "12px");
};

//handle mouse event
const handleMouseEvent = () => {
    innerChartS
        .selectAll("scatter-point")//select all circles from scatterplot
        .on("mouseenter", (e, d) => {

            const tooltipText =
                d3.select(".scatter-tooltip-text");

            // remove old text
            tooltipText.text("");

            //brand
            tooltipText
                .append("tspan")
                .attr("x", tooltipWidth / 2)
                .attr("dy", "-1.2em")
                .text(`Brand: ${d.brand}`);
            //model
            tooltipText
                .append("tspan")
                .attr("x", tooltipWidth / 2)
                .attr("dy", "1.4em")
                .text(`Model: ${d.model}`);
            //screen size
            tooltipText
                .append("tspan")
                .attr("x", tooltipWidth / 2)
                .attr("dy", "1.4em")
                .text(`Screen Size: ${d.screenSize}"`);

            ////get circle position
            const circleX = +e.currentTarget.getAttribute("cx");
            const circleY = +e.currentTarget.getAttribute("cy");

            // default position:
            // right and above the circle
            let tooltipX = circleX + 10;
            let tooltipY = circleY - tooltipHeight - 10;

            // If the circle position + tooltip width greater than the chart width
            if (circleX + tooltipWidth + 10 > innerWidth) {
                tooltipX = circleX - tooltipWidth - 10; //move tooltip to the left of circle
            }

            //move tooltip near to circle
            d3.select(".scatter-tooltip")
                .attr("transform", `translate(${tooltipX},${tooltipY})`)
                //make visible with transition
                .transition()
                .duration(200)
                .style("opacity", 1);

            console.log("Mouse entered:", e);
            console.log("TV data:", d);
        })

        .on("mouseleave", () => {
            d3.select(".scatter-tooltip")
                .transition()
                .duration(200)
                .style("opacity", 0);

        })
}

const populateFilters = data => {
    //every item in filters_screen, create 1 button
    const buttons = d3.select("#filters_screen")
        .selectAll("button")
        .data(filters_screen)
        .join("button")
        .attr("class", d => `filter ${d.isActive ? "active" : ""}`)
        .text(d => d.label)
        .on("click", (e, d) => {
            console.log("Clicked filter:", e);
            console.log("Clicked filter data:", d);

            if (!d.isActive) {
                //when click "OLED", it check every filter and make the "OLED" true
                filters_screen.forEach(filter => {
                    filter.isActive = d.id === filter.id ? true : false;
                });
                //change active button appearance
                d3.selectAll("#filters_screen .filter")
                    .classed("active", filter => filter.id === d.id ? true : false);

                //filter histogram
                updateHistogram(d.id, data);
                //filter scatterplot
                updateScatterplot(d.id, data);
            }
        });

};