function area_fire() {
    let startHTML = `<div id="fireMap" style="background-color: white;" class="map"></div>`;
    const BOUND_X = 200;
    const BOUND_Y = 200;

    let map;
    let marks = [];
    let poly;

    function onStart() {
        map = L.map('fireMap', {
            crs: L.CRS.Simple,
            maxZoom: 1,
            minZoom: 1,
            attributionControl: false,
            doubleClickZoom: false
        });

        if (DEBUG) map.on('click', onMapClick);

        let bounds = [[0, 0], [BOUND_X, BOUND_Y]];
        map.setView([BOUND_X / 2, BOUND_Y / 2], 1);
        map.setMaxBounds(bounds);
        onReturn();
    }

    function makePoly() {
        if (poly) poly.removeFrom(map);
        xys = [];
        marks.forEach(mark => {
            xys.push(xy(mark.pos.x, mark.pos.y));
        });
        xys.push(xy(marks[0].pos.x, marks[0].pos.y));
        poly = L.polygon(xys, { color: 'red', fillColor: '#f03' });
        poly.addTo(map);
    }

    function onUpdate() {
        if (frameCount % 10 == 0) {
            marks.forEach(mark => {
                mark.update();
            });
            makePoly();
        }
    }

    class Mover {
        constructor(x, y, index) {
            this.basePos = createVector(x, y);
            this.pos = createVector(x, y);
            this.mark = L.marker(xy(this.basePos.x, this.basePos.y), { color: 'red' });
            this.mark.addTo(map);
            this.index = index;
            this.mark.on('click', () => {
                this.mark.removeFrom(map);
                if (marks.length > 1) {
                    let removeIndex = marks.map(e => e.index).indexOf(this.index);
                    marks.splice(removeIndex, 1);
                } else {
                    setArea('worldMap');
                }
            });
        }

        update() {
            let offset = p5.Vector.random2D().mult(random(5));
            this.pos = p5.Vector.add(this.basePos, offset);
            this.mark.setLatLng(xy(this.pos.x + offset.x, this.pos.y + offset.y));
        }
    }

    function onMapClick(e) {
        print(e.latlng.lng + ', ' + e.latlng.lat);
    }

    function onReturn() {
        marks = [];
        let positions = [
            [-51.5, -46],
            [25, 192.5],
            [49.5, 113],
            [63.5, 149],
            [91.5, 50],
            [104.5, 199.5],
            [138, 104],
            [155.5, 162],
            [176, 52],
            [194, 120],
            [249.5, -40]];
        for (let i = 0; i < positions.length; i++) {
            const position = positions[i];
            marks.push(new Mover(position[0], position[1], i));
        }
        makePoly();
    }
    return { startHTML, onStart, onReturn, onUpdate }
}

