function area_a_lot() {
    let startHTML = `<div id="aLotMap" style="background-color: white;" class="map"></div>`;
    const BOUND_X = 200;
    const BOUND_Y = 200;

    let map;
    let closed = 0;
    let popupOpen = false;

    function onStart() {
        map = L.map('aLotMap', {
            crs: L.CRS.Simple,
            maxZoom: 5,
            minZoom: 2,
            attributionControl: false,
            doubleClickZoom: false
        });

        let bounds = [[0, 0], [BOUND_X, BOUND_Y]];
        map.setView([BOUND_X / 2, BOUND_Y / 2], 2);

        for (let i = 0; i < 2000; i++) {
            randomMarker();
        }
    }

    function randomMarker() {
        let marker = L.marker(xy(random(0, BOUND_X), random(0, BOUND_Y)));
        marker.addTo(map);
        marker.on('click', () => {
            print(popupOpen);
            if (!popupOpen) {
                let popup = L.popup({
                    autoClose: false,
                    closeOnClick: false
                });
                if (closed < 12) {
                    popup.setContent('.'.repeat(random(3, 15)));
                    popup.on('remove', () => {
                        marker.removeFrom(map);
                        popupOpen = false;
                        closed++;
                    });
                } else {
                    popup.setContent('.'.repeat(500));
                    popup.on('remove', () => {
                        setArea('worldMap');
                    });
                }
                marker.bindPopup(popup).openPopup();
                popupOpen = true;
            }
        })
    }

    function onUpdate() { }

    function onReturn() { }
    return { startHTML, onStart, onReturn, onUpdate }
}

