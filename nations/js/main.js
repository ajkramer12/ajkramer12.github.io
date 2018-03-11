/***
**** Primary Map
****/
// Declare Map Data Variables
var nationTable;
var eraTable;
var eventTable;
var characterTable;
var currentEra = 0;

// Declare Map Path Variables
var world;
var previousEraBoundaries;
var presentEraBoundaries;
var nextEraBoundaries;

var currentEraBoundaries;

// Set Primary Attributes
var primaryMapWidth = d3.select("#primaryMapColumn").style("width").slice(0, -2);
var primaryMapHeight = d3.select("#primaryMapColumn").style("height").slice(0, -2);
var latitude = primaryMapHeight / 2;
var longitude = primaryMapWidth / 2;

var currentZoom = 0;
var zoomConversionD3 = 163;
var zoomConversionGoogle = 2;
var fontThreshold = 15;

var eraChangeDuration = 5000;


// Declare Stat Variables
var eraDateSpan = d3.select("#eraDate");
var largestRegions = [{name: "test", size: 0},{name: "test", size: 0},{name: "test", size: 0},{name: "test", size: 0},{name: "test", size: 0}];


// Declare/Initialize map variables
var primaryMap = d3.select("#primaryMap")
                .attr("width", primaryMapWidth)
                .attr("height", primaryMapHeight)
                .append("g");
var googleMap;


// Declare Audio
var backgroundMusic;
var nextEraAudio;
var eventBattleAudio;
var eventConquerAudio;




/* Constructor Calls & Functions */

// D3

// Set projection path
var projection = d3.geo.mercator()
//var projection = d3.geo.equirectangular()
    //.translate([primaryMapWidth / 2, primaryMapHeight / 1.43])
    .center([0, 30])
    .translate([longitude, latitude])
    .scale(Math.pow(2, currentZoom) * zoomConversionD3);

// Create the map object
var path = d3.geo.path()
    .projection(projection);

// Load map data
queue()
    .defer(d3.tsv, "data/nationTable.tsv")
    .defer(d3.tsv, "data/eraTable.tsv")
    .defer(d3.tsv, "data/eventTable.tsv")
    .defer(d3.tsv, "data/characterTable.tsv")
    .await(loadInitialMapData);


// Google
google.maps.event.addDomListener(window, 'load', initializeGoogleMap);






var panUpTriggerTimeout;
var panRightTriggerTimeout;
var panDownTriggerTimeout;
var panLeftTriggerTimeout;

var panUpTrigger = d3.select("#panUpTrigger")
    .on("mouseover", function(){panUpTrigger.style("opacity", "0.5"); panUpTriggerTimeout = setInterval(function(){travel(0);}, 100);})
    .on("mouseout", function(){panUpTrigger.style("opacity", "0.2"); clearTimeout(panUpTriggerTimeout);});
var panRightTrigger = d3.select("#panRightTrigger")
    .on("mouseover", function(){panRightTrigger.style("opacity", "0.5"); panRightTriggerTimeout = setInterval(function(){travel(1);}, 100);})
    .on("mouseout", function(){panRightTrigger.style("opacity", "0.2"); clearTimeout(panRightTriggerTimeout);});
var panDownTrigger = d3.select("#panDownTrigger")
    .on("mouseover", function(){panDownTrigger.style("opacity", "0.5"); panDownTriggerTimeout = setInterval(function(){travel(2);}, 100);})
    .on("mouseout", function(){panDownTrigger.style("opacity", "0.2"); clearTimeout(panDownTriggerTimeout);});
var panLeftTrigger = d3.select("#panLeftTrigger")
    .on("mouseover", function(){panLeftTrigger.style("opacity", "0.5"); panLeftTriggerTimeout = setInterval(function(){travel(3);}, 100);})
    .on("mouseout", function(){panLeftTrigger.style("opacity", "0.2"); clearTimeout(panLeftTriggerTimeout);});



var primaryMapPanOrigin = [];
// Create the pan behavior for the main map
var primaryMapDrag = d3.behavior.drag()
    .on("dragstart", setPrimaryMapPanOrigin)
    .on("drag", primaryMapPan);


/* User Triggers & Functions */
var zoomLock = false;
var zoomInterval = 200;
var baseTravelSpeed = 5;
var travelSpeed = baseTravelSpeed;

d3.select("body").on("wheel.zoom", function(){
    if(!zoomLock) {
        zoomLock = true;
        var zoomDelta = d3.event.wheelDeltaY;
        zoom(zoomDelta);
        setTimeout(function(){zoomLock = false;}, zoomInterval * 3);
    }
});






/***
 **** Mini Map
 ****/

// Set Primary Attributes
var miniWidth = d3.select("#miniMapColumn").style("width").slice(0, -2);
var miniHeight = d3.select("#miniMapColumn").style("height").slice(0, -2);
var miniMapCenterY = miniHeight / 2;
var miniMapCenterX = miniWidth / 2;
var miniMapSizeConversion;
var viewBox;


// Initialize map variable
var miniMap = d3.select("#miniMap")
    .attr("width", miniWidth)
    .attr("height", miniHeight)
    .append("g");


// Set projection path
var miniProjection = d3.geo.mercator()
    .center([30, 0])
    .translate([miniMapCenterX, miniMapCenterY])
    .scale(33);

