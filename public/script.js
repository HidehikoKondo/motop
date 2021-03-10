//マーカーの配置場所配列
const locations = [
    { lat: 35.1709071, lng: 136.909453 },
    { lat: 35.1709076, lng: 136.8074532 },
    { lat: 35.1709076, lng: 136.7074532 },
    { lat: 35.1709076, lng: 136.6074532 },
    { lat: 35.1709076, lng: 136.5074532 },
    { lat: 35.1709076, lng: 136.4074532 },
    { lat: 35.1709076, lng: 136.3074532 },
    { lat: 35.1709076, lng: 136.2074532 },
    { lat: 35.1709076, lng: 136.1074532 },
    { lat: 35.1709076, lng: 136.0074532 },

];



// < !--メニューの制御 -->
//OnsenUI初期設定
window.fn = {};
window.fn.open = function () {
    var menu = document.getElementById('menu');
    menu.open();
};
window.fn.load = function (page) {
    var content = document.getElementById('content');
    var menu = document.getElementById('menu');
    content.load(page)
        .then(menu.close.bind(menu));
};

//アクションシートの制御
var app = {};
ons.ready(function () {
    ons.createElement('action-sheet.html', { append: true })
        .then(function (sheet) {
            app.showFromTemplate = sheet.show.bind(sheet);
            app.hideFromTemplate = sheet.hide.bind(sheet);
        });
});



// <!--マップの制御 -->
let map;
let infoWindow;
let currenMarker;
var selectedLatLng;

function initMap() {

    //マップの初期位置
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 18,
        center: { lat: 35.1709076, lng: 136.9074532 },
        disableDefaultUI: true,
        //                zoomControl: true,
        streetViewControl: false,
        //お店のアイコン削除
        clickableIcons: false,
        styles: [{
            featureType: 'poi.business',
            stylers: [
                { visibility: 'off' }
            ]
        }]
    });

    //ストリートビュー
    const astorPlace = { lat: 40.729884, lng: -73.990988 };
    // Set up the markers on the map
    const cafeMarker = new google.maps.Marker({
        position: { lat: 40.730031, lng: -73.991428 },
        map,
        icon:
            "https://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe|FFFF00",
        title: "Cafe",
    });
    const bankMarker = new google.maps.Marker({
        position: { lat: 40.729681, lng: -73.991138 },
        map,
        icon:
            "https://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=dollar|FFFF00",
        title: "Bank",
    });
    const busMarker = new google.maps.Marker({
        position: { lat: 40.729559, lng: -73.990741 },
        map,
        icon:
            "https://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=bus|FFFF00",
        title: "Bus Stop",
    });
    // We get the map's default panorama and set up some defaults.
    // Note that we don't yet set it visible.
    panorama = map.getStreetView(); // TODO fix type


    //ジオコーディングの初期化
    const geocoder = new google.maps.Geocoder();


    //現在地用のマーカー
    currenMarker = new google.maps.Marker({
        position: { lat: 35.1709076, lng: 136.9074532 },
        map: map,
        title: "現在地",
        icon:
            "images/currentPosition.svg",

    });
    // 現在地のマーカーをクリックしたとき
    currenMarker.addListener('click', function (e) {
        selectedLatLng = currenMarker.position;
        infoWindow.close();
        app.showFromTemplate();
        infoWindow.open(map, currenMarker); // 吹き出しの表示
        geocodeLatLng(geocoder, map, infoWindow, currenMarker);
    });

    //起動後に現在地に移動
    currentPosition();

    //吹き出し
    infoWindow = new google.maps.InfoWindow({ // 吹き出しの追加
        content: '現在地'
    });

    // マーカー（クリック）
    var marker = new google.maps.Marker({
        position: { lat: 0, lng: 0 },
        map: map,
        draggable: true,
    });
    marker.addListener('click', function () { // マーカーをクリックしたとき
        selectedLatLng = marker.position;
        infoWindow.open(map, marker); // 吹き出しの表示
        geocodeLatLng(geocoder, map, infoWindow, marker);
        app.showFromTemplate();
    });
    marker.addListener('dragend', function () { // マーカーをドラッグ後
        selectedLatLng = marker.position;
        infoWindow.open(map, marker); // 吹き出しの表示
        geocodeLatLng(geocoder, map, infoWindow, marker);

    });

    //マップのクリックイベント
    map.addListener("click", (e) => {
        placeMarkerAndPanTo(e.latLng, map, marker);
    });
    // マーカーの配置とマーカーの位置に移動
    function placeMarkerAndPanTo(latLng, map, marker) {
        marker.setPosition(latLng)
        map.panTo(latLng);
        infoWindow.close();
    }

    //マーカーのラベル
    // Create an array of alphabetical characters used to label the markers.
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // Add some markers to the map.
    // Note: The code uses the JavaScript Array.prototype.map() method to
    // create an array of markers based on a given "locations" array.
    // The map() method here has nothing to do with the Google Maps API.
    const markers = locations.map((location, i) => {
        return new google.maps.Marker({
            position: location,
            label: labels[i % labels.length],
        });
    });

    //クラスター
    // Add a marker clusterer to manage the markers.
    new MarkerClusterer(map, markers, {
        imagePath:
            "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    });


    document.getElementById("submit").addEventListener("click", () => {
        geocodeLatLng(geocoder, map, infoWindow);
    });


}

function currentPosition() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.se
                currenMarker.setPosition(pos);
                map.setCenter(pos);
            },
            () => {
                handleLocationError(true, infoWindow, map.getCenter());
            }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    var message = browserHasGeolocation
        ? "エラー: GPSの位置情報が読み込めませんでした"
        : "エラー: GPSが使えないデバイスです"
    ons.notification.toast(message, { timeout: 3000, animation: 'fall' });
}


function geocodeLatLng(geocoder, map, infowindow, marker) {
    const latlng = marker.position;
    geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK") {
            if (results[0]) {
                // marker = new google.maps.Marker({
                //     position: latlng,
                //     map: map,
                // });
                infowindow.setContent(results[0].formatted_address + "付近");
                infowindow.open(map, marker);
            } else {
                window.alert("No results found");
            }
        } else {
            window.alert("Geocoder failed due to: " + status);
        }
    });
}


//アクションシートのストリートビュー
function openStreetView() {
    panorama.setPosition(selectedLatLng);
    panorama.setPov(
    /** @type {google.maps.StreetViewPov} */ {
            heading: 265,
            pitch: 0,
        }
    );

    //ストリートビューを閉じたらメニューを再表示
    panorama.addListener("closeclick", function (argument) {
        openMenu();
    });


    const toggle = panorama.getVisible();
    if (toggle == false) {
        panorama.setVisible(true);
        closeMenu();
    } else {
        panorama.setVisible(false);

    }
}



//メニューの表示非表示
function openMenu() {
    document.getElementById("humbrugerMenu").show();
    document.getElementById("currentPositionButton").show();
}
function closeMenu() {
    document.getElementById("humbrugerMenu").hide();
    document.getElementById("currentPositionButton").hide();
}

//投稿ボタン
function share() {
    alert("開発中です");
}