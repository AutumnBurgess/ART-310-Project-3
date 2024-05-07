function area_mirror() {
    let startHTML = `<div class="mapContainer">
    <div class="smallMap"><div id="mirrorMapBody" style="background-color: white" class="smallMap"></div></div>
    <div id="mirrorMapMirror" style="background-color: white; margin-left:15px; margin-right:15px;" class="smallMap"></div>
    <div class="smallMap"><div id="mirrorMapMess" style="background-color: white" class="smallMap"></div></div>
    </div>`;
    const BOUND_X = 200;
    const BOUND_Y = 200;
    const MIRROR_MAX = 75;

    let mapMirror;
    let mapBody;
    let mapMess;
    let mirrorCenter;
    let divMess;
    let messes = [];
    let curMess = 0;
    let timer = 120;
    let bounds;
    let breakMarker;
    let endMarker;
    let brokenImage;

    function onStart() {
        let mapDiv = createDiv();
        mapDiv.parent('main');

        mirrorCenter = createVector(57, 147);
        divMess = select('#mirrorMapMess');
        colorMode(HSB, 100);

        mapBody = L.map('mirrorMapBody', {
            crs: L.CRS.Simple,
            maxZoom: 0.5,
            minZoom: 0.5,
            attributionControl: false
        });
        mapMirror = L.map('mirrorMapMirror', {
            crs: L.CRS.Simple,
            maxZoom: 2.2,
            minZoom: 2.2,
            attributionControl: false
        });
        mapMess = L.map('mirrorMapMess', {
            crs: L.CRS.Simple,
            maxZoom: 0.9,
            minZoom: 0.9,
            attributionControl: false
        });
        bounds = [[0, 0], [BOUND_X, BOUND_Y]];
        mapMirror.setView([(BOUND_X / 3), 2 * (BOUND_Y / 3)], 1);
        mapMirror.setMaxBounds(bounds);
        mapBody.setView([BOUND_X / 2, BOUND_Y / 2], 1);
        mapBody.setMaxBounds(bounds);
        mapMess.setView([BOUND_X / 2, BOUND_Y / 2], 1);
        mapMess.setMaxBounds(bounds);
        L.imageOverlay('project3/assets/mirror.png', bounds).addTo(mapMirror);
        L.imageOverlay('project3/assets/handDown.png', bounds).addTo(mapBody);

        messes.push(L.imageOverlay('project3/assets/mess1.png', bounds));
        messes.push(L.imageOverlay('project3/assets/mess2.png', bounds));
        messes.push(L.imageOverlay('project3/assets/mess3.png', bounds));
        if (DEBUG) mapMirror.on('click', onMapClick);
    }

    function onUpdate() {
        let mapCenter = mapMirror.getCenter();
        let mirrorCenterVec = createVector(mapCenter.lng, mapCenter.lat);
        let distance = mirrorCenterVec.dist(mirrorCenter);
        let opacity = map(distance, 0, MIRROR_MAX, 1, 0, true);
        let animSpeed = floor(map(distance, 0, MIRROR_MAX, 4, 12, true));
        if (frameCount % animSpeed == 0) {
            curMess = (curMess + 1) % messes.length;
            setMess(curMess);
        }
        messes[curMess].setOpacity(opacity);
        let saturation = map(distance, 0, MIRROR_MAX / 2, 40, 0);
        divMess.style('background-color', color(0, saturation, 100));
        if (distance < 15) {
            timer--;
            if (timer == 0) {
                breakMarker = L.marker(xy(58.5, 145.5));
                breakMarker.bindPopup(`<button onclick="f('breakMirror')">break</button>`);
                breakMarker.addTo(mapMirror);
            }
        }
    }

    function breakMirror() {
        brokenImage = L.imageOverlay('project3/assets/brokenMirror.png', bounds).addTo(mapMirror);
        select('#mirrorMapMess').style('display', 'none');
        select('#mirrorMapBody').style('display', 'none');
        breakMarker.removeFrom(mapMirror);
        endMarker = L.marker(xy(141.6, 5.8));
        endMarker.bindPopup(`<button onclick="setArea('worldMap')">put away</button>`);
        endMarker.addTo(mapMirror);
    }

    function setMess(index) {
        messes.forEach(img => {
            img.removeFrom(mapMess);
        });
        messes[index].addTo(mapMess);
    }

    function onMapClick(e) {
        print(e.latlng.lng + ', ' + e.latlng.lat);
    }

    function onReturn() {
        timer = 120;
        brokenImage.removeFrom(mapMirror);
        endMarker.removeFrom(mapMirror);
        select('#mirrorMapMess').style('display', '');
        select('#mirrorMapBody').style('display', '');
    }

    return { startHTML, onStart, onReturn, onUpdate, breakMirror }
}
