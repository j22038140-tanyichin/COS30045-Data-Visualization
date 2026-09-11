//create SVG canvas
const svg = d3.select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", "0 0 1200 1600")
    .style("border", "1px solid black");


//+d.count is used to read the count attribute column in as a number.
d3.csv("assets/data/2026TVData.csv", d => {
    return {
        brand: d.brand,
        count: +d.count //+ convert '44' to 44 (convert to number)
    };
})
    .then(data => {
        console.log(data);//show entire dataset
        console.log(data.length); //show how many rows loaded
        console.log(d3.max(data, d => d.count)); //find the largest count
        console.log(d3.min(data, d => d.count)); //find the smallest count
        console.log(d3.extent(data, d => d.count)); //return both [min,max]
        data.sort((a, b) => b.count - a.count); //sort data from largest to smallest "b.count - a.count" = "largest -> smallest"
        drawBarChart(data);
    });