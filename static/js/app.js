//=================================================================================
// DATASET FRAMEWORK & UNPACK
//=================================================================================

var dataset = [];
const unpack = (data, key) => {
    return data.map(obj => obj[key]);
};

//=================================================================================
// EVENT: INPUT CHANGE
//=================================================================================
const optionChanged = value => {
    var sample = dataset.samples[value];
    var sampleValues = sample.sample_values.slice(0,10);
    var otuIds = sample.otu_ids.slice(0,10);
    var otuLabels = sample.otu_labels.slice(0,10);
    var id = sample.id;
    graphBar(sampleValues, otuIds, otuLabels, id);
    graphBubble(otuIds, sampleValues, otuLabels, id);
    updateDemographic(dataset.metadata[value]);
    graphGauge(dataset.metadata[value].wfreq);
};

//=================================================================================
// ACTION: UPDATE DEMOGRAPHIC FUNCTION
//=================================================================================
const updateDemographic = obj => {
    d3.select("#sample-metadata").html("");
    var demCont = d3
        .select("#sample-metadata")
        .append("ul")
        .style("list-style-type", "none")
        .style("padding-left", "0");
    Object.entries(obj).forEach(([key, value]) => {
        demCont.append("li").text(`${key}: ${value}`);
    });
};

//=================================================================================
// ACTION: CREATE BAR GRAPH FRAMEWORK
//=================================================================================
const graphBar = (x,y,labels,name) => {
    var trace1 = {
        x: x,
        y: y.map(d => "OTU " + d),
        type: "bar",
        width: y.length * 0.08,
        orientation: "h",
        text: labels
    };
    var data = [trace1];
    var layout = {
    title: `Bar Chart: Top 10 OTUs found in sample ${name}`
    };
    Plotly.newPlot("bar", data, layout);
};

//=================================================================================
// ACTION: CREATE BUBBLE GRAPH FRAMEWORK
//=================================================================================
const graphBubble = (x,y,labels,name) => {
    var trace1 = {
        x: x,
        y: y,
        mode: "markers",
        marker: {
            color: x,
            size: y
        },
        text: labels
    };
    var data = [trace1];
    var layout = {
        title: `Bubble Chart: Top 10 OTUs found in sample ${name}`,
        xaxis: {title: "OTU ID"}
    };
    Plotly.newPlot("bubble", data, layout);
};

//=================================================================================
// ACTION: RETRIVE DATA
//=================================================================================
d3.json("samples.json").then(data => {
    console.log(data);
    dataset = data;
    var select = d3.select("#selDataset");
    data.samples.forEach((sample, i) => {
        select
            .append("option")
            .attr("value", i)
            .text(sample.id);
    });
    optionChanged(0);
});