// Create the map object
var miniMapBase = d3.geo.path()
    .projection(miniProjection);

// Create the drag behavior for the view box
var viewBoxDrag = d3.behavior.drag()
    .on("drag", viewBoxDragBehavior)
    .on("dragend", viewBoxDragRelease);

// Load map data
queue()
    .defer(d3.json, "data/world-110m.json")
    .await(initializeMiniMap);






/*
 ** Stats Box
 **/

d3.select("#statsBox")
    .append("img")
    .attr("id", "nextArrow")
    .attr("src", "img/nextArrow.png") // http://cdn.mysitemyway.com/etc-mysitemyway/icons/legacy-previews/icons/antique-glowing-copper-orbs-icons-media/001362-antique-glowing-copper-orb-icon-media-a-media22-arrow-forward1.png
    .style("position", "absolute")
    .style("top", "10px")
    .style("right", "10px")
    .style("height", "25%");
d3.select("#statsBox")
    .append("img")
    .attr("id", "backArrow")
    .attr("src", "img/backArrow.png") // http://cdn.mysitemyway.com/etc-mysitemyway/icons/legacy-previews/icons/antique-glowing-copper-orbs-icons-media/001362-antique-glowing-copper-orb-icon-media-a-media22-arrow-forward1.png
    .style("position", "absolute")
    .style("top", "10px")
    .style("right", "50px")
    .style("height", "25%");






/***
 **** Summary Boxes
 ****/

/*
 ** Era Summary Box
 **/
var eraSummaryBoxOpen = false;
var eraSummaryBoxWidth = d3.select("#primaryCommand").style("width").slice(0, -2) * 0.95;
var eraSummaryBoxOffset = parseInt(d3.select("#miniMapColumn").style("width").slice(0, -2)) + (eraSummaryBoxWidth * 0.025);


// Initialize Era Summary Box
var eraSummaryBox = d3.select("#eraSummaryBox")
    .style("width", eraSummaryBoxWidth + "px")
    .style("height", "15vh")
    .style("top", primaryMapHeight + "px")
    .style("left", eraSummaryBoxOffset + "px");

var eraSummaryBoxHeight = eraSummaryBox.style("height").slice(0, -2);

var eraSummary = d3.select("#eraSummary")
    .style("width", (eraSummaryBoxWidth - 30) + "px")
    .style("height", (eraSummaryBoxHeight - 20) + "px")
    .style("top", primaryMapHeight + "px")
    .style("left", eraSummaryBoxOffset + "px");

var eraSummaryBoxToggle = d3.select("#eraSummaryBoxToggle")
    .style("left", eraSummaryBoxWidth/2-(d3.select("#eraSummaryBoxToggle").style("width").slice(0, -2)/2) + "px")
    .on("click", toggleEraSummaryBox);




/*
 ** Character Summary Boxes
 **/
var characterSummaryBoxOpen = false;
var characterSummaryBoxHeight = primaryMapHeight * 0.95;
var characterSummaryBoxOffset = primaryMapHeight * 0.025;


// Initialize Character Summary Box & Container
var characterSummaryBox = d3.select("#characterSummaryBox")
    .style("width", "10vw")
    .style("height", characterSummaryBoxHeight + "px")
    .style("top", characterSummaryBoxOffset + "px")
    .style("left", primaryMapWidth-5 + "px");

var characterSummaryBoxWidth = characterSummaryBox.style("width").slice(0, -2);

var characterSummaryContainer = d3.select("#characterSummaryContainer")
    .style("width", "10vw")
    .style("height", (characterSummaryBoxHeight - d3.select("#characterSummaryBoxToggle").style("height").slice(0, -2) - 10) + "px")
    .style("top", characterSummaryBoxOffset + "px")
    .style("left", primaryMapWidth-5 + "px");

var characterSummaryBoxToggle = d3.select("#characterSummaryBoxToggle")
    .style("top", characterSummaryBoxHeight/2-(d3.select("#characterSummaryBoxToggle").style("height").slice(0, -2)/2) + "px")
    .on("click", toggleCharacterSummaryBox);






/***
 **** Dynamic Era Information
 ****/
d3.select("#nextArrow")
    .on("click", function(){updateEra(currentEra, currentEra+1);});
d3.select("#backArrow")
    .on("click", function(){updateEra(currentEra, currentEra-1);});




d3.select("#detailsWindowCloseButton").on("click", function(){
    $('#detailsModal').modal('hide');
    var closedElementId = d3.select("#detailsWindowCloseButton").attr("eventId");
    if(closedElementId.slice(0, 5) == "event") {
        d3.select("#" + closedElementId).remove();
        var shiftedEvents = 0;
        d3.selectAll(".eventNotification")[0].forEach(function (event) {
            if (+event.id.slice(5) > +closedElementId.slice(5)) {
                shiftedEvents++;
                var eventSelect = d3.select("#" + event.id);
                eventSelect
                    .transition()
                    .delay(100 * shiftedEvents)
                    .duration(eraChangeDuration / 15)
                    .ease("linear")
                    .style("top", function () {
                        return (Math.floor(eventSelect.style("top").slice(0, -2)) + Math.floor(eventSelect.style("height").slice(0, -2))) + "px";
                    });
            }
        });
    }
});