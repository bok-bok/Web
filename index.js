var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 6 // 지도의 확대 레벨 
    }; 
var markers = [];
var circleRadius = 750;
var userLocation;
var d = 375
var new_latitude
var new_longitude
var userMarker


var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다


var circle = new kakao.maps.Circle({ 
    strokeWeight: 1, // 선의 두께입니다
    strokeColor: '#00a0e9', // 선의 색깔입니다
    strokeOpacity: 0.1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid', // 선의 스타일입니다
    fillColor: '#00a0e9', // 채우기 색깔입니다
    fillOpacity: 0.2// 채우기 불투명도입니다 
    
});  



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

            var locPosition = new kakao.maps.LatLng(lat, lon) // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
                
            userLocation = locPosition
            // 마커와 인포윈도우를 표시합니다
            displayCurrentPosition(locPosition);
            circleOptions = {
                center: userLocation,
                radius: circleRadius
            }
            circle.setOptions(circleOptions)
            circle.setMap(map);
        });



    } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

        var locPosition = new kakao.maps.LatLng(33.450701, 126.570667)
            
        
        displayCurrentPosition(locPosition);
    }
}


// 지도에 마커와 인포윈도우를 표시하는 함수입니다
function displayCurrentPosition(locPosition) {

    // 마커를 생성합니다
    userMarker = new kakao.maps.Marker({  
        map: map, 
        position: locPosition,
        image: markerImage
    }); 
    
    
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


    kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
    



        // 클릭한 위도, 경도 정보를 가져옵니다 
        var latlng = mouseEvent.latLng; 
        userLocation = latlng
        // 마커 위치를 클릭한 위치로 옮깁니다
        userMarker.setPosition(latlng);
        circleOptions = {
            center: userLocation,
            radius: circleRadius
        }
        circle.setOptions(circleOptions)
        circle.setMap(map);
        
        
    });
    userMarker = new kakao.maps.Marker({  
        map: map, 
        position: userLocation,
        image: markerImage
    });
}

var k

// 음식점을 찾는 함수 
function catSearch(){
    k = 0
    markers = []
    var points = []
    makeMap()
    circle.setMap(map)
    // 0
    var point0 = new kakao.maps.LatLng(userLocation.getLat, userLocation.getLng);
    points.push(point0)
    // 1
    new_latitude  = userLocation.getLat() + (d / 6378000) * (180 / Math.PI);
    new_longitude = userLocation.getLng() + (d / 6378000) * (180 / Math.PI) / Math.cos(userLocation.getLat() * Math.PI/180);
    var point1 = new kakao.maps.LatLng(new_latitude,new_longitude);
    points.push(point1)
    // 2
    new_latitude  = userLocation.getLat() - (d / 6378000) * (180 / Math.PI);
    new_longitude = userLocation.getLng() + (d / 6378000) * (180 / Math.PI) / Math.cos(userLocation.getLat() * Math.PI/180);
    var point2 = new kakao.maps.LatLng(new_latitude,new_longitude);
    points.push(point2)
    // 3
    new_latitude  = userLocation.getLat() + (d / 6378000) * (180 / Math.PI);
    new_longitude = userLocation.getLng() - (d / 6378000) * (180 / Math.PI) / Math.cos(userLocation.getLat() * Math.PI/180);
    var point3 = new kakao.maps.LatLng(new_latitude,new_longitude);
    points.push(point3)
    // 4
    new_latitude  = userLocation.getLat() - (d / 6378000) * (180 / Math.PI);
    new_longitude = userLocation.getLng() - (d / 6378000) * (180 / Math.PI) / Math.cos(userLocation.getLat() * Math.PI/180);
    var point4 = new kakao.maps.LatLng(new_latitude,new_longitude);
    points.push(point4)
    for(var i = 0; i < points.length; i++){
        Drawmarkers(points[i]);
       
    }
   

    
    

    
}



function Drawmarkers(place){
        
    

    for(var i = 1; i < 4; i++){
        
        ps.categorySearch('FD6', placesSearchCB, 
        {location: place,
        radius:d,
        page:i}); 
    }

}

var markerIndex = []
// 키워드 검색 완료 시 호출되는 콜백함수 입니다
function placesSearchCB (data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        for (var i=0; i<data.length; i++) {
            markers.push(data[i]);
           
        }       
    }
    k++
    if(k == 15){
        start(0,markerIndex)
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







// user Location 가져오기 
findUserPosition()




// slider에 반응하여 원 보여주기 

var result = $(".result");
var slider = $(".slider");
var search = $(".search");

result.text(slider.val())

circleRadius = slider.val()
var circleOptions = {
    center: userLocation,
    radius: 750
}


slider.on("input", function(){
    
    
    
    circleRadius = $(this).val();
    result.text(circleRadius);
    d = circleRadius/2
    circleOptions = {
        center: userLocation,
        radius: circleRadius
    }
    circle.setOptions(circleOptions)
    circle.setMap(map);
    
});

var count
var markersOnMap = []

// search 
var timeTerm

search.on("click", function(){
    // 랜덤으로 뽑은 인덱스중 중복하는 인덱스를 줄이기 위한 리스트 
    markerIndex = []
    markers =[]
    markersOnMap = []
    count = 0
    page = 0
    timeTerm = 100
    catSearch()
    
    
    
    
    
})





function start(counter,markerIndex){
    
    timeTerm *= 1.1
    if(counter < 15){
        setTimeout(function(){
            counter++


            do{
                var randomElement = markers[Math.floor(Math.random() * markers.length)];
                d = randomElement.distance
                
                
                
            }
            while(markerIndex.includes(randomElement) || d == "")

            
            

            markerIndex.push(randomElement)
            
            MakeStarMarker(randomElement)
            start(counter,markerIndex)
        },timeTerm)
    } 
}

var linkpart = "https://map.kakao.com/link/to/"

// 별 마커를 찍는 함수 
function MakeStarMarker(place){
    // 마커를 생성하고 지도에 표시합니다
    
    marker = new kakao.maps.Marker({ 
        
        position: new kakao.maps.LatLng(place.y, place.x),
        image: markerImage
    });
    marker.setMap(map)
    // 나중에 지우기 위해 지금 리스트에 보관 
    if(count >= 1){
        markersOnMap[count - 1].setMap(null)
    }
    link = linkpart + place.id
    
    $(".link").text(place.place_name)
    $(".link").attr("href",link)
    markersOnMap.push(marker)
    count ++
    
    


    // 마커에 클릭이벤트를 등록합니다
        kakao.maps.event.addListener(marker, 'click', function() {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
        infowindow.open(map, marker);
    });

}




// 정확한 나의 위치에 마커찍기


kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
    



    // 클릭한 위도, 경도 정보를 가져옵니다 
    var latlng = mouseEvent.latLng; 
    userLocation = latlng
    // 마커 위치를 클릭한 위치로 옮깁니다
    userMarker.setPosition(latlng);
    circleOptions = {
        center: userLocation
    }
    circle.setOptions(circleOptions)
    circle.setMap(map);
    
    
});








