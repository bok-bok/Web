var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 6 // 지도의 확대 레벨 
    }; 
var makers = []
var circleRadius;
var userLocation;

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 유저 마커 이미지 생성 
var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png', 
    imageSize = new kakao.maps.Size(24, 35); 

var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);



// 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
var infowindow = new kakao.maps.InfoWindow({zIndex:1});

// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places(map); 


// 사용자의 위치를 찾는 함수 
function findUserPosition() {
    // HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
    if (navigator.geolocation) {

        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        navigator.geolocation.getCurrentPosition(function (position) {

            var lat = position.coords.latitude, // 위도
                lon = position.coords.longitude; // 경도

            var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
                message = '<div style="padding:5px;">여기에 계신가요?!</div>'; // 인포윈도우에 표시될 내용입니다
            userLocation = locPosition
            // 마커와 인포윈도우를 표시합니다
            displayCurrentPosition(locPosition, message);
            
        });

    } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

        var locPosition = new kakao.maps.LatLng(33.450701, 126.570667),
            message = 'geolocation을 사용할수 없어요..'

        displayCurrentPosition(locPosition, message);
    }
}


// 지도에 마커와 인포윈도우를 표시하는 함수입니다
function displayCurrentPosition(locPosition, message) {

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({  
        map: map, 
        position: locPosition,
        image: markerImage
    }); 
    
    var iwContent = message, // 인포윈도우에 표시할 내용
        iwRemoveable = true;

    // 인포윈도우를 생성합니다
    var infowindow = new kakao.maps.InfoWindow({
        content : iwContent,
        removable : iwRemoveable
    });
    
    // 인포윈도우를 마커위에 표시합니다 
    infowindow.open(map, marker);
    
    // 지도 중심좌표를 접속위치로 변경합니다
    map.setCenter(locPosition);      
}    

// 지도 만들고 현재위치 마킹
function makeMap(){
    mapOption = { 
        center: userLocation, // 지도의 중심좌표
        level: 6 // 지도의 확대 레벨 
    }; 
    map = new kakao.maps.Map(mapContainer, mapOption);

    var marker = new kakao.maps.Marker({  
        map: map, 
        position: userLocation,
        image: markerImage
    });
}


var k = 0
// 음식점을 찾는 함수 
function catSearch(){
    makeMap()
    circle.setMap(map)


    for(var i = 1; i < 4; i++){
        ps.categorySearch('FD6', placesSearchCB, 
        {useMapCenter:true,
        radius:circleRadius,
        page:i}); 
    }

    
    
    // 키워드 검색 완료 시 호출되는 콜백함수 입니다
    function placesSearchCB (data, status, pagination) {
        if (status === kakao.maps.services.Status.OK) {
            for (var i=0; i<data.length; i++) {
                displayMarker(data[i]);    
                console.log(data[i])
                k++
                console.log(k)
            }       
        }
    }
}



// 음식점을 표시하는 함수 
function displayMarker(place) {
    // 마커를 생성하고 지도에 표시합니다
    var marker = new kakao.maps.Marker({ 
        map: map,
        position: new kakao.maps.LatLng(place.y, place.x) 
    });

    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'click', function() {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
        infowindow.open(map, marker);
    });
}








findUserPosition()

// slider에 반응하여 원 보여주기 

var result = $(".result");
var slider = $(".slider");



circle = new kakao.maps.Circle({ 
    strokeWeight: 1, // 선의 두께입니다
    strokeColor: '#00a0e9', // 선의 색깔입니다
    strokeOpacity: 0.1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid', // 선의 스타일입니다
    fillColor: '#00a0e9', // 채우기 색깔입니다
    fillOpacity: 0.2, // 채우기 불투명도입니다 
    center: userLocation,
    radius:750
});

circle.setMap(map)

result.text(slider.val())

circleRadius = slider.val()

slider.on("input", function(){
    result.text($(this).val());
    circle.setRadius($(this).val());
    
    circleRadius = $(this).val()
    circle.setMap(map)
    
});


// search 
var search = $(".search")
search.on("click", function(){
    catSearch()
})

// 원 그리기





