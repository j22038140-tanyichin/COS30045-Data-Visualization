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