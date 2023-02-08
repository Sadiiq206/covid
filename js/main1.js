mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 4, // starting zoom
    minZoom: 3, // minimum zoom level of the map
    center: [-100, 40] // starting center
});

map.on('load', () => {
    map.addSource('Rates', {
        type: 'geojson',
        data: 'assets/us-covid-2020-rates.json'
    });

map.addLayer({
    'id': 'Rates-layer',
    'type': 'fill',
    'source': 'Rates',
    'paint': {
        'fill-color': [
            'step',
            ['get', 'rates'],
            '#FFEDA0',   // stop_output_0
            10,          // stop_input_0
            '#FED976',   // stop_output_1
            25,          // stop_input_1
            '#FEB24C',   // stop_output_2
            50,          // stop_input_2
            '#FD8D3C',   // stop_output_3
            100,          // stop_input_3
            '#FC4E2A',   // stop_output_4
            150,         // stop_input_4
            '#E31A1C',   // stop_output_5
            200,         // stop_input_5
            '#BD0026',   // stop_output_6
            300,         // stop_input_6
            "#800026"    // stop_output_7
        ],
        'fill-outline-color': '#BBBBBB',
        'fill-opacity': 0.7,
    }
});

const layers = [
    '0-9',
    '10-24',
    '24-49',
    '50-99',
    '100-149',
    '150-199',
    '200-299',
    '300 and more'
];
const colors = [
    '#FFEDA070',
    '#FED97670',
    '#FEB24C70',
    '#FD8D3C70',
    '#FC4E2A70',
    '#E31A1C70',
    '#BD002670',
    '#80002670'
];

const legend = document.getElementById('legend');
legend.innerHTML = "<b>2020 Covid-19 Rates<br>(Covid Cases/County.)</b><br><br>";

layers.forEach((layer, i) => {
    const color = colors[i];
    const item = document.createElement('div');
    const key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;

    const value = document.createElement('span');
    value.innerHTML = `${layer}`;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
});

map.on('mousemove', ({point}) => {
    const state = map.queryRenderedFeatures(point, {
        layers: ['Rates-layer']
    });
    document.getElementById('text-description').innerHTML = state.length ?
        `<h3>${state[0].properties.county}</h3><p><strong><em>${state[0].properties.rates}%</strong> Rates of 2020 Covid-19 Cases</em></p>` :
        `<p>Hover over a County!</p>`;
    });
});
