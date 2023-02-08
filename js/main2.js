mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 3, // starting zoom
    minZoom: 4, // minimum zoom level of the map
    center: [-100, 40] // starting center
});
const grades = [100, 1000, 5000, 10000, 50000, 75000],
    colors = ['rgb(233, 242, 237)', 'rgb(178, 235, 203)', 'rgb(89, 240, 155)',
              'rgb(6, 138, 63)', 'rgb(2, 48, 22)', 'rgb(1, 18, 8)'],
    radii = [2, 4, 8, 12, 16, 20];
//load data to the map as new layers.
//map.on('load', function loadingData() {
map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function
    // when loading a geojson, there are two steps
    // add a source of the data and then add the layer out of the source
    map.addSource('Counts', {
        type: 'geojson',
        data: 'assets/us-covid-2020-counts.json'
    });
    map.addLayer({
        'id': 'Counts-point',
        'type': 'circle',
        'source': 'Counts',
        'minzoom': 3,
        'paint': {
            // increase the radii of the circle as mag value increases
            'circle-radius': {
                'property': 'cases',
                'stops': [
                    [grades[0], radii[0]],
                    [grades[1], radii[1]],
                    [grades[2], radii[2]],
                    [grades[3], radii[3]],
                    [grades[4], radii[4]],
                    [grades[5], radii[5]]
                ]
            },
            // change the color of the circle as mag value increases
            'circle-color': {
                'property': 'cases',
                'stops': [
                    [grades[0], colors[0]],
                    [grades[1], colors[1]],
                    [grades[2], colors[2]],
                    [grades[3], colors[3]],
                    [grades[4], colors[4]],
                    [grades[5], colors[5]],
                ]
            },
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': 0.6
        }
    });
    // click on tree to view magnitude in a popup
    map.on('click', 'Counts-point', (event) => {
        new mapboxgl.Popup()
            .setLngLat(event.features[0].geometry.coordinates)
            .setHTML(`<strong>County:</strong> ${event.features[0].properties.county}<br><strong>Number of Cases:</strong>${event.features[0].properties.cases}`)
            .addTo(map);
    });
});
// create legend
const legend = document.getElementById('legend');
//set up legend grades and labels
var labels = ['<strong>Color and Number of Cases</strong>', vbreak],
    vbreak;
//iterate through grades and create a scaled circle and label for each
for (var i = 0; i < grades.length; i++) {
    vbreak = grades[i];
    // you need to manually adjust the radius of each dot on the legend 
    // in order to make sure the legend can be properly referred to the dot on the map.
    dot_radii = 2 * radii[i];
    labels.push(
        '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
        'px; height: ' +
        dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
        '</span></p>');
}
// add the data source
const source1 =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">COVID-19 case/death data</a></p>';
const source2 =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://data.census.gov/table?g=0100000US$050000&d=ACS+5-Year+Estimates+Data+Profiles&tid=ACSDP5Y2018.DP05&hidePreview=true">The population data</a></p>';
const source3 =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html">The U.S. county boundary shapefile</a></p>';
// combine all the html codes.
legend.innerHTML = labels.join('') + source1 +source2 + source3;
