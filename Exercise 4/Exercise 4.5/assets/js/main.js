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


// --- function to build the chart ---//
// create an svg object that selects the elements 
// we want (rectangles) to add to represent our data 
const drawBarChart = data => {

    const barHeight = 20;
    const barSpacing = 5;

    svg
        .selectAll("rect")
        .data(data) //pass data into selection
        .join("rect") //join it to selected elements (rectangles)
        .attr("class", d => { //assign attribute to bar rectangles
            console.log(d);
            return `bar bar-${d.count}`; //associate with the count data
        })
        .attr("width", d => d.count) //make width depends on d.count (d represent one row of data)
        .attr("height", barHeight)
        .attr("fill", "blue")
        .attr("x", 0)
        .attr("y", (d, i) => i * (barHeight + barSpacing)) //i = the row number/index
};
