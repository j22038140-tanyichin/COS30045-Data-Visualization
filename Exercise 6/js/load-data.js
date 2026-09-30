// js/load-data.js
d3.csv("data/Ex6_TVdata_withStar.csv", d => {
    return {
        brand: d.brand,
        model: d.model,
        screenSize: +d.screenSize, //convert to number
        screenTech: d.screenTech.toLowerCase(),
        energyConsumption: +d.energyConsumption //convert to number
    };
}).then(data => {
    console.log(data);
    drawHistogram(data);
    populateFilters(data);
});