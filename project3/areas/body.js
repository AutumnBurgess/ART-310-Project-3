function area_body() {
    const startHTML = `<div id="bodyMap" style="background-color: white" class="map"></div>`;

    const BOUND_X = 200;
    const BOUND_Y = 200;
    let map;
    let bodyImages = [];
    let bodyMarkers = [];
    let heartImages = [];
    let heartMarkers = [];
    let heartSize = 2;
    const heartX = 102;
    const heartY = 110;
    const PIXEL_SIZE = 3;

    function onStart() {
        map = L.map('bodyMap', {
            crs: L.CRS.Simple,
            maxZoom: 2.2,
            minZoom: 2.2,
            attributionControl: false
        });

        let bounds = [[0, 0], [BOUND_X, BOUND_Y]];
        map.setMaxBounds(bounds);
        map.setView([BOUND_X / 2, BOUND_Y / 2 - 100], 1);

        bodyImages.push(L.imageOverlay('project3/assets/handDown.png', bounds));
        bodyImages.push(L.imageOverlay('project3/assets/handOut.png', bounds));
        bodyMarkers.push(makeBodyMarker(21.25, 71, 'reach', 1));
        bodyMarkers.push(makeBodyMarker(21.75, 95.5, 'hurt', 0, 'hate'));

        heartImages.push(undefined);
        heartImages.push(makeHeartImage('project3/assets/heart1.png', 3, 4));
        heartImages.push(makeHeartImage('project3/assets/heart2.png', 7, 6));
        heartImages.push(makeHeartImage('project3/assets/heart3.png', 9, 8));
        heartImages.push(makeHeartImage('project3/assets/heart4.png', 11, 10));
        heartMarkers.push(makeHeartMarker());
        heartMarkers.push(makeHeartMarker());
        heartMarkers.push(makeHeartMarker());
        heartMarkers.push(makeHeartMarker(true));
        setBody(0);
        heartImages[2].addTo(map);
    }

    function setBody(index) {
        index = parseInt(index);
        bodyImages.forEach(image => {
            image.removeFrom(map);
        });
        bodyMarkers.forEach(marker => {
            marker.removeFrom(map);
        });

        bodyImages[index].addTo(map);
        bodyMarkers[index].addTo(map);
    }

    function setHeart(index) {
        heartImages.forEach(image => {
            if (image) image.removeFrom(map);
        });
        heartMarkers.forEach(marker => {
            marker.removeFrom(map);
        });
        heartMarkers[index].addTo(map);
        if (index > 0) heartImages[index].addTo(map);

    }

    function love() {
        if (heartSize >= heartMarkers.length) return;
        heartSize++;
        setHeart(heartSize);
    }

    function hate() {
        if (heartSize <= 0) return;
        heartSize--;
        setHeart(heartSize);
    }

    function makeHeartImage(src, w, h) {
        let xOffset = (PIXEL_SIZE * w) / 2;
        let yOffset = (PIXEL_SIZE * h) / 2;
        let bounds = [[heartY - yOffset, heartX - xOffset], [heartY + yOffset, heartX + xOffset]];
        return L.imageOverlay(src, bounds);
    }

    function makeHeartMarker(final = false) {
        let marker = L.marker(xy(heartX, heartY - 4));
        if (final) marker.bindPopup(`<button onclick="setArea('worldMap')">escape</button>`);
        else marker.bindPopup(`<button onclick="f('love')">love</button>`);
        return marker;
    }

    function makeBodyMarker(x, y, text, index, extraFunction = '') {
        let marker = L.marker(xy(x, y));
        marker.bindPopup(`<button onclick="f('setBody', '${index}');f('${extraFunction}')">${text}</button>`);
        return marker;
    }

    function onUpdate() { }
    function onReturn() { }
    return { startHTML, onStart, onUpdate, onReturn, love, hate, setBody };
}