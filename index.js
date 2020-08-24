
var infowindow = new kakao.maps.InfoWindow({zIndex:1});

var mapContainer = document.getElementById('map')// 지도를 표시할 div 
var mapOption = {
		        center: new kakao.maps.LatLng(37.56608, 126.99001), // 지도의 중심좌표
		        level: 3, // 지도의 확대 레벨
		        mapTypeId : kakao.maps.MapTypeId.ROADMAP // 지도종류
}; 

		// 지도를 생성한다 
var map = new kakao.maps.Map(mapContainer, mapOption); 

var myloc

function searchMyLoc() {
    // HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
    if (navigator.geolocation) {

        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        navigator.geolocation.getCurrentPosition(function (position) {

            var lat = position.coords.latitude, // 위도
                lon = position.coords.longitude; // 경도

            myloc = new kakao.maps.LatLng(lat, lon)
            displayMarker(myloc);

        });

    } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

        myloc = new kakao.maps.LatLng(33.450701, 126.570667),
            message = 'geolocation을 사용할수 없어요..'

        displayMarker(myloc);
    }
}



// 지도에 마커와 인포윈도우를 표시하는 함수입니다
function displayMarker(myloc) {

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({  
        map: map, 
        position: myloc
    }); 
    
    
    var circle = new kakao.maps.Circle({
        map: map, // 원을 표시할 지도 객체
        center : new kakao.maps.LatLng(myloc.getLat(), myloc.getLng()), // 지도의 중심 좌표
        radius : 50, // 원의 반지름 (단위 : m)
        fillColor: '#00a0e9', // 채움 색
        fillOpacity: 0.2, // 채움 불투명도
        strokeWeight: 1, // 선의 두께
        strokeColor: '#00a0e9', // 선 색
        strokeOpacity: 0.9, // 선 투명도 
        strokeStyle: 'solid' // 선 스타일
    });	
    // 지도 중심좌표를 접속위치로 변경합니다
    map.setCenter(myloc);      
}    






// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places(); 


function catSearch(){
    ps.categorySearch('FD6', placesSearchCB, {
        location: new kakao.maps.LatLng(myloc.getLat(), myloc.getLng())
    }); 
}


// 키워드 검색 완료 시 호출되는 콜백함수 입니다
function placesSearchCB (data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        for (var i=0; i<data.length; i++) {
            displayMarkerr(data[i]);    
        }       
    }
}

// 지도에 마커를 표시하는 함수입니다
function displayMarkerr(place) {
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

searchMyLoc()
catSearch()



