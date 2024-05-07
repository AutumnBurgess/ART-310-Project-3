function area_together() {
    let startHTML = `<div id="holeDiv" style="width:900px; display: grid; grid-template-columns: repeat(3, 1fr);"></div>`;
    const BOUND_X = 150;
    const BOUND_Y = 150;
    const BOUNDS = [[-BOUND_X, -BOUND_Y], [2 * BOUND_X, 2 * BOUND_Y]];
    let maps = [];
    let nextMapID = 0;
    let remainingMarkers;

    function onStart() {
        colorMode(HSB, 100);
        // maps.push(makeMapContainer(randomColor()));
        // markerToNewMap(maps[0]);
        maps.push(makeMapContainer());
        let centerMap = (makeMapContainer(true));
        maps.push(makeMapContainer());
        for (const mapA of maps) {
            centerMap.sync(mapA);
        }
        makePolygon(BOUND_X / 2, BOUND_Y / 2, 90, 4, '#f00', '#f03').addTo(centerMap);
        makePolygon(BOUND_X / 3, BOUND_Y / 3, 90, 5, '#0f0', '#3f0').addTo(maps[0]);
        makePolygon(2 * (BOUND_X / 3), 2 * (BOUND_Y / 3), 90, 6, '#00f', '#30f').addTo(maps[1]);
        remainingMarkers = 9;
    }

    function makeMap(id, isCenter) {
        let name = 'holeMap' + id;
        let newMap = L.map(name, {
            crs: L.CRS.Simple,
            maxZoom: 1.8,
            minZoom: 1.8,
            zoomControl: isCenter,
            attributionControl: false
        });
        newMarker(newMap);
        newMarker(newMap);
        newMarker(newMap);
        newMap.setView([BOUND_X / 2, BOUND_Y / 2], 1.8);
        newMap.setMaxBounds(BOUNDS);
        return newMap;
    }

    function newMarker(map) {
        let marker = L.marker(xy(random(0, BOUND_X), random(0, BOUND_Y)));
        marker.on('click', () => {
            marker.removeFrom(map);
            remainingMarkers--;
            if (remainingMarkers == 0) {
                setArea('worldMap');
            }
        })
        marker.addTo(map);
    }

    function makeMapContainer(isCenter = false) {
        let id = nextMapID;
        let name = 'holeMap' + id;
        nextMapID++;
        let newDiv = createDiv();
        newDiv.id(name);
        newDiv.parent('holeDiv');
        newDiv.class('mediumMap');
        newDiv.style('background-color', "white");
        if (!isCenter) newDiv.style('pointer-events', 'none');
        return makeMap(id, isCenter);
    }

    function makeEmptyContainter() {
        let name = 'holeMap' + nextMapID;
        nextMapID++;
        let newDiv = createDiv();
        newDiv.id(name);
        newDiv.parent('holeDiv');
        newDiv.class('mediumMap');
    }

    function makePolygon(x, y, size, points, color, fillColor) {
        let positions = [];
        for (let point = 0; point < points; point++) {
            let theta = map(point, 0, points, 0, TWO_PI);
            positions.push(xy(cos(theta) * size + x, sin(theta) * size + y));
        }
        poly = L.polygon(positions, {
            color: color,
            fillColor: fillColor,
            interactive: false
        });
        return poly;
    }

    function onReturn() { }
    function onUpdate() { }
    return { startHTML, onStart, onReturn, onUpdate }
}