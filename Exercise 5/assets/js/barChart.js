//CREATING BAR CHART
const drawBarChart = data => {
    const width = 700;
    const height = 450;

    const margin = {
        top: 50, right: 30, bottom: 80, left: 90
    };

    //calculate area available for the bars
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("border", "1px solid black");

    const innerChart = svg
        .append("g")
        .attr(
            "transform",
            `translate(${margin.left}, ${margin.top})` //move charts to (90,50)
        );

    //X scale - screen tech
    const xScale = d3.scaleBand() //screen tech is categories, so use "scaleBand"
        .domain(data.map(d => d.screenType))
        .range([0, innerWidth])
        .padding(0.2);

    //Y scale - energy consumption
    const yScale = d3.scaleLinear() //energy consuption is numerical, so use "scaleLinear"
        .domain([0, d3.max(data, d => d.energy)])
        .range([innerHeight, 0])
        .nice(); //rounds number, for exp highest value is 369, it round the y axis number to 400

    //X axis
    const bottomAxis = d3.axisBottom(xScale);
    innerChart
        .append("g")
        .attr(
            "transform",
            `translate(0, ${innerHeight})`
        )
        .call(bottomAxis);

    //Add X-axis label
    innerChart
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -60)
        .attr("text-anchor", "middle")
        .text("Energy Consumption (kWh/year)");

    //Y axis
    const leftAxis = d3.axisLeft(yScale);
    innerChart
        .append("g")
        .call(leftAxis);

    //Add Y-axis label
    innerChart
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -60)
        .attr("text-anchor", "middle")
        .text("Energy Consumption (kWh/year)");

    //drawing the bars
    innerChart
        .selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.screenType))
        .attr("y", d => yScale(d.energy))
        .attr("width", xScale.bandwidth())
        .attr("height", d => innerHeight - yScale(d.energy));

    //adding values on top
    innerChart
        .selectAll(".bar-value")
        .data(data)
        .join("text")
        .attr("class", "bar-value")
        .attr(
            "x",
            d => xScale(d.screenType)
                + xScale.bandwidth() / 2
        )
        .attr(
            "y",
            d => yScale(d.energy) - 8
        )
        .attr("text-anchor", "middle")
        .text(d => d.energy.toFixed(1));
    //toFixed round the values to 1 decimal point 
    //exp: 369.375215 --> 369.4
};

//LOAD THE DATA
d3.csv("assets/data/Data_exercise5.1-1.csv", d => {
    return {
        screenType: d.Screen_Tech.toUpperCase(),
        energy: +d["Mean(Labelled energy consumption (kWh/year))"] //change it to actual number using +d
    };

})
    .then(data => {
        //sort from highest to lowest
        data.sort((a, b) => b.energy - a.energy);
        console.log(data);
        drawBarChart(data);
    });
