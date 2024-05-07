const DEBUG = false

let areas = {};
let currentArea;

function xy(x, y) {
    if (Array.isArray(x)) {    // When doing xy([x, y]);
        return L.latLng(x[1], x[0]);
    }
    return L.latLng(y, x);  // When doing xy(x, y);
}

function addArea(name, area) {
    area.visited = false;
    area.div = createDiv(area.startHTML);
    area.div.parent('main');
    area.div.style('display', 'none');
    areas[name] = area;
}

function setArea(name) {
    if (currentArea) currentArea.div.style('display', 'none');
    currentArea = areas[name];
    currentArea.div.style('display', '');
    if (currentArea.visited) {
        currentArea.onReturn();
    }
    else {
        currentArea.visited = true;
        currentArea.onStart();
    }
}

function f(func, param = null) {
    if (param == null) return currentArea[func]();
    else return currentArea[func](param);

}

function setup() {
    noCanvas();
    addArea('worldMap', area_worldMap());
    addArea('mirror', area_mirror());
    addArea('heart', area_body());
    addArea('fire', area_fire());
    addArea('a lot', area_a_lot());
    addArea('leader', area_together());
    addArea('new', area_new_maps());
    setArea('worldMap');
}

function draw() {
    currentArea.onUpdate();
}