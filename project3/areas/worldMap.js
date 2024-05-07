function area_worldMap() {
  const startHTML = `<div id="worldMap" style="background-color: white" class="map"></div>`
  const BOUND_X = 200;
  const BOUND_Y = 200;
  const BOUNDS = [[0, 0], [BOUND_X, BOUND_Y]];
  let worldMap;
  let visitedAreas = {};
  let marks;
  let count = 0;
  let timer = 360;

  function onStart() {
    worldMap = L.map('worldMap', {
      crs: L.CRS.Simple,
      maxZoom: 4,
      minZoom: 1.35,
      attributionControl: false
    });

    if (DEBUG) worldMap.on('click', onMapClick);

    marks = [
      [100, 190, 'a lot'],
      [100, 150, 'mirror'],
      [98, 108, 'heart'],
      [124, 31, 'leader'],
      [21, 77, 'fire'],
      [173, 35, 'new'],
    ];

    marks.forEach(mark => {
      visitedAreas[mark[2]] = makeMark(mark[0], mark[1], mark[2]);
    });

    worldMap.setView([BOUND_X / 2, BOUND_Y / 2], 1);
    worldMap.setMaxBounds(BOUNDS);
    L.imageOverlay('project3/assets/body0.png', BOUNDS).addTo(worldMap);
  }

  function makeMark(x, y, name) {
    let marker = L.marker(xy(x, y));
    if (name) {
      let popupText = `<button onclick="f('enter', '${name}')">${name}</button>`;
      marker.bindPopup(popupText).openPopup();
    }
    marker.addTo(worldMap);
    return { marker: marker, position: xy(x, y), name: name, visited: false };
  }

  function enter(name) {
    setArea(name);
    let area = visitedAreas[name];
    if (!area.visited) {
      area.visited = true;
      count++;
      L.imageOverlay(`project3/assets/body${count}.png`, BOUNDS).addTo(worldMap);
      L.circle(area.position, {
        radius: 6,
        interactive: false
      }).addTo(worldMap);
      area.marker.removeFrom(worldMap);
    }
  }

  function onMapClick(e) {
    print(e.latlng.lng + ', ' + e.latlng.lat);
  }

  function onReturn() {
    // if (!DEBUG) incrementMark();
  }

  function onUpdate() {
    if (count == marks.length) {
      timer--;
      if (timer <= 0) {
        // select('#main').style('display', 'none');
        select('#main').html('thank you');
      }
    }
  }
  return { startHTML, onStart, onUpdate, onReturn, enter };
}

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////


function area_worldMap_old() {
  const startHTML = `<div id="worldMap" style="background-color: white" class="map"></div>`
  const BOUND_X = 200;
  const BOUND_Y = 200;
  let worldMap;
  let worldMarks = [];
  let curWorldMark = 0;

  function onStart() {
    worldMap = L.map('worldMap', {
      crs: L.CRS.Simple,
      maxZoom: 1.35,
      minZoom: 1.35,
      attributionControl: false
    });

    if (DEBUG) worldMap.on('click', onMapClick);

    let marks = [
      [97.5, 195.5, 'mirror'],
      [131.5, 179.5, 'body'],
      [140.5, 145.5, 'fire'],
      [185.3, 99.9, 'a lot'],
      [184.5, 62.3, 'leader'],
      [143, 72, ''],
      [140, 22, ''],
      [120.5, 10.5, ''],
      [103.5, 32, ''],
      [84.5, 7, ''],
      [65.5, 32, ''],
      [56, 82.5, ''],//
      [23.5, 58, ''],
      [9, 61, ''],
      [14, 101, ''],
      [58, 185, ''],
      [87, 193.5, '']
    ];

    marks.forEach(mark => {
      worldMarks.push(makeMark(mark[0], mark[1], mark[2]))
    });

    let bounds = [[0, 0], [BOUND_X, BOUND_Y]];
    worldMap.setView([BOUND_X / 2, BOUND_Y / 2], 1);
    worldMap.setMaxBounds(bounds);
    L.imageOverlay('project3/assets/handDown.png', bounds).addTo(worldMap);


    incrementMark();
    if (DEBUG) setMark(marks.length);
  }

  function setMark(markIndex) {
    worldMarks.forEach(mark => {
      mark.removeFrom(worldMap);
    });
    for (let i = 0; i < markIndex; i++) {
      worldMarks[i].addTo(worldMap);
    }
    if (markIndex > 1) {
      let positions = worldMarks.slice(0, markIndex).map(m => m.getLatLng());
      let poly = L.polyline(positions);
      poly.addTo(worldMap);
    }
  }

  function incrementMark() {
    if (curWorldMark >= worldMarks.length) return;
    curWorldMark++;
    setMark(curWorldMark);
  }

  function makeMark(x, y, name) {
    let marker = L.marker(xy(x, y));
    if (name) {
      let popupText = `<button onclick="setArea('${name}')">${name}</button>`;
      marker.bindPopup(popupText).openPopup();
    }
    return marker;
  }

  function onMapClick(e) {
    print(e.latlng.lng + ', ' + e.latlng.lat);
  }

  function onReturn() {
    if (!DEBUG) incrementMark();
  }

  function onUpdate() { }
  return { startHTML, onStart, onUpdate, onReturn, incrementMark };
}