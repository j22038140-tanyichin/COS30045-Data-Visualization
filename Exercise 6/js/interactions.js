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

//create scatterplot tooltip
const createTooltip = () => {
    const tooltip = innerChartS
        .append("g")
        .attr("class", "tooltip")
        .style("opacity", 0);

    //add tooltip rectangle
    tooltip
        .append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("rx", 3) //makes rectanlge corner rounded
        .attr("ry", 3)
        .attr("fill", barColor)
        .attr("opacity", 0.75);

    //add tooltip text
    tooltip
        .append("text")
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
        .selectAll("circle")//select all circles from scatterplot
        .on("mouseenter", (e, d) => {

            d3.select(".tooltip text")
                .text(`Screen Size: ${d.screenSize}"`);

            ////get circle position
            const circleX = +e.currentTarget.getAttribute("cx");
            const circleY = +e.currentTarget.getAttribute("cy");

            // default position:
            // right and above the circle
            let tooltipX = circleX + 10;
            let tooltipY = circleY - tooltipHeight - 10;

            // if tooltip goes outside right edge,
            // place it on the left instead
            if (circleX + tooltipWidth + 10 > innerWidth) {
                tooltipX = circleX - tooltipWidth - 10;
            }

            //move tooltip near to circle
            d3.select(".tooltip")
                .attr("transform", `translate(${tooltipX},${tooltipY})`)
                //make visible with transition
                .transition()
                .duration(200)
                .style("opacity", 1);

            console.log("Mouse entered:", e);
            console.log("TV data:", d);
        })

        .on("mouseleave", () => {
            d3.select(".tooltip")
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

                updateHistogram(d.id, data);
            }
        });

};