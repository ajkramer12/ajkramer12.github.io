/*
 *** Load the next JSON file for lazy loading
 */
function getJsonFilename(direction){
    console.log(currentEra);
    switch(direction){
        case -1: if(currentEra <= 0){
            return eraTable[0].filename;
        } else {
            return eraTable[currentEra-1].filename;
        }
            break;
        case 0: return eraTable[currentEra].filename;
            break;
        case 1: if(currentEra >= eraTable.length-1){
            return eraTable[eraTable.length-1].filename;
        } else {
            return eraTable[currentEra+1].filename;
        }
            break;
        default: return eraTable[currentEra].filename;
    }
}




/*
 *** Increase the number of a nations Lat/Long nodes to a set value to avoid animation artifacts
 */
function homogenizeNodeCount(mapData){

    var homogenizedMapData = mapData;

    for(var region = 0; region < mapData.length; region++){
        var regionData;
        if(currentEra < 5){
            regionData = mapData[region].geometry.coordinates[0];
        } else {
            regionData = mapData[region].geometry.coordinates[0].reverse();
        }
        var currentRegionNodeNumber = regionData.length;
        var targetRegionNodeNumber = nationTable[mapData[region].id].nodes;
        var homogenizedRegionData = regionData;
        if(targetRegionNodeNumber > currentRegionNodeNumber){
            var startingNode = regionData = mapData[region].geometry.coordinates[0][0];
            for(var node = 0; node < targetRegionNodeNumber - currentRegionNodeNumber; node++){
                homogenizedRegionData.push(startingNode);
            }
            homogenizedMapData[region].geometry.coordinates[0] = homogenizedRegionData;
        }
    }

    return homogenizedMapData;
}




/*
 *** Add Labels to the nations on the map, adjusting font size according to the size of the nation
 */
function labelRegions(duration){

    // Data Join
    var currentLabels = primaryMap.selectAll(".regionLabel")
        .data(currentEraBoundaries);

    currentLabels
        .enter().append("text")
        .attr("class", "regionLabel");

    currentLabels
        .attr("id", function(d){ return "label" + d.id;})
        .text(function(d){ return nationTable[d.id].name; })
        .transition()
        .duration(duration)
        .attr("transform", function(d) {
            var textWidth = d3.select("#label"+ d.id)[0][0].clientWidth;
            return "translate(" + (path.centroid(d)[0]-textWidth/2) + "," + path.centroid(d)[1] + ")";
        })
        .attr("font-size", function(d){
            var regionArea = path.area(d);
            var fontSize = Math.floor(Math.log(regionArea))*2;
            if(path.area(d) > 0 && fontSize >= (fontThreshold)){
                return (Math.floor(Math.log(regionArea))*2) + "px";
            } else {
                return "0";
            }
        });

    currentLabels.exit().remove();
}




/*
 *** Move the nation map as the Google map is moved
 */
function updateMap(duration){
    primaryMap.selectAll("path")
        .transition()
        .duration(duration)
        .attr("d", path);
    labelRegions(duration);
    updateCities(duration);
}



/*
 *** Add Cities to the map, adjusting size according to the size of the city
 */
function updateCities(duration){

    primaryMap.selectAll(".city")
        .transition()
        .duration(duration)
        .attr("cx", function(d) { return projection(cityTable[d.id].location.split(",").reverse())[0]; })
        .attr("cy", function(d) { return projection(cityTable[d.id].location.split(",").reverse())[1]; })
        .attr("r", function(d){
            console.log("City: " + d["e"+currentEra]);
            if(d["e"+currentEra] > 0){
                return calculateCityRadius(cityTable[d.id]["e"+currentEra]) + "px";
            } else {
                return "0";
            }
        });

    labelCities(duration);
}

function calculateCityRadius(population){
    var zoomMod = (1+currentZoom)/3;
    if(population <= 1875){
        return 1 * zoomMod;
    } else if (population <= 3750){
        return 2 * zoomMod;
    } else if (population <= 7500){
        return 3 * zoomMod;
    } else if (population <= 15000){
        return 4 * zoomMod;
    } else if (population <= 30000){
        return 5 * zoomMod;
    } else if (population <= 60000){
        return 6 * zoomMod;
    } else if (population <= 90000){
        return 6.5 * zoomMod;
    } else if (population <= 125000){
        return 7 * zoomMod;
    } else if (population <= 250000){
        return 8 * zoomMod;
    } else if (population <= 500000){
        return 9 * zoomMod;
    } else if (population <= 1000000){
        return 10 * zoomMod;
    } else {
        return 11 * zoomMod;
    }
}


/*
 *** Add Labels to the nations on the map, adjusting font size according to the size of the nation
 */
function labelCities(duration){

    // Data Join
    var currentLabels = primaryMap.selectAll(".cityLabel")
        .data(cityTable);

    currentLabels
        .enter().append("text")
        .attr("class", "cityLabel");
    currentLabels
        .attr("id", function(d){ return "cityLabel" + d.id;})
        .text(function(d){ return cityTable[d.id].name; })
        .transition()
        .duration(duration)
        .attr("transform", function(d) {
            var circleRadius = d3.select("#city"+ d.id)[0][0].r.baseVal.value;
            var textWidth = d3.select("#cityLabel"+ d.id)[0][0].clientWidth;
            return "translate(" + projection(cityTable[d.id].location.split(",").reverse())[0] + "," + (projection(cityTable[d.id].location.split(",").reverse())[1]-circleRadius) + ")";
        })
        .attr("font-size", function(d){
            var circleRadius = d3.select("#city"+ d.id)[0][0].r.baseVal.value;
            var fontSize = circleRadius*2;
            if(fontSize >= (fontThreshold/(1+currentZoom*3))){
                return fontSize + "px";
            } else {
                return "0";
            }
        });

    currentLabels.exit().remove();
}