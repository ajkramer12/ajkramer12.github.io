/*
 *** Load the next JSON file for lazy loading
 */
function getJsonFilename(direction){
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
function homogenizeNodeCount(mapData, direction){

    var homogenizedMapData = mapData;

    homogenizedMapData = homogenizedMapData.sort(
        function(a,b){
            return path.area(b) - path.area(a);
        }
    );


    for(var region = 0; region < mapData.length; region++){
        var regionData;
        if((currentEra < 5 && direction >= 0) || (currentEra < 6 && direction < 0)){
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
        .attr("class", "regionLabel")
        .on("click", function(d){updateRegionStats(d);});

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
    labelCities(duration);
}



/*
 *** Calulate the current era's largest nations
 *** Called by initialize map and update era
 */

function calculateRegionAreas(){
    for(var i = 0; i < 5; i++){
        largestRegions[i].size = 0;
    }

    currentEraBoundaries.forEach(function(d){
        var regionSize = path.area(d);
        if(regionSize > largestRegions[0].size && nationTable[d.id].nation == 1){

            largestRegions[4].name = largestRegions[3].name;
            largestRegions[4].size = largestRegions[3].size;

            largestRegions[3].name = largestRegions[2].name;
            largestRegions[3].size = largestRegions[2].size;

            largestRegions[2].name = largestRegions[1].name;
            largestRegions[2].size = largestRegions[1].size;

            largestRegions[1].name = largestRegions[0].name;
            largestRegions[1].size = largestRegions[0].size;

            largestRegions[0].name = nationTable[d.id].name;
            largestRegions[0].size = regionSize;

        } else if(regionSize > largestRegions[1].size && nationTable[d.id].nation == 1){
            largestRegions[4].name = largestRegions[3].name;
            largestRegions[4].size = largestRegions[3].size;

            largestRegions[3].name = largestRegions[2].name;
            largestRegions[3].size = largestRegions[2].size;

            largestRegions[2].name = largestRegions[1].name;
            largestRegions[2].size = largestRegions[1].size;

            largestRegions[1].name = nationTable[d.id].name;
            largestRegions[1].size = regionSize;

        } else if(regionSize > largestRegions[2].size && nationTable[d.id].nation == 1){
            largestRegions[4].name = largestRegions[3].name;
            largestRegions[4].size = largestRegions[3].size;

            largestRegions[3].name = largestRegions[2].name;
            largestRegions[3].size = largestRegions[2].size;

            largestRegions[2].name = nationTable[d.id].name;
            largestRegions[2].size = regionSize;

        } else if(regionSize > largestRegions[3].size && nationTable[d.id].nation == 1){
            largestRegions[4].name = largestRegions[3].name;
            largestRegions[4].size = largestRegions[3].size;

            largestRegions[3].name = nationTable[d.id].name;
            largestRegions[3].size = regionSize;

        } else if(regionSize > largestRegions[4].size && nationTable[d.id].nation == 1){
            largestRegions[4].name = nationTable[d.id].name;
            largestRegions[4].size = regionSize;
        }

        for(i = 0; i < 5; i++){
            d3.select("#nationSize" + i).text(largestRegions[i].name);
        }
    });
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
            if(d["e"+currentEra] > 0){
                return calculateCityRadius(cityTable[d.id]["e"+currentEra]) + "px";
            } else {
                return "0";
            }
        });
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
            var circleRadius = calculateCityRadius(cityTable[d.id]["e"+currentEra]); //d3.select("#city"+ d.id)[0][0].r.baseVal.value;
            //var textWidth = d3.select("#cityLabel"+ d.id)[0][0].clientWidth;
            return "translate(" + projection(cityTable[d.id].location.split(",").reverse())[0] + "," + (projection(cityTable[d.id].location.split(",").reverse())[1]-circleRadius) + ")";
        })
        .attr("font-size", function(d){
            var circleRadius = calculateCityRadius(cityTable[d.id]["e"+currentEra]); //d3.select("#city"+ d.id)[0][0].r.baseVal.value;
            var fontSize = circleRadius*2;
            if(fontSize >= (fontThreshold/(1+currentZoom*3))){
                return fontSize + "px";
            } else {
                return "0";
            }
        });

    currentLabels.exit().remove();
}