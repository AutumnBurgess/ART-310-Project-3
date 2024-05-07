function area_new_maps() {
  let startHTML = `<div id="newMapDiv" class="mapContainer"></div>`;
  const BOUND_X = 100;
  const BOUND_Y = 100;
  const BOUNDS = [[0, 0], [BOUND_X, BOUND_Y]];
  let maps = [];
  let nextMapID = 0;
  let remaining = 15;

  function onStart() {
    colorMode(HSB, 100);
    maps.push(makeMapContainer(randomColor()));
    markerToNewMap(maps[0]);
  }

  function randomColor() {
    return color(random(100), random(100), random(100));
  }

  function makeMap(name) {
    let newMap = L.map(name, {
      crs: L.CRS.Simple,
      maxZoom: 3,
      minZoom: 1,
      zoomControl: false,
      attributionControl: false
    });
    newMap.setView([BOUND_X / 2, BOUND_Y / 2], 1);
    newMap.setMaxBounds(BOUNDS);
    return newMap;
  }

  function makeMapContainer(color) {
    let name = 'map' + nextMapID;
    nextMapID++;
    let newDiv = createDiv();
    newDiv.id(name);
    newDiv.parent('newMapDiv');
    newDiv.class('smallMap');
    newDiv.style('background-color', color);
    return makeMap(name);
  }

  function markerToNewMap(map) {
    let marker = L.marker(xy(random(0, BOUND_X), random(0, BOUND_Y)));
    marker.addTo(map);
    marker.on('click', () => {
      marker.removeFrom(map);
      let nextMap = makeMapContainer(randomColor());
      markerToNewMap(nextMap);
      maps.push(nextMap);
      remaining--;
      if (remaining <= 0) {
        setArea('worldMap');
      }
    })
  }
  function onUpdate() { }
  function onReturn() { }
  return { startHTML, onStart, onUpdate, onReturn };

  // function newMapButton(marker, map) {
  //   console.log('new map is being created!');
  //   marker.removeFrom(map);
  //   let nextMap = makeMapContainer(randomColor());
  //   markerToNewMap(nextMap);
  //   maps.push(nextMap);
  // }

  // function randomMarker() {
  //   let placeMap = random(maps);
  //   let marker = L.marker(xy(random(0, BOUND_X), random(0, BOUND_Y)));
  //   marker.addTo(placeMap);

  //   marker.on('click', () => {
  //     marker.removeFrom(placeMap);
  //     randomMarker();
  //   })
  // }
}






