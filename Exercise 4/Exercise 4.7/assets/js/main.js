//create SVG canvas
const svg = d3.select(".responsive-svg-container")
    .append("svg")
    .attr("viewBox", "0 0 500 500")
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

    const xScale = d3.scaleLinear()
        .domain([0, 1100]) //data values go from 0 -> 1200 TVs
        .range([0, 300]); //convert those numbers to 0 -> 400 SVG units

    const yScale = d3.scaleBand()
        .domain(data.map(d => d.brand))
        .range([0, 500])
        .padding(0.1);

    //create one group for each brand
    const barAndLabel = svg
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(0, ${yScale(d.brand)})`);

    //add rectangle inside each group
    barAndLabel
        .append("rect")
        .attr("width", d => xScale(d.count)) //make width depends on d.count (d represent one row of data)
        .attr("height", yScale.bandwidth()) //bandwidth ask scaleBand how much vertical space available for each category
        .attr("fill", "blue")
        .attr("x", 100)
        .attr("y", 0);

    //add brand labels
    barAndLabel
        .append("text")
        .text(d => d.brand)
        .attr("x", 90)
        .attr("y", 15)
        .attr("text-anchor", "end")
        .style("font-size", "13px");

    //add count labels
    barAndLabel
        .append("text")
        .text(d => d.count)
        .attr("x", d => 100 + xScale(d.count) + 4)
        .attr("y", 12)
        .style("font-size", "13px");

};
