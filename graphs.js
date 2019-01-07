var statName = {
    "position": "Position",
    "points": "Points",
    "goalsScored": "Goals Scored",
    "goalsConceded": "Goals Conceded",
    "goalDifference": "Goal Difference",
    "wins": "Games Won",
    "losses": "Games Lost",
    "draws": "Games Drawn",
}
var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 0.7 * window.innerWidth - margin.left - margin.right,
    height =  0.8 * window.innerHeight - margin.top - margin.bottom;
var n = 26
var xScale, yScale;
var start_year =1994, end_year=2018;

function renderScale() {
    var maxY = -100;
    var minY = 100;
    var st = Array.from(selectedTeams);
    for (var i = 0; i < st.length; i++) {
        for (var s = 0; s < seasons.length; s++) {
            if (data[seasons[s]][st[i]][statSelect.value] < minY && data[seasons[s]][st[i]]["points"] != 0) {
                minY = data[seasons[s]][st[i]][statSelect.value];
            } else if (data[seasons[s]][st[i]][statSelect.value] > maxY && data[seasons[s]][st[i]]["points"] != 0) {
                maxY = data[seasons[s]][st[i]][statSelect.value];
            }
        }
    }

    if(statSelect.value != "position") {
        yScale = d3.scaleLinear()
            .domain([minY - 5, maxY + 5]) // input
            .range([height, 0]); // output
    } else {
        yScale = d3.scaleLinear()
            .domain([23, 0]) // input
            .range([height, 0]); // output
    }
    xScale = d3.scaleLinear()
        .domain([start_year-1, end_year+2]) // input
        .range([0, width]); // output


}

var svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("align", "left")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function drawGraph(dataset, data) {
    console.log(xScale)
    margin = {top: 50, right: 50, bottom: 50+Math.floor(Array.from(selectedTeams).length/8)*20, left: 50};
    console.log(margin)
    renderScale();
    var n = Object.keys(data).length;
    d3.select("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom

// 4. Call the y axis in a group tag
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    var tempData = Array.from(selectedTeams);
    var legend = svg.selectAll(".legend")
        .data(tempData)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(" + i%8*120 + ","+ Math.floor(i/8) * 20 +")";
        });

    legend.append("rect")
        .attr("y", height + 25)
        .attr("width", 20)
        .attr("height", 4)
        .style("fill", function(d) {
            return COLORS[d];
        });

    legend.append("text")
        .attr("y", height + 25)
        .attr("x", function(d) {
            return margin.top+ 20+d.length*3.5;
        })
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {
            return d;
        });
}

function drawLine(dataset, data, team, stat) {
    var g = svg.append("g").attr("id", team.replace(/\s+/g, '')).attr("style", "stroke: " + COLORS[team] + "; fill: " + COLORS[team] + ";");
    var line = d3.line()
        .defined(function(d, i) { return d.y!= null && i+1994 >= start_year && i+1994 <= end_year;})
        .x(function (d, i) {
            return xScale(i+1994);
        }) // set the x values for the line generator
        .y(function (d) {
            return yScale(d.y);
        }) // set the y values for the line generator
        .curve(d3.curveMonotoneX) // apply smoothing to the line

// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
    var temp = Array.from(distinct_seasons(dataset));
    var dataset = temp.map(function (k) {
        if (data[k][team]["points"] != 0)
            return {"y": data[k][team][stat], "team": team, "season": k}
        else
            return {"y": null, "team": team, "season": k};
    })
    g.append("path")
        .datum(dataset) // 10. Binds data to the line
        .attr("style", "stroke: " + COLORS[team] + ";")
        .attr("class", "line") // Assign a class for styling
        .attr("d", line) // 11. Calls the line generator


// 12. Appends a circle for each datapoint
    g.selectAll(".dot")
        .data(dataset)
        .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("style", "fill: " + COLORS[team] + ";")
        .attr("cx", function (d, i) {
            return xScale(i+1994)
        })
        .attr("cy", function (d) {
            return yScale(d.y)
        })
        .attr("r", 5)
        .attr("display", function(d,i) {

            return d.y == null || i+1994 < start_year || i+1994 > end_year ? "none": "inline";
        })
        .on("mouseover", function (a, b, c) {
            c[b].classList.remove('dot')
            c[b].classList.add('focus')
            tip.show(a)
            console.log(a)
        })
        .on("mouseout", function (a, b, c) {
            tip.hide(a)
            c[b].classList.add('dot')
            c[b].classList.remove('focus')
        })
}

function removeLine(team) {
    console.log(team);
    d3.select("#" + team.replace(/\s+/g, '')).remove();
}

function clearGraph() {
    svg.selectAll("*").remove();
}

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) {
        return "<strong>Season: </strong><span class='details'>" + d.season + "<br></span>"
            + "<strong>Club: </strong><span class='details'>" + d.team + "<br></span>"
            + "<strong>" + statName[statSelect.value] + ": </strong><span class='details'>" + d.y + "</span>";
    })

svg.call(tip);