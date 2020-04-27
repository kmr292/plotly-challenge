// DEMOGRAPHIC INFO BOX
function createDemoInfo(chosenId) {
d3.json("./samples.json").then((importedData) => {
     console.log(importedData);
    // var data = importedData;
    var metadata = importedData.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == chosenId);
    var result = resultArray[0];
    var infoBox = d3.select('#sample-metadata');
    infoBox.html("");
    Object.entries(result).forEach(([key, value]) => {
        infoBox.append("h6").text(`${key.toUpperCase()}:
        ${value}`);
    });
});
}

    function createCharts(chosenId) {
        d3.json("./samples.json").then((importedData) => {
            var samples = importedData.samples;
            var resultArray = samples.filter(sampleObj => sampleObj.id == chosenId);
            var result = resultArray[0];
            console.log(result);
            var otu_ids = result.otu_ids;
            var otu_labels = result.otu_labels;
            var sample_values = result.sample_values;

            var metadata = importedData.metadata;
            var mresultArray = metadata.filter(sampleObj => sampleObj.id == chosenId);
            var m_result = mresultArray[0];

// BAR CHART
    var chartLabels = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();   
         var barTrace = {
                x: sample_values.slice(0,10).reverse(),
                y: chartLabels,
                text: otu_labels.slice(0,10).reverse(),
                type: "bar",
                orientation: "h"
             };
             var barData = [barTrace];
            
             var barLayout = {
                height: 600,
                width: 600
             };
            
             Plotly.newPlot("bar", barData, barLayout);

// GAUGE CHART
var gaugeTrace = [
	{
		domain: { x: [0, 1], y: [0, 1] },
		value: parseFloat(m_result.wfreq),
		title: { text: "<b>Belly Button Washing Frequency</b><br> Scrubs per Week" },
		type: "indicator",
        mode: "gauge+number",
        gauge: {
            steps: [
                {range: [0,1], color: "#F0F0DE"},
                {range: [1,2], color: "#EAE9D5"},
                {range: [2,3], color: "#DFDEC3"},
                {range: [3,4], color: "#E9E7AB"},
                {range: [4,5], color: "#D7F395"},
                {range: [5,6], color: "#AEC579"},
                {range: [6,7], color: "#95CF8F"},
                {range: [7,8], color: "#80BC79"},
                {range: [8,9], color: "#6AA763"},
              ],
            axis: {range: [0, 9], 
                tickvals: [0,1,2,3,4,5,6,7,8,9]},
                tickwidth: 1,
             bar: {color: "darkred"},
        }
    }
];

var Glayout = { width: 600, height: 500, margin: { t: 0, b: 0, l:100, r:100 } };

Plotly.newPlot('gauge', gaugeTrace, Glayout);

// BUBBLE CHART
    var BB_trace = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: "Earth"
        }
    };

    var data_BB = [BB_trace];

    var bb_layout = {
        xaxis: { title: "OTU ID" },
        height: 600,
        width: 1200
    };

    Plotly.newPlot("bubble", data_BB, bb_layout);
});
}

// UPDATING DROPDOWN MENU
    function init() {
        var selector = d3.select("#selDataset");

        d3.json("./samples.json").then((importedData) => {
            var sample_names = importedData.names;

            sample_names.forEach((chosenId) => {
                selector
                    .append("option")
                    .text(chosenId)
                    .property("value", chosenId);
            });

        var initialSample = sample_names[0];
        createCharts(initialSample);
        createDemoInfo(initialSample);
        });
    }

    function optionChanged(newSample) {
        createCharts(newSample);
        createDemoInfo(newSample);
    }

    init();